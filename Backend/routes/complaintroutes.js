const express = require("express");
const mongoose = require("mongoose");
const {
  requireAuth,
  getAuth,
  clerkClient,
} = require("@clerk/express");

const Complaint = require("../models/complaint");
const Notification = require("../models/notification");

const router = express.Router();

// Check whether the signed-in user is an admin
async function requireAdmin(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in.",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify admin access.",
    });
  }
}

// Register a complaint
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in.",
      });
    }

    const {
      title,
      category,
      location,
      priority,
      description,
      imageUrls,
    } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required complaint details.",
      });
    }

    // Validate image URLs received from the frontend
    if (
      imageUrls !== undefined &&
      (!Array.isArray(imageUrls) ||
        imageUrls.length > 5 ||
        !imageUrls.every(
          (url) =>
            typeof url === "string" &&
            url.startsWith("https://")
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid image URLs. You can attach up to 5 images.",
      });
    }

    const complaint = await Complaint.create({
      userId,
      title,
      category,
      location,
      priority,
      description,
      imageUrls: imageUrls || [],
    });

    await Notification.create({
      userId,
      complaintId: complaint._id,
      message: `Your complaint "${complaint.title}" has been registered successfully.`,
      type: "registered",
    });

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Register complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register complaint.",
    });
  }
});

// Get complaints belonging to the signed-in resident
router.get("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in.",
      });
    }

    const complaints = await Complaint.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Fetch complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
});

// Get all complaints for admin
router.get(
  "/admin",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .sort({ createdAt: -1 })
        .lean();

      const complaintsWithResident = await Promise.all(
        complaints.map(async (complaint) => {
          try {
            const user = await clerkClient.users.getUser(
              complaint.userId
            );

            const residentName =
              [user.firstName, user.lastName]
                .filter(Boolean)
                .join(" ") ||
              user.username ||
              user.emailAddresses?.[0]?.emailAddress ||
              "Unknown Resident";

            return {
              ...complaint,
              residentName,
            };
          } catch {
            return {
              ...complaint,
              residentName: "Unknown Resident",
            };
          }
        })
      );

      return res.json({
        success: true,
        complaints: complaintsWithResident,
      });
    } catch (error) {
      console.error("Admin complaints error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch complaints.",
      });
    }
  }
);

// Update complaint status and notify the resident
router.patch(
  "/:id/status",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint ID.",
        });
      }

      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status.",
        });
      }

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found.",
        });
      }

      if (complaint.status !== status) {
        complaint.status = status;
        await complaint.save();

        const messages = {
          Pending: "Your complaint is pending.",
          "In Progress": "Your complaint is now in progress.",
          Resolved: "Your complaint has been resolved.",
        };

        await Notification.create({
          userId: complaint.userId,
          complaintId: complaint._id,
          message: `${complaint.title}: ${messages[status]}`,
          type: "status_update",
        });
      }

      return res.json({
        success: true,
        message: "Complaint status updated successfully.",
        complaint,
      });
    } catch (error) {
      console.error("Update complaint status error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update complaint status.",
      });
    }
  }
);

// Get notifications for the signed-in resident
router.get(
  "/notifications",
  requireAuth(),
  async (req, res) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Please sign in.",
        });
      }

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.error("Resident notifications error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch notifications.",
      });
    }
  }
);

// Mark one notification as read by its resident
router.patch(
  "/resident/notifications/:id/read",
  requireAuth(),
  async (req, res) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Please sign in.",
        });
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID.",
        });
      }

      const notification = await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          userId,
        },
        { $set: { read: true } },
        { new: true, runValidators: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
        });
      }

      return res.json({
        success: true,
        message: "Notification marked as read.",
        notification,
      });
    } catch (error) {
      console.error("Resident mark-as-read error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update notification.",
      });
    }
  }
);

// Get all notifications for admin
router.get(
  "/admin/notifications",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    try {
      const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      const notificationsWithResident = await Promise.all(
        notifications.map(async (notification) => {
          try {
            const user = await clerkClient.users.getUser(
              notification.userId
            );

            const residentName =
              [user.firstName, user.lastName]
                .filter(Boolean)
                .join(" ") ||
              user.username ||
              user.emailAddresses?.[0]?.emailAddress ||
              "Unknown Resident";

            return {
              ...notification,
              residentName,
            };
          } catch {
            return {
              ...notification,
              residentName: "Unknown Resident",
            };
          }
        })
      );

      return res.json({
        success: true,
        notifications: notificationsWithResident,
      });
    } catch (error) {
      console.error("Admin notifications error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin notifications.",
      });
    }
  }
);

// Mark one notification as read by admin
router.patch(
  "/notifications/:id/read",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID.",
        });
      }

      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { $set: { read: true } },
        { new: true, runValidators: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
        });
      }

      return res.json({
        success: true,
        message: "Notification marked as read.",
        notification,
      });
    } catch (error) {
      console.error("Admin mark-as-read error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update notification.",
      });
    }
  }
);

// Mark all notifications as read by admin
router.patch(
  "/notifications/read-all",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    try {
      await Notification.updateMany(
        { read: false },
        { $set: { read: true } }
      );

      return res.json({
        success: true,
        message: "All notifications marked as read.",
      });
    } catch (error) {
      console.error("Mark all notifications read error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update notifications.",
      });
    }
  }
);

// Delete one notification by admin
router.delete(
  "/notifications/:id",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID.",
        });
      }

      const notification = await Notification.findByIdAndDelete(
        req.params.id
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
        });
      }

      return res.json({
        success: true,
        message: "Notification deleted successfully.",
      });
    } catch (error) {
      console.error("Delete notification error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete notification.",
      });
    }
  }
);

module.exports = router;

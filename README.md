# 🏢 Smart Complaint Management System

A web-based complaint management platform designed for cooperative housing societies. It helps residents submit complaints, track their progress, and stay updated, while administrators can manage and resolve society-related issues efficiently.

<p align="center">
  <b>Better Homes. Happier Communities.</b>
</p>

---

## 🌐 Live Demo

**Website:** https://smartcomplaintmanagementsystem-jk5s2xrlc-mayur-a198.vercel.app/
---

## 📌 About the Project

The **Smart Complaint Management System** is developed to make complaint handling easier, faster, and more transparent in cooperative housing societies.

Traditional complaint management often involves manual registers, verbal communication, and difficulty tracking complaint progress.

This application provides a centralized digital platform where residents can raise complaints and monitor their status, while administrators can manage complaints through an organized dashboard.

The project was developed as part of the **Community Engagement Project (CEP)** for B.Sc. Information Technology.

---

## ✨ Key Features

### 👤 Resident Panel
- Secure user authentication and login.
- Submit new society complaints.
- Upload complaint images.
- View submitted complaints.
- Track complaint status.
- View complaint history.
- Receive notifications and updates.
- Access a resident dashboard.

### 🛡️ Admin Panel
- Admin dashboard.
- View and manage resident complaints.
- Update complaint status.
- Monitor pending complaints.
- Track in-progress and resolved complaints.
- Manage society complaint records.

### ⚙️ Other Features
- Responsive user interface.
- REST API integration.
- MongoDB database connectivity.
- Cloud-based image storage using Cloudinary.
- Role-based access for residents and administrators.

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| React.js | Building user interfaces |
| Vite | Frontend development and build tool |
| JavaScript | Application functionality |
| Tailwind CSS | Styling and responsive design |
| React Router | Page navigation |
| Lucide React | Icons |
| Clerk | User authentication |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| Clerk Express | Backend authentication |
| Cloudinary | Cloud-based image storage and management |

### Deployment & Tools
| Technology | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Git | Version control |
| GitHub | Source code hosting |

---

## ☁️ Cloudinary Integration

The project uses **Cloudinary** for cloud-based image storage and management.

- Stores uploaded complaint images in the cloud.
- Provides image URLs for displaying uploaded images.
- Avoids storing image files directly on the backend server.
- Makes uploaded images accessible through cloud URLs.

---

## 🏗️ Project Architecture

The application follows a frontend-backend architecture.

```text
             Resident / Admin
                    |
                    v
             React Frontend
               (Vite)
                    |
                    v
             Express REST API
               (Node.js)
                    |
          +---------+---------+
          |                   |
          v                   v
     MongoDB Atlas         Clerk
      Database          Authentication
          |
          |
          v
       Cloudinary
     Image Storage
```

---

## 📂 Project Structure

```text
Smart-Complaint-Management-System/
│
├── Frontend/
│   └── complaint_management_web/
│       ├── public/
│       ├── src/
│       │   ├── Components/
│       │   ├── Pages/
│       │   ├── assets/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
├── Backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*Note: Folder names are representative. Adjust them if your actual repository structure differs.*

---

## ⚙️ Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/MAYUR2005-A/Smart-Complaint-Management-System.git
```

Move into the project directory:

```bash
cd Smart-Complaint-Management-System
```

### 2. Backend Setup

Open a terminal and run:

```bash
cd Backend
npm install
```

Create a `.env` file inside the Backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend/complaint_management_web
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the frontend:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

---

## 🔗 API Endpoints

The backend provides REST API endpoints for complaint management.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/complaints` | Retrieve complaints |
| POST | `/api/complaints` | Submit a new complaint |

**Authentication:** Protected API requests use Clerk authentication tokens.

---

## 🚀 Deployment

The application is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |
| Authentication | Clerk |

---

## 🔐 Security and Environment Variables

- Environment variables are used to manage sensitive credentials.
- Clerk handles user authentication.
- Protected backend API requests require authentication.
- MongoDB Atlas stores application data.
- Cloudinary manages uploaded images.

**Important:** Never upload your `.env` files, API secrets, database credentials, or private authentication keys to GitHub.

Make sure `.env` is included in your `.gitignore` file.

---

## 👨‍💻 Developed By

**Mayur Mahendra Devatwal**  
**Ujjwal Sushil Dubey**  
**Nilesh Manoj Jha**

**Course:** Bachelor of Science in Information Technology (B.Sc. IT)  
**College:** Ghanshyamdas Saraf College  
**Academic Year:** 2026–2027

---

## 🎓 Project Information

**Project Title:** Smart Complaint Management System

**Project Type:** Community Engagement Project (CEP)

**Domain:** Web Application Development

---

## 📄 License

This project was developed for academic purposes as part of the Community Engagement Project.


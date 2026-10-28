import React from 'react'

const FeatureSection = () => {

  const features = [
    {
      number: 1,
      title: "Register / Login",
      description: "Create your account or login to your existing one.",
      icon: "👤"
    },
    {
      number: 2,
      title: "Submit Complaint",
      description: "Fill in the details and upload if needed.",
      icon: "📄"
    },
    {
      number: 3,
      title: "Track Status",
      description: "Check real-time updates on your dashboard.",
      icon: "👁"
    },
    {
      number: 4,
      title: "Get Resolution",
      description: "Your issue will be resolved and you'll be notified.",
      icon: "✓"
    }
  ]

  return (
    <div className="bg-[#f8fbff] py-20 px-10" id="Working">
      <div className="text-center">
        <span className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-semibold">
          How It Works
        </span>
        <h1 className="text-5xl font-bold text-[#18325c] mt-6">
          Just <span className="text-[#4f46e5]">4</span> Simple Steps
        </h1>
        <p className="text-gray-500 text-lg mt-4">
          From complaint to resolution, we make the process easy and transparent.
        </p>
      </div>
      <div className="flex justify-center items-start mt-16">
        {features.map((feature, index) => (
          <React.Fragment key={feature.number}>
            <div className="w-64 text-center">
              <div className="w-36 h-36 mx-auto rounded-full bg-blue-50
                              flex items-center justify-center text-5xl">
                {feature.icon}
              </div>
              <div className="flex items-center justify-center gap-3 mt-6">

                <div className="w-10 h-10 rounded-full bg-blue-600
                                text-white flex items-center justify-center
                                font-bold">
                  {feature.number}
                </div>
                <h2 className="text-xl font-bold text-[#18325c]">
                  {feature.title}
                </h2>
              </div>
              <p className="text-gray-500 mt-5 leading-7">
                {feature.description}
              </p>
            </div>
            {index < features.length - 1 && (
              <div className="text-4xl text-gray-300 mt-12 mx-5">
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default FeatureSection
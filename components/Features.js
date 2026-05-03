export default function Features() {
  const features = [
    {
      icon: "🏠",
      title: "Property Listing Writer",
      description: "Enter property details and get a professional listing description in seconds. Save 30 minutes per listing."
    },
    {
      icon: "📱",
      title: "Social Media Captions",
      description: "Generate engaging Instagram and Facebook posts for your properties. Get more leads from social media."
    },
    {
      icon: "📧",
      title: "Buyer Email Templates",
      description: "Send professional follow-up emails to potential buyers automatically. Close deals faster."
    },
    {
      icon: "📄",
      title: "Contract Summarizer",
      description: "Paste any contract and get a plain English summary instantly. Understand documents in seconds."
    }
  ];

  return (
    <section id="features" className="w-full py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Everything a Realtor Needs
        </h2>
        <p className="text-center text-gray-500 mb-16 text-lg">
          Save hours every week with AI powered tools built for real estate agents
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
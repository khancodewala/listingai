export default function Dashboard() {
  const history = [
    { id: 1, type: "Property Listing", location: "Austin, Texas", date: "May 1, 2026" },
    { id: 2, type: "Social Media Caption", location: "New York, NY", date: "May 1, 2026" },
    { id: 3, type: "Buyer Email", location: "Los Angeles, CA", date: "Apr 30, 2026" },
  ];
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back!</p>
          </div>
          <a href="/generate" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">New Generation</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Generations</p>
            <p className="text-4xl font-bold text-gray-800 mt-1">3</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Generations Left</p>
            <p className="text-4xl font-bold text-blue-600 mt-1">2</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Current Plan</p>
            <p className="text-4xl font-bold text-green-600 mt-1">Free</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Generations</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Type</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{item.type}</td>
                  <td className="py-3 text-gray-500">{item.location}</td>
                  <td className="py-3 text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
export default function PremiumPage() {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-gray-600 mb-6">
          Unlock unlimited match requests and chat freely with anyone. Premium features coming soon.
        </p>
  
        <button
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          onClick={() => alert("Integrate payment gateway here")}
        >
          Subscribe Now
        </button>
      </div>
    );
  }
  
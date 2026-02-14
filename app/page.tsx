

export default function Home() {
  return (
     <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">
        Electro-AI Hardware Assistant
      </h1>

      <p className="text-lg text-gray-400 mb-8 text-center max-w-xl">
        Upload a circuit image and get instant AI-based explanation and troubleshooting help.
      </p>

      <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
        Upload Circuit Image
      </button>
    </main>

  );
}

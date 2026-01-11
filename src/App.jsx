import { RocketLaunchIcon } from "@heroicons/react/24/solid";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-10">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">
        Welcome to Moodscape ✨
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 w-fit border border-gray-200">
        <p className="text-gray-700 mb-4">Track your thoughts. Understand your moods.</p>

        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-4 py-2 text-white rounded-lg">
          <RocketLaunchIcon className="w-5 h-5" />
          Launch 🚀
        </button>
      </div>
    </div>
  );
}

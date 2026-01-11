import { Link } from "react-router-dom";

export default function LaunchCard() {
  return (
    <Link
      to="/login"
      className="inline-block bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-xl shadow-md text-lg font-medium"
    >
      Launch App 🚀
    </Link>
  );
}

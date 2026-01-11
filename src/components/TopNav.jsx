import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { 
  MoonIcon, 
  SunIcon,
  ArrowRightOnRectangleIcon, 
  XMarkIcon 
} from "@heroicons/react/24/solid";

export default function TopNav({ darkMode, setDarkMode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      // Redirecting to Landing page instead of Login
      navigate("/"); 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      {/* Top Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all border 
            ${darkMode 
              ? "bg-slate-800/80 border-white/10 text-yellow-400" 
              : "bg-white/80 border-white/50 text-gray-700"}`}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 animate-pulse" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`w-12 h-12 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all border
            ${darkMode 
              ? "bg-slate-800/80 border-white/10" 
              : "bg-white/80 border-white/50"}`}
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-500" />
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`rounded-3xl p-8 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-300 border
            ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-white/50"}`}>
            
            <button
              onClick={() => setShowLogoutModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-full transition
                ${darkMode ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-100 text-gray-400"}`}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightOnRectangleIcon className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Log out?
              </h3>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Are you sure you want to leave your calm space for now?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmLogout}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20"
              >
                Yes, Log me out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`w-full py-4 rounded-2xl font-bold transition border
                  ${darkMode 
                    ? "border-white/10 text-gray-300 hover:bg-white/5" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                Stay a while
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
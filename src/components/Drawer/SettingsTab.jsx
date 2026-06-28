import React, { useState } from "react";
import { FaBell, FaMoon, FaSignOutAlt } from "react-icons/fa";
import BaseLoader from "../../@base/BaseLoader";
import { useNavigate } from "react-router-dom";

export default function SettingsTab() {
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const navigate = useNavigate();
  const logOutFn = () => {
    setLoading(true);
    localStorage.removeItem("user");
    navigate("/signIn");
    
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-9998 bg-black/60 transition-opacity duration-300 ${
          loading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <div className="relative space-y-4">
        {loading && <BaseLoader className={"absolute left-1/2 z-9999"} />}
        <div className="space-y-4 rounded-2xl bg-gray-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaBell />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500">Receive order updates</p>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled((v) => !v)}
              className={`ml-auto flex h-9 w-16 items-center rounded-full p-1 transition-colors  cursor-pointer ${
                notificationsEnabled ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-7 w-7 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3 border-t pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaMoon />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Dark Mode</h3>
              <p className="text-sm text-gray-500">Switch theme</p>
            </div>
            <button
              type="button"
              onClick={() => setDarkModeEnabled((v) => !v)}
              className={`ml-auto flex h-9 w-16 items-center rounded-full p-1 transition-colors cursor-pointer ${
                darkModeEnabled ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-7 w-7 rounded-full bg-white transition-transform ${
                  darkModeEnabled ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={logOutFn}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-500 to-orange-500 py-3 font-bold text-white hover:opacity-95 cursor-pointer"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </>
  );
}

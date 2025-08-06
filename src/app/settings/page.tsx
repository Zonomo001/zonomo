"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Bell, Mail, MapPin, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState({
    language: "English",
    pushNotifications: true,
    emailNotifications: false,
    locationServices: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingsItems = [
    {
      icon: Globe,
      title: "Language",
      type: "select",
      value: settings.language,
      options: ["English", "Hindi", "Spanish", "French"],
    },
    {
      icon: Bell,
      title: "Push Notifications",
      type: "toggle",
      value: settings.pushNotifications,
      key: "pushNotifications",
    },
    {
      icon: Mail,
      title: "Email Notifications",
      type: "toggle",
      value: settings.emailNotifications,
      key: "emailNotifications",
    },
    {
      icon: MapPin,
      title: "Location Services",
      type: "toggle",
      value: settings.locationServices,
      key: "locationServices",
    },
    
  ];

  return (
    <div
      className={`transition-colors duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      <div className="px-4 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-4">
              <ArrowLeft
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </Link>
            <h1
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Settings
            </h1>
          </div>

          {/* Settings List */}
          <div className="space-y-4">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "#f9fafb",
                  border: `1px solid ${
                    isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb"
                  }`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-purple-400" />
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  {item.type === "toggle" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.value as boolean}
                        onChange={() =>
                          item.key === "darkMode"
                            ? toggleDarkMode()
                            : toggleSetting(item.key as keyof typeof settings)
                        }
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-300"
                        }`}
                      ></div>
                    </label>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-400 text-sm">
                        {item.value}
                      </span>
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Version 1.0.0
            </p>
            <p
              className={`text-xs mt-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © 2025 Zonomo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

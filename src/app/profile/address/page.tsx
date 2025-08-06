"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Edit, Plus, X, Save, Trash2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Address {
  id: number;
  label: string;
  address: string;
  isDefault: boolean;
}

export default function ManageAddressPage() {
  const { isDarkMode } = useTheme();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      label: "University",
      address: "",
      isDefault: false,
    },
    {
      id: 2,
      label: "Home",
      address: "TechZone 1, Greater Noida, Uttar Pradesh 201310",
      isDefault: true,
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [editAddress, setEditAddress] = useState({ label: "", address: "" });

  // Add new address
  const handleAddAddress = () => {
    if (newAddress.label.trim() && newAddress.address.trim()) {
      const newId = Math.max(...addresses.map((a) => a.id), 0) + 1;
      setAddresses([
        ...addresses,
        {
          id: newId,
          label: newAddress.label.trim(),
          address: newAddress.address.trim(),
          isDefault: addresses.length === 0, // First address becomes default
        },
      ]);
      setNewAddress({ label: "", address: "" });
      setIsAddingNew(false);
    }
  };

  // Delete address
  const handleDeleteAddress = (id: number) => {
    const addressToDelete = addresses.find((a) => a.id === id);
    const updatedAddresses = addresses.filter((a) => a.id !== id);

    // If deleted address was default and there are other addresses, make the first one default
    if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    setAddresses(updatedAddresses);
  };

  // Set as default
  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // Start editing
  const handleStartEdit = (address: Address) => {
    setEditingId(address.id);
    setEditAddress({ label: address.label, address: address.address });
  };

  // Save edit
  const handleSaveEdit = () => {
    if (editAddress.label.trim() && editAddress.address.trim()) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId
            ? {
                ...addr,
                label: editAddress.label.trim(),
                address: editAddress.address.trim(),
              }
            : addr
        )
      );
      setEditingId(null);
      setEditAddress({ label: "", address: "" });
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAddress({ label: "", address: "" });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      <div className="px-4 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/profile" className="mr-4">
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
              Manage Address
            </h1>
          </div>

          {/* Add New Address Button or Form */}
          <div className="mb-6">
            {!isAddingNew ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full rounded-2xl p-4 transition-all duration-200 hover:scale-[0.98] border-2 border-dashed"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "#f9fafb",
                  borderColor: isDarkMode
                    ? "rgba(147, 51, 234, 0.5)"
                    : "#e5e7eb",
                }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Add New Address
                  </span>
                </div>
              </button>
            ) : (
              // Add New Address Form
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "#f9fafb",
                  border: `1px solid ${
                    isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"
                  }`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Add New Address
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewAddress({ label: "", address: "" });
                    }}
                    className="p-1 hover:bg-gray-600/20 rounded-lg transition-colors"
                  >
                    <X
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Label
                    </label>
                    <input
                      type="text"
                      value={newAddress.label}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, label: e.target.value })
                      }
                      placeholder="e.g., Home, Office, University"
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-black placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Full Address
                    </label>
                    <textarea
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter complete address..."
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-black placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddAddress}
                      disabled={
                        !newAddress.label.trim() || !newAddress.address.trim()
                      }
                      className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        setNewAddress({ label: "", address: "" });
                      }}
                      className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Address Cards */}
          <div className="space-y-4">
            {addresses.map((addressItem) => (
              <div
                key={addressItem.id}
                className="rounded-2xl p-6 transition-all duration-200"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "#f9fafb",
                  border: `1px solid ${
                    isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"
                  }`,
                }}
              >
                {editingId === addressItem.id ? (
                  // Edit Form
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Edit Address
                      </h3>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-gray-600/20 rounded-lg transition-colors"
                      >
                        <X
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Label
                        </label>
                        <input
                          type="text"
                          value={editAddress.label}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              label: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-black"
                          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Full Address
                        </label>
                        <textarea
                          value={editAddress.address}
                          onChange={(e) =>
                            setEditAddress({
                              ...editAddress,
                              address: e.target.value,
                            })
                          }
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-black"
                          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveEdit}
                          disabled={
                            !editAddress.label.trim() ||
                            !editAddress.address.trim()
                          }
                          className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                            isDarkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Location Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isDarkMode ? "bg-gray-800" : "bg-gray-200"
                          }`}
                        >
                          <MapPin className="w-6 h-6 text-purple-400" />
                        </div>

                        {/* Address Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {addressItem.label}
                            </h3>
                            {addressItem.isDefault && (
                              <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          {addressItem.address ? (
                            <p
                              className={`text-sm leading-relaxed ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {addressItem.address}
                            </p>
                          ) : (
                            <p
                              className={`text-sm italic ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              No address added yet
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(addressItem)}
                        className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-purple-400" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="flex space-x-3 mt-4 pt-4 border-t"
                      style={{
                        borderColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "#e5e7eb",
                      }}
                    >
                      <button
                        onClick={() => handleStartEdit(addressItem)}
                        className="flex-1 py-2 px-4 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-600/10 transition-colors"
                      >
                        Edit Address
                      </button>
                      {!addressItem.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addressItem.id)}
                          className="flex-1 py-2 px-4 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-600/10 transition-colors"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addressItem.id)}
                        className={`py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1 ${
                          isDarkMode
                            ? "text-red-400 hover:bg-red-400/10"
                            : "text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#161616" }}>
      <div className="px-5 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/profile" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1
              className="text-white font-normal text-[25px]"
              style={{ fontFamily: "Inder, sans-serif" }}
            >
              Payment Methods
            </h1>
          </div>

          {/* Wallet Balance Section */}
          <div className="mb-8">
            <h2
              className="text-white font-normal text-[25px] mb-4"
              style={{ fontFamily: "Inder, sans-serif" }}
            >
              Wallet Balance
            </h2>

            <div className="flex gap-4">
              {/* Balance Input */}
              <div
                className="flex-1 rounded-[20px] p-4 flex items-center"
                style={{
                  border: "2px solid #F3F3F3",
                  minHeight: "53px",
                }}
              >
                <span
                  className="text-white font-normal text-[25px] mr-2"
                  style={{ fontFamily: "Inder, sans-serif" }}
                >
                  ₹
                </span>
                <input
                  type="text"
                  placeholder="1021.50"
                  className="bg-transparent text-white font-normal text-[30px] flex-1 outline-none placeholder:text-gray-500 placeholder:opacity-60"
                  style={{ fontFamily: "Inder, sans-serif" }}
                />
              </div>

              {/* Top Up Button */}
              <button
                className="rounded-[20px] px-8 py-3 flex items-center justify-center"
                style={{
                  border: "2px solid #E922DC",
                  minHeight: "48px",
                  minWidth: "210px",
                }}
              >
                <span
                  className="font-normal text-[20px]"
                  style={{
                    fontFamily: "Inder, sans-serif",
                    color: "#F617A4",
                  }}
                >
                  Top Up Wallet
                </span>
              </button>
            </div>
          </div>

          {/* Saved Cards Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-white font-normal text-[25px]"
                style={{ fontFamily: "Inder, sans-serif" }}
              >
                Saved Cards
              </h2>

              <button
                className="rounded-[20px] px-6 py-3"
                style={{
                  border: "2px solid #E922DC",
                  minHeight: "48px",
                }}
              >
                <span
                  className="font-normal text-[20px]"
                  style={{
                    fontFamily: "Inder, sans-serif",
                    color: "#F617A4",
                  }}
                >
                  Add New Cards
                </span>
              </button>
            </div>

            {/* Card Input Field */}
            <div
              className="rounded-[20px] p-4 flex items-center justify-between"
              style={{
                border: "2px solid #F3F3F3",
                minHeight: "60px",
              }}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Mastercard Icon */}
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: "39.84px",
                    height: "28.7px",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#FF5F00" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full -ml-1.5"
                      style={{ backgroundColor: "#EB001B" }}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="************2575"
                  className="bg-transparent text-white font-medium text-[15px] flex-1 outline-none placeholder:text-gray-500 placeholder:opacity-60"
                  style={{ fontFamily: "Inter, sans-serif" }}
                  maxLength={19}
                />
              </div>
            </div>
          </div>

          {/* Saved UPI Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-white font-normal text-[25px]"
                style={{ fontFamily: "Inder, sans-serif" }}
              >
                Saved UPI id
              </h2>

              <button
                className="rounded-[20px] px-6 py-3"
                style={{
                  border: "2px solid #E922DC",
                  minHeight: "48px",
                }}
              >
                <span
                  className="font-normal text-[20px]"
                  style={{
                    fontFamily: "Inder, sans-serif",
                    color: "#F617A4",
                  }}
                >
                  Add New UPI id
                </span>
              </button>
            </div>

            {/* UPI Input Field */}
            <div
              className="rounded-[20px] p-4 flex items-center"
              style={{
                border: "2px solid #F3F3F3",
                minHeight: "60px",
              }}
            >
              <input
                type="text"
                placeholder="999999999@pthdfc"
                className="bg-transparent text-white font-normal text-[15px] w-full outline-none placeholder:text-gray-500 placeholder:opacity-60"
                style={{ fontFamily: "Inder, sans-serif" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

export default function HelpSupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "Speak directly with our team",
      action: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries",
      action: "Send Email",
    },
    {
      icon: FileText,
      title: "FAQ",
      description: "Find answers to common questions",
      action: "View FAQ",
    },
  ];

  const faqItems = [
    {
      question: "How do I book a service?",
      answer:
        "Simply browse our services, select the one you need, choose your preferred time slot, and confirm your booking.",
    },
    {
      question: "How can I cancel a booking?",
      answer:
        'You can cancel your booking from the "My Bookings" section up to 2 hours before the scheduled time.',
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, and net banking.",
    },
    {
      question: "How do I reschedule a service?",
      answer:
        'Go to "My Bookings", select the booking you want to reschedule, and choose a new time slot.',
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="px-4 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/profile" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-xl font-bold text-white">Help & Support</h1>
          </div>

          {/* Need Help Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">
              Need Help?
            </h2>
            <p className="text-gray-300 text-sm">
              Contact our support team for assistance
            </p>
          </div>

          {/* Contact Support Button */}
          <button className="w-full purple-button rounded-2xl py-4 mb-8">
            <span className="text-white font-semibold">Contact Support</span>
          </button>

          {/* Support Options */}
          <div className="space-y-4 mb-8">
            <h3 className="text-white font-semibold mb-4">
              How can we help you?
            </h3>
            {supportOptions.map((option, index) => (
              <div key={index} className="review-card rounded-2xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{option.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {option.description}
                    </p>
                  </div>
                  <button className="text-purple-400 text-sm font-medium">
                    {option.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">
              Frequently Asked Questions
            </h3>
            {faqItems.map((faq, index) => (
              <div key={index} className="review-card rounded-2xl p-4">
                <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                <p className="text-gray-300 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">24/7 Support Available</p>
            <p className="text-gray-400 text-xs">Email: support@zonomo.com</p>
            <p className="text-gray-400 text-xs">Phone: +91 1800-123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';

export default function PrivacySecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 text-black dark:text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Privacy & Security</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Effective Date: 5th August 2025</p>

        <Section
          title="1. Data Collection & Purpose"
          content={[
            'We collect user data such as name, contact details, service preferences, and device identifiers to enhance user experience and ensure service fulfillment.',
            'Your personal information is used solely for booking management, customer support, and platform personalization.'
          ]}
        />

        <Section
          title="2. Data Sharing with Service Providers"
          content={[
            'User data is shared with service providers (merchants) only when a user initiates a booking or service request.',
            'Merchants are contractually obligated to use shared data exclusively for service coordination and delivery.'
          ]}
        />

        <Section
          title="3. Payment & Third-Party Services"
          content={[
            'We utilize globally recognized payment gateways for secure transactions. Payment details like card information are never stored on Zonomo servers.',
            'Analytics and third-party tools are integrated to improve performance and are chosen based on their adherence to privacy compliance.'
          ]}
        />

        <Section
          title="4. Data Security & Protection"
          content={[
            'Zonomo enforces advanced encryption protocols, secure data storage, and strict access controls to safeguard your information.',
            'Regular audits and continuous monitoring ensure proactive identification of potential threats.'
          ]}
        />

        <Section
          title="5. User Rights & Control"
          content={[
            'Users can request access, rectification, or deletion of their data anytime through the Help & Support section.',
            'Account deletion will result in the removal of all personal data, except where retention is mandated by law.'
          ]}
        />

        <Section
          title="6. Policy Updates"
          content={[
            'This policy is subject to revisions to comply with evolving regulations or to enhance clarity and transparency.',
            'Major changes will be communicated via email notifications and in-app alerts. Continued use post-update signifies acceptance.'
          ]}
        />

        <div className="mt-10 text-center">
          <Link href="/profile" className="inline-block text-purple-600 font-medium hover:underline">
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="space-y-2 text-sm leading-relaxed">
        {content.map((para, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">{para}</li>
        ))}
      </ul>
    </div>
  );
}

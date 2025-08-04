'use client';

import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 5th August 2025</p>
      <p className="mb-6">Company Name: <strong>Zonomo Technologies Private Limited</strong></p>

      <Section title="1. Platform Role & Responsibility">
        <p>Zonomo is a global service marketplace platform that connects users with merchant-owned service providers.</p>
        <p>Zonomo does not hire, employ, or directly manage service providers. All services are provided by independent merchants/business owners registered on the platform.</p>
        <p>Zonomo acts as a facilitator, offering technology solutions for service listings, user bookings, and secure payment processing.</p>
      </Section>

      <Section title="2. User Responsibilities">
        <p>Users must ensure that their use of the platform complies with the laws and regulations of their respective countries.</p>
        <p>Users are responsible for verifying the authenticity, credentials, and service quality of merchants before engaging.</p>
        <p>Any disputes or concerns regarding services must first be addressed with the merchant. Zonomo may assist in dispute resolution as a neutral mediator but holds no responsibility for the merchant’s conduct or service outcomes.</p>
      </Section>

      <Section title="3. Merchant Responsibilities">
        <p>Merchants are responsible for ensuring their services are lawful, safe, and in compliance with all applicable local regulations.</p>
        <p>Merchants must provide accurate and transparent information regarding service offerings, pricing, terms, and availability.</p>
        <p>Zonomo reserves the right to suspend or remove merchant accounts that engage in misleading practices or fail to meet quality standards.</p>
      </Section>

      <Section title="4. Payments & Transactions">
        <p>All payments are processed through globally recognized and secure payment gateways.</p>
        <p>The platform may apply a service fee or commission per transaction, which will be transparently communicated.</p>
        <p>Refunds and cancellations are governed by the merchant’s policies, subject to Zonomo’s dispute resolution support.</p>
      </Section>

      <Section title="5. Liability Disclaimer">
        <p>Zonomo Technologies Private Limited is not liable for any direct, indirect, incidental, or consequential damages arising from services availed through the platform.</p>
        <p>We do not guarantee service quality, merchant conduct, availability, or legal compliance in every country.</p>
        <p>Users and merchants engage at their own risk and discretion.</p>
      </Section>

      <Section title="6. Prohibited Use">
        <p>The platform must not be used for illegal activities, fraudulent transactions, or harmful purposes.</p>
        <p>False information, fake profiles, or attempts to manipulate platform data (including reviews and ratings) will lead to account suspension or termination.</p>
        <p>Zonomo reserves the right to block access to users or merchants violating these terms or applicable laws.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>All platform content, trademarks, logos, and software are owned by Zonomo Technologies Private Limited.</p>
        <p>Unauthorized use, reproduction, or distribution of Zonomo’s intellectual property is strictly prohibited.</p>
      </Section>

      <Section title="8. Termination & Suspension">
        <p>Zonomo reserves the right to suspend or terminate user/merchant accounts at its sole discretion if these Terms & Conditions are breached or if actions are found to harm the platform or its community.</p>
      </Section>

      <Section title="9. Policy Amendments">
        <p>We may revise these Terms & Conditions periodically to comply with legal requirements or improve user experience. Continued use of the platform after updates constitutes acceptance of the revised terms.</p>
      </Section>

      <Section title="10. Governing Law & Jurisdiction">
        <p>These Terms & Conditions are governed by the applicable laws of the country where Zonomo Technologies Private Limited is legally registered (India), but users and merchants are responsible for complying with their local laws.</p>
        <p>Any disputes arising from these terms will be subject to international arbitration, or as per applicable local regulations where services are availed.</p>
      </Section>

      <div className="mt-10 text-center">
        <Link href="/" className="text-purple-600 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

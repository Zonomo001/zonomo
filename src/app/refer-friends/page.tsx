'use client';

import { useUserProfile } from '@/hooks/use-auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ReferFriendsPage() {
  const { profile, loading, error } = useUserProfile();
  const { isDarkMode } = useTheme();

  const getReferralLink = () => {
    if (!profile) return 'https://zonomo.com/referral/your-code';
    const code = (profile as any).referralCode || profile.id || 'your-code';
    return `https://zonomo.com/referral/${code}`;
  };

  const handleCopy = () => {
    const link = getReferralLink();
    navigator.clipboard.writeText(link)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link.'));
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-white">No profile found.</div>;

  const referralLink = getReferralLink();

  return (
    <div className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="px-4 pt-6 pb-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/profile" className="mr-4">
            <ArrowLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          </Link>
          <h1 className="text-xl font-bold">Refer Friends</h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6" style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}`
        }}>
          <p className="mb-4">Invite your friends to Zonomo and earn exciting rewards!</p>
          <div className="mb-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full p-3 border rounded-lg bg-transparent"
            />
          </div>
          <button
            onClick={handleCopy}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Copy Referral Link
          </button>
        </div>
      </div>
    </div>
  );
}

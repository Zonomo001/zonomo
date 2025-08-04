'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Settings, HelpCircle, CreditCard, Bell,
  Shield, Users, FileText, LogOut, Edit, ArrowLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserProfile, useUserStore } from '@/hooks/use-auth';
import { useTheme } from '@/context/ThemeContext';

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile();
  const setProfile = useUserStore((state) => state.setProfile);
  const { isDarkMode } = useTheme();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        mobile: profile.mobile,
        address: profile.address,
        pincode: profile.pincode
      });
    }
  }, [profile]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSaving(true);
    if (!profile) {
      toast.error('User not loaded.');
      setSaving(false);
      return;
    }
    const res = await fetch(`/api/users/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    if (res.ok) {
      toast.success('Profile updated!');
      setEditMode(false);
      const updated = await res.json();
      setProfile(updated.user);
      refetch();
    } else {
      toast.error('Failed to update profile.');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    toast.success('Logged out!');
  };

  const menuItems = [
    { icon: MapPin, title: 'Manage Address', href: '/profile/address' },
    { icon: Settings, title: 'Settings', href: '/settings' },
    { icon: HelpCircle, title: 'Help & Support', href: '/help-support' },
    { icon: CreditCard, title: 'Payment Methods', href: '/profile/payment' },
  ];

  const settingsItems = [
    { icon: Bell, title: 'Notifications', hasToggle: true, enabled: true },
    { icon: Shield, title: 'Privacy & Security', hasToggle: false, href: '/privacy-security' },
    { icon: Users, title: 'Refer Friends', hasToggle: false, href: '/refer-friends' },
    { icon: FileText, title: 'Terms & Conditions', hasToggle: false, href: '/termsandconditions' },
  ];

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-white">No profile found.</div>;

  return (
    <div className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="px-4 pt-6 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ArrowLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f9fafb', border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6d28d9&color=fff&size=128&bold=true`}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <p className="text-sm text-gray-400">{profile.email}</p>
                <p className="text-sm text-gray-400">{profile.mobile}</p>
              </div>
            </div>
            <button onClick={() => setEditMode(!editMode)} className="p-2">
              <Edit className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </div>

        {editMode && (
          <form onSubmit={handleSave} className="rounded-2xl p-6 mb-6 border" style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb', border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}` }}>
            <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <InputField label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} />
            <InputField label="Address" name="address" value={form.address} onChange={handleChange} />
            <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
            <div className="flex gap-3 mt-4">
              <Button type="submit" disabled={saving} className="w-full bg-purple-500 text-white">
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditMode(false)} className="w-full">
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="rounded-2xl p-4" style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb', border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}` }}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-1 mb-6">
          {settingsItems.map((item, index) => {
            const Wrapper = item.href ? Link : 'div';
            return (
              <Wrapper key={index} href={item.href || ''} className="block rounded-2xl p-4" style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb', border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.hasToggle ? (
                    <ToggleSwitch defaultChecked={item.hasToggle && item.enabled === true} />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>

        <button onClick={handleLogout} className="w-full rounded-2xl p-4 transition-colors hover:bg-red-600/20" style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb', border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'}` }}>
          <div className="flex items-center justify-center space-x-3">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: any; }) {
  return (
    <div className="mb-3">
      <Label htmlFor={name}>{label}</Label>
      <Input name={name} value={value} onChange={onChange} className="mt-2" />
    </div>
  );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked: boolean; }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 rounded-full peer bg-gray-300 peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
    </label>
  );
}

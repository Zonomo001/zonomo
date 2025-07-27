'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserProfile, useUserStore } from '@/hooks/use-auth';

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile();
  const setProfile = useUserStore((state) => state.setProfile);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        mobile: profile.mobile,
        address: profile.address,
        pincode: profile.pincode,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
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
      body: JSON.stringify(form),
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

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-white">No profile found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] via-[#2a2a2a] to-[#1c1c1c] flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
        {!editMode ? (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-white">Your Profile</h2>
            <div className="space-y-4 mb-8 text-white/90">
              <div><span className="font-semibold">Full Name:</span> {profile.name}</div>
              <div><span className="font-semibold">Mobile Number:</span> {profile.mobile}</div>
              <div><span className="font-semibold">Address:</span> {profile.address}</div>
              <div><span className="font-semibold">Pincode:</span> {profile.pincode}</div>
              <div><span className="font-semibold">Email:</span> {profile.email}</div>
            </div>
            <Button
              onClick={() => setEditMode(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
              Edit Profile
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-white">Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:ring-pink-500"
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
                <Input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="mt-2 bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:ring-pink-500"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-2 bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:ring-pink-500"
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-white">Pincode</Label>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="mt-2 bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:ring-pink-500"
                />
              </div>
              <div>
                <Label className="text-white">Email</Label>
                <Input
                  value={profile.email}
                  disabled
                  className="mt-2 bg-white/10 text-white border-white/20"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="w-full border-white/30 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

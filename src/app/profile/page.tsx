"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUserProfile, useUserStore } from '@/hooks/use-auth'

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile()
  const setProfile = useUserStore((state) => state.setProfile)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        mobile: profile.mobile,
        address: profile.address,
        pincode: profile.pincode,
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    if (!profile) {
      toast.error('User not loaded.')
      setSaving(false)
      return
    }
    const res = await fetch(`/api/users/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success('Profile updated!')
      setEditMode(false)
      const updated = await res.json()
      setProfile(updated.user)
      refetch()
    } else {
      toast.error('Failed to update profile.')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!profile) return <div className="p-8">No profile found.</div>

  if (!editMode) {
    return (
      <div className="max-w-md mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <div className="space-y-4 mb-4">
          <div><b>Full Name:</b> {profile.name}</div>
          <div><b>Mobile Number:</b> {profile.mobile}</div>
          <div><b>Address:</b> {profile.address}</div>
          <div><b>Pincode:</b> {profile.pincode}</div>
          <div><b>Email:</b> {profile.email}</div>
        </div>
        <Button onClick={() => setEditMode(true)} className="w-full">Edit Profile</Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input name="mobile" value={form.mobile} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input name="pincode" value={form.pincode} onChange={handleChange} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={profile.email} disabled />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setEditMode(false)} className="w-full">Cancel</Button>
        </div>
      </form>
    </div>
  )
} 
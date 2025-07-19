import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/get-payload'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const payload = await getPayloadClient()
  try {
    const { docs: users } = await payload.find({
      collection: 'users',
      where: { _verified: { equals: true } },
      limit: 1,
      overrideAccess: true,
      user: { token },
    })
    const user = users[0] || null
    // Only return relevant fields for the profile
    const safeUser = user
      ? {
          id: user.id,
          email: user.email,
          name: user.name || null,
          mobile: user.mobile || null,
          address: user.address || null,
          pincode: user.pincode || null,
        }
      : null
    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
} 
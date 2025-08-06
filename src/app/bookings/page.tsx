import { cookies } from 'next/headers'
import { getServerSideUser } from '@/lib/payload-utils'
import BookingsPageComponent from '@/components/BookingsPageComponent'

const BookingsPage = async () => {
  const { user } = await getServerSideUser(cookies())

  if (!user) {
    return <div className="p-4">Please log in to access your bookings.</div>
  }

  return <BookingsPageComponent currentUser={{ ...user, name: user.name ?? '' }} />
}

export default BookingsPage

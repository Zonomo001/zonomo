
import { cookies } from 'next/headers'
import { getServerSideUser } from '@/lib/payload-utils'
import ChatUI from '@/components/ChatUI'

const ChatPage = async () => {
  const { user } = await getServerSideUser(cookies())

  if (!user) {
    return <div className="p-4">Please log in to access chat.</div>
  }

  return <ChatUI serverUser={{ ...user, name: user.name ?? '' }} />
}

export default ChatPage

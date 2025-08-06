
'use client'

import Link from 'next/link'

export default function NavPage() {
  return (
    <div className="min-h-screen bg-black text-black flex items-center justify-center p-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
        <Card title="Add Service" href="/sell" color="blue" />
        <Card title="Chat" href="/chat" color="green" />
      </div>
    </div>
  )
}

function Card({
  title,
  href,
  color,
}: {
  title: string
  href: string
  color: 'blue' | 'green'
}) {
  const baseGradient =
    color === 'blue'
      ? 'from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
      : 'from-green-500 to-green-400 hover:from-green-600 hover:to-green-500'

  return (
    <Link href={href}>
       <div
        className={`rounded-2xl shadow-lg bg-gradient-to-br text-white text-2xl md:text-3xl font-semibold 
        flex items-center justify-center h-40 md:h-60 cursor-pointer transition-all duration-300 ${baseGradient}`}
      >
        {title}
      </div>
    </Link>
  )
}

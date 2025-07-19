import Link from 'next/link';
import { Home, User, Star, Heart } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between items-center h-16 z-50 lg:hidden">
      <Link href="/" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-black">
        <Home className="h-6 w-6 mb-1" />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="#" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-black">
        <Star className="h-6 w-6 mb-1" />
        <span className="text-xs">You Decide</span>
      </Link>
      <Link href="#" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-black">
        <Heart className="h-6 w-6 mb-1" />
        <span className="text-xs">You Decide</span>
      </Link>
      <Link href="/profile" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-700 hover:text-black">
        <User className="h-6 w-6 mb-1" />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav; 
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: "Beauty At Home",
    price: "From ₹499",
    image: "/figma-images/beauty.jpg",
    href: "/products?category=beauty",
    focus: "object-[30%_50%]", // Center horizontally, shift up vertically
  },
  {
    name: "Appliance Service & Repair",
    price: "From ₹499",
    image: "/figma-images/appliance.jpg",
    href: "/products?category=appliance",
    focus: "object-[50%_25%]", // Slight upward shift
  },
  {
    name: "Home Projects & Decor",
    price: "From ₹499",
    image: "/figma-images/home_decor.jpeg",
    href: "/products?category=home-decor",
    focus: "object-[50%_10%]", // More upward shift
  },
  {
    name: "Kitchen Service",
    price: "From ₹499",
    image: "/figma-images/kitchen.jpg",
    href: "/products?category=kitchen",
    focus: "object-[50%_20%]", // Top-mid crop
  },
  // Add more categories if needed
];

const CategoriesPage = () => {
  return (
    <MaxWidthWrapper>
      <div className="py-10">
        <h1 className="text-3xl font-bold text-white mb-6">Explore Categories</h1>
        <p className="text-gray-400 mb-8">Discover a wide range of services and products tailored to your needs.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href}>
              <div className="relative rounded-2xl overflow-hidden p-3 h-48 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="relative w-full h-28 mb-2 rounded-xl overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className={`object-cover ${category.focus}`} // Focus shifted up
                  />
                </div>
                <div className="text-center px-1">
                  <h4 className="font-medium text-sm mb-1 text-white">{category.name}</h4>
                  <p className="text-xs font-bold text-blue-400">{category.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CategoriesPage;

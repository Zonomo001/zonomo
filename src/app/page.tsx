
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import ServiceCategories from "@/components/ServiceCategories";
import  Footer  from "@/components/Footer";

interface Banner {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
}

interface ZonomoHomeLayoutProps {
  heroBanners: Banner[];
}

export default function ZonomoHomeLayout({ heroBanners = [] }: ZonomoHomeLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const perks = [
    {
      name: "Quick & Easy Booking",
      Icon: ArrowDownToLine,
      description: "Find and book the perfect service provider in minutes.",
    },
    {
      name: "Guaranteed Quality",
      Icon: CheckCircle,
      description:
        "Every service provider on our platform is verified to ensure the highest quality standards. Not happy? We offer a satisfaction guarantee.",
    },
    {
      name: "For the Planet",
      Icon: Leaf,
      description:
        "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
    },
  ];

  const topPicksServices = [
    {
      title: "Deep clean with foam-jet AC service",
      subtitle: "AC service & repair",
      price: "Book now",
      bgColor: "bg-gray-900",
      textColor: "text-white",
      image: "/figma-images/deepclean.jpg",
      href: "/products?category=ac-service",
    },
    {
      title: "Kitchen cleaning starting at ₹399 only",
      subtitle: "",
      price: "Book now",
      bgColor: "bg-green-700",
      textColor: "text-white",
      image: "/figma-images/kitchen.jpg",
      href: "/products?category=kitchen-cleaning",
    },
    {
      title: "Transform your space with wall panels",
      subtitle: "Starting at ₹6,999 only",
      price: "Book now",
      bgColor: "bg-amber-900",
      textColor: "text-white",
      image: "/figma-images/home_decor.jpeg",
      href: "/products?category=wall-panels",
    },
  ];

  const serviceCategories = [
    {
      name: "Beauty At Home",
      price: "From ₹499",
      image: "/figma-images/beauty.jpg",
      href: "/products?category=beauty",
    },
    {
      name: "Appliance Service & Repair",
      price: "From ₹499",
      image: "/figma-images/appliance.jpg",
      href: "/products?category=appliance",
    },
    {
      name: "Home Projects & Decor",
      price: "From ₹499",
      image: "/figma-images/home_decor.jpeg",
      href: "/products?category=home-decor",
    },
    {
      name: "Kitchen Service",
      price: "From ₹499",
      image: "/figma-images/kitchen.jpg",
      href: "/products?category=kitchen",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* Hero Banner */}
      {heroBanners.length > 0 && (
        <div className="px-4 pt-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden p-6 mb-8 border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #222 0%, #333 100%)",
              }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {heroBanners[currentSlide].title}
                  </h2>
                  <p className="opacity-80 mb-1">{heroBanners[currentSlide].subtitle}</p>
                  <p className="opacity-70 text-sm mb-4">{heroBanners[currentSlide].description}</p>
                  <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition">
                    {heroBanners[currentSlide].buttonText}
                  </button>
                </div>
                <div className="w-24 h-24 relative">
                  <Image
                    src={heroBanners[currentSlide].image}
                    alt={heroBanners[currentSlide].title}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {heroBanners.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full cursor-pointer ${
                      index === currentSlide ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

 {/* Top Picks */}
<div className="px-4 mb-8">
  <h3 className="text-xl font-medium mb-6">Top Picks For You</h3>
  <div className="flex gap-4 overflow-x-auto pb-4">
    {topPicksServices.map((service, index) => (
      <Link key={index} href={service.href}>
        <div
          className={`relative rounded-3xl overflow-hidden p-4 md:p-6 min-w-[240px] md:min-w-[280px] h-48 md:h-40 ${service.bgColor} flex items-center justify-between border border-white/20 hover:border-white/40 transition-all duration-300`}
        >
          <div className="flex-1">
            <h4 className={`font-bold text-base md:text-lg mb-1 md:mb-2 ${service.textColor}`}>
              {service.title}
            </h4>
            {service.subtitle && (
              <p className={`text-xs md:text-sm mb-2 md:mb-3 ${service.textColor} opacity-80`}>
                {service.subtitle}
              </p>
            )}
            <button className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition">
              {service.price}
            </button>
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 relative ml-2 md:ml-4">
            <Image src={service.image} alt={service.title} fill className="object-cover rounded-2xl" />
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>


      {/* Categories */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">All Categories</h3>
          <Link href="/categories" className="text-sm font-bold text-blue-400">SEE ALL</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {serviceCategories.map((category, index) => (
            <Link key={index} href={category.href}>
              <div className="relative rounded-2xl overflow-hidden p-2 h-44 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="relative w-full h-28 mb-2 rounded-xl overflow-hidden">
                  <Image src={category.image} alt={category.name} fill className="object-cover" />
                </div>
                <div className="text-center px-1">
                  <h4 className="font-medium text-xs mb-1 leading-tight text-white">{category.name}</h4>
                  <p className="text-xs font-bold text-blue-400">{category.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Perks */}
      <div className="px-4 mb-12">
        <h3 className="text-xl font-medium mb-6">Why Zonomo?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((perk, index) => (
            <div key={index} className="rounded-2xl p-6 text-center border border-white/20 bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-600/10 rounded-full">
                <perk.Icon className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-bold mb-2 text-white">{perk.name}</h4>
              <p className="text-sm text-gray-300">{perk.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />

    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/payload-types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const productImage = typeof product.images?.[0]?.image === "string"
    ? product.images[0]?.image
    : (product.images[0]?.image as any)?.url;

  return (
    <Link href={`/product/${product.id}`} className="block bg-white/10 rounded-xl p-4 backdrop-blur border border-white/20 hover:border-white/40 transition">
      <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
        {productImage ? (
          <Image src={productImage} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="bg-gray-800 w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
        )}
      </div>
      <h3 className="text-sm font-medium text-white mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-xs text-gray-400 line-clamp-1">{product.category}</p>
      <p className="text-xs font-semibold text-white mt-1">₹{product.price}</p>
    </Link>
  );
};

export default ProductCard;

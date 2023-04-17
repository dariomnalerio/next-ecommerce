import Image from "next/image";
import formatPrice from "@/util/PriceFormat";
import { ProductType } from "@/types/ProductType";
import Link from "next/link";

// Component to display a single product
export default function Product({
  name,
  image,
  unit_amount,
  id,
  description,
  metadata,
}: ProductType) {
  const { features } = metadata;

  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: { name, image, unit_amount, id, description, features },
      }}
    >
      <div>
        <Image
          src={image}
          alt={name}
          width={600}
          height={600}
          className="w-97 h-97 object-fit rounded-lg"
          priority={true}
        />
        <div className="font-medium py-2">
          <h1 className="text-lg">{name}</h1>
          {/* If price is null, display N/A, else display price */}
          <h2 className="text-primary">
            {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
          </h2>
        </div>
      </div>
    </Link>
  );
}

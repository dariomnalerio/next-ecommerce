import Image from "next/image";
import { SearchParamTypes } from "@/types/SearchParamsTypes";
import formatPrice from "@/util/PriceFormat";
import AddCart from "./AddCart";

export default async function Product({ searchParams }: SearchParamTypes) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-16 lg:bg-base-200 lg:p-20 lg:rounded-lg">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={600}
        height={600}
        className="w-full max-w-2xl max-h-2xl rounded-lg"
        priority={true}
      />
      <div className="font-medium px-4 pb-4 lg:pt-4">
        <h1 className="text-4xl py-4">{searchParams.name}</h1>
        <p className="py-2 text-lg">{searchParams.description}</p>
        <p className="py-2 text-lg">{searchParams.features}</p>

        <div className="flex gap-2">
          <p className="font-bold text-primary pt-4 text-lg">
            {searchParams.unit_amount && formatPrice(searchParams.unit_amount)}
          </p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
}

import Image from "next/image"
import formatPrice from "@/util/PriceFormat"
import { ProductType } from "@/types/ProductType"

export default function Product({name, image, price,}: ProductType) {
    return (
        <div>
            <Image src={image} alt={name} width={400} height={400} />
            <h1>{name}</h1>
            {/* If price is null, display N/A, else display price */}
            {price !== null ? formatPrice(price) : 'N/A'}
        </div>
    )
}
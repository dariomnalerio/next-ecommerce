import { authOptions } from "@/pages/api/auth/[...nextauth]";
import formatPrice from "@/util/PriceFormat";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";

export const revalidate = 0; // Revalidate every time the page is visited

const fetchOrders = async () => {
  const prisma = new PrismaClient();
  const user = await getServerSession(authOptions);
  if (!user) {
    return null;
  }
  const orders = await prisma.order.findMany({
    where: { userId: user?.user?.id, status: "complete" },
    include: { products: true },
  });
  return orders;
};

export default async function Dashboard() {
  const orders = await fetchOrders();
  if (orders === null) {
    return <div className="text-center text-xl text-bold">You need to be logged in to view your orders</div>;
  }
  if (orders.length === 0) {
    return <div className="text-center text-xl text-bold">No orders placed</div>;
  }
  return (
    <div className="font-medium">
      <div>
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg p-8 my-12 bg-base-200">
            <div className="lg:flex items-center gap-4">
              {order.products.map((product) => (
                <div className="py-2" key={product.id}>
                  <h2 className="py-2">{product.name}</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative w-9 h-9">
                      <Image
                        src={product.image!}
                        width={36}
                        height={36}
                        alt={product.name}
                        priority={true}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p>{formatPrice(product.unit_amount)}</p>
                      <p>Quantity: {product.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="pb-5">Total: {formatPrice(order.amount)}</p>
            <h2 className="font-medium">
              Order reference: <span className="text-sm">{order.id}</span>
            </h2>
            <p className="text-sm mb-4">
              Time: {new Date(order.createdDate).toLocaleString("es-ES")}
            </p>
            <p className="py-4">
              Status:{" "}
              <span
                className={`${
                  order.status === "complete" ? "bg-green-600" : "bg-orange-500"
                } text-white py-1 rounded-md px-2 mx-2`}
              >
                {order.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

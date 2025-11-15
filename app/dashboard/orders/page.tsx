"use client"

import { useOrdersStore } from "@/store/orders"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"
import { useProductsStore } from "@/store/products"

export default function OrdersPage() {
  const { items: orders } = useOrdersStore();
  const {items:products} = useProductsStore();

  const combined = orders.map(order => ({
    ...order,
    product: products.find(p => p.id === order.product_id) || {},
  }));
  console.log(combined);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-foreground/60">View and manage all orders</p>
      </div>

      <OrdersTable orders={combined} />
    </div>
  )
}

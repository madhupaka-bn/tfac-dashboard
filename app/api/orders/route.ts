import { NextResponse } from "next/server"

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const orders = [
    {
      id: 1,
      razorpay_id: "order_1001",
      status: "Paid",
      userName: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91-9876543210",
      address: "123 Main St, Delhi",
      amount: 719,
      date: "2024-11-10",
      product_id: 1,
    },
    {
      id: 2,
      razorpay_id: "order_1002",
      status: "Pending",
      userName: "Sneha Sharma",
      email: "sneha@example.com",
      phone: "+91-9823456789",
      address: "45 MG Road, Bengaluru",
      amount: 764,
      date: "2024-11-11",
      product_id: 2,
    },
    {
      id: 3,
      razorpay_id: "order_1003",
      status: "Failed",
      userName: "Rohit Verma",
      email: "rohit@example.com",
      phone: "+91-9012345678",
      address: "221B Baker St, Mumbai",
      amount: 711,
      date: "2024-11-12",
      product_id: 3,
    },
    {
      id: 4,
      razorpay_id: "order_1004",
      status: "Paid",
      userName: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91-9098765432",
      address: "56 Park Avenue, Pune",
      amount: 764,
      date: "2024-11-13",
      product_id: 2,
    },
    {
      id: 5,
      razorpay_id: "order_1005",
      status: "Paid",
      userName: "Karan Mehta",
      email: "karan@example.com",
      phone: "+91-9123456780",
      address: "8 Connaught Place, New Delhi",
      amount: 719,
      date: "2024-11-14",
      product_id: 1,
    },
  ]

  return NextResponse.json({ data: orders })
}

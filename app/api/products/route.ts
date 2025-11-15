export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const products = [
    {
      id: 1,
      name: "Youth Empowerment Tee",
      designer: "Ananya",
      price: 799,
      discount: 10,
      final_price: 719,
      sizes: ["S", "M", "L"],
      image: "/youth-empowerment-tee.jpg",
      description: "Support youth empowerment with this premium cotton tee.",
    },
    {
      id: 2,
      name: "Climate Action Tee",
      designer: "Rohan",
      price: 899,
      discount: 15,
      final_price: 764,
      sizes: ["M", "L", "XL"],
      image: "/climate-action-tee.jpg",
      description: "Join the climate movement in style.",
    },
    {
      id: 3,
      name: "Education for All",
      designer: "Priya",
      price: 749,
      discount: 5,
      final_price: 711,
      sizes: ["XS", "S", "M", "L"],
      image: "/education-tee.jpg",
      description: "Support education initiatives with every purchase.",
    },
  ]

  return Response.json({ data: products })
}

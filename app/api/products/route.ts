export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const products = [
    {
      id: 1,
      slug: "stay-in-the-musical-trance",
      name: "Stay in the Musical Trance",
      designer: "Deeksha Deulkar",
      price: 799,
      discount: 0,
      final_price: 799,
      sizes: ["S", "M", "L", "XL"],
      image: "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
      productUrl: "https://teesforacause.co/product/stay-in-the-musical-trance",
      description: "Designed by student artist Deeksha Deulkar, capturing raw emotion and power of music. Supporting youth music programs.",
    },
    {
      id: 2,
      slug: "cn-tower",
      name: "CN Tower",
      designer: "Aarav Malkani",
      price: 799,
      discount: 0,
      final_price: 799,
      sizes: ["S", "M", "L", "XL"],
      image: "https://teesforacause.co/assets/shop-cn-tower-front.jpg",
      productUrl: "https://teesforacause.co/product/cn-tower",
      description: "Designed by student artist Aarav Malkani, a tribute to urban nightscapes. Supporting urban youth development.",
    },
    {
      id: 3,
      slug: "red-bean",
      name: "Red Bean",
      designer: "Maahi",
      price: 799,
      discount: 0,
      final_price: 799,
      sizes: ["S", "M", "L", "XL"],
      image: "https://teesforacause.co/assets/shop-coffee-pocket-light.jpg",
      productUrl: "https://teesforacause.co/product/red-bean",
      description: "Designed by 15-year-old Maahi in collaboration with Geet Foundation. Supporting women and youth empowerment.",
    },
    {
      id: 4,
      slug: "matcha",
      name: "Matcha",
      designer: "Maahi",
      price: 799,
      discount: 0,
      final_price: 799,
      sizes: ["S", "M", "L", "XL"],
      image: "https://teesforacause.co/assets/shop-coffee-pocket-teal.jpg",
      productUrl: "https://teesforacause.co/product/matcha",
      description: "Teal pocket-style coffee brewer art. Supporting environmental causes and sustainable youth development.",
    },
  ]

  return Response.json({ data: products })
}

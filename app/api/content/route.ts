export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const contents = [
    {
      id: 1,
      key: "homepage_hero_title",
      value: "<h1>Wear Change. Be the Change.</h1>",
      updatedAt: "2024-11-10",
    },
    {
      id: 2,
      key: "homepage_hero_subtitle",
      value: "<p>Every tee supports youth causes through various NGOs.</p>",
      updatedAt: "2024-11-10",
    },
    {
      id: 3,
      key: "about_mission",
      value: "<p>Fashion with purpose — not just good looks</p>",
      updatedAt: "2024-11-09",
    },
    {
      id: 4,
      key: "faq_item_1",
      value: "<p>How are the tees made?</p>",
      updatedAt: "2024-11-08",
    },
  ]

  return Response.json({ data: contents })
}

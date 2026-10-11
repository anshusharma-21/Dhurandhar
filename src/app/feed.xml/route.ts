import { NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://projectdhurandhar.automationlabs.online";
  const { episodes } = await dbRepository.getPublishedEpisodes({ limit: 50 });

  const itemsXml = episodes
    .map(
      (ep) => `
    <item>
      <title><![CDATA[Day ${ep.day_number}: ${ep.title}]]></title>
      <link>${baseUrl}/episodes/${ep.slug}</link>
      <guid>${baseUrl}/episodes/${ep.slug}</guid>
      <pubDate>${new Date(ep.published_at || ep.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${ep.summary}]]></description>
    </item>`
    )
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Project Dhurandhar: Road to ₹30CR Revenue</title>
    <link>${baseUrl}</link>
    <description>Daily journal documenting the journey of Dr. Ajay Kumar and AI Automation Labs LLP.</description>
    <language>en-IN</language>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

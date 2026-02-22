import { prisma } from "@/lib/db";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        updatedAt: true,
        author: {
          select: { name: true },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 50,
    });

    const lastBuildDate = posts.length > 0 && posts[0].publishedAt
      ? posts[0].publishedAt.toUTCString()
      : new Date().toUTCString();

    const items = posts
      .map((post) => {
        const pubDate = post.publishedAt
          ? post.publishedAt.toUTCString()
          : post.updatedAt.toUTCString();

        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/resources/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/resources/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>${
          post.excerpt
            ? `\n      <description>${escapeXml(post.excerpt)}</description>`
            : ""
        }${
          post.author?.name
            ? `\n      <dc:creator>${escapeXml(post.author.name)}</dc:creator>`
            : ""
        }${
          post.category?.name
            ? `\n      <category>${escapeXml(post.category.name)}</category>`
            : ""
        }
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>SIDEC Consulting Blog</title>
    <link>${baseUrl}/resources</link>
    <description>Expert insights on medical device manufacturing, ISO 13485 quality systems, injection molding process development, and facility design.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}

import { fetchText, parseRssItems } from "../lib/data-helpers.js";

interface SubstackPost {
  title: string;
  link: string;
  date: Date;
  excerpt: string;
}

export default async function(): Promise<SubstackPost[]> {
  try {
    const xml = await fetchText("https://abbykrishnan.substack.com/feed");
    const items = parseRssItems(xml, ["title", "link", "pubDate", "description"]);

    return items
      .filter(item => item.title)
      .map(item => ({
        title: item.title,
        link: item.link,
        date: new Date(item.pubDate),
        excerpt: item.description
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .substring(0, 200) + '...',
      }));
  } catch (error) {
    console.error("Error fetching Substack:", error);
    return [];
  }
}

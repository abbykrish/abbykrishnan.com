import EleventyFetch from "@11ty/eleventy-fetch";

interface SubstackPost {
  title: string;
  link: string;
  date: Date;
  excerpt: string;
}

export default async function(): Promise<SubstackPost[]> {
  const feedUrl = "https://abbykrishnan.substack.com/feed";

  try {
    const xml = await EleventyFetch(feedUrl, {
      duration: "1d",
      type: "text"
    });

    const posts: SubstackPost[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml as string)) !== null) {
      const item = match[1];

      const getTag = (tag: string): string => {
        const regex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`);
        const m = item.match(regex);
        return m ? (m[1] || m[2] || '').trim() : '';
      };

      const title = getTag('title');
      const link = getTag('link');
      const pubDate = getTag('pubDate');
      const description = getTag('description');

      const excerpt = description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .substring(0, 200) + '...';

      if (title) {
        posts.push({
          title,
          link,
          date: new Date(pubDate),
          excerpt
        });
      }
    }

    return posts;
  } catch (error) {
    console.error("Error fetching Substack:", error);
    return [];
  }
}

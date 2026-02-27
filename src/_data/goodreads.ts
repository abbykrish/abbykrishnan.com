import { fetchText, parseRssItems } from "../lib/data-helpers.js";

interface Book {
  title: string;
  author: string;
  rating: number;
  dateRead: string;
  imageUrl: string;
  link: string;
}

interface GoodreadsData {
  read: Book[];
  currentlyReading: Book[];
  totalRead: number;
}

const TAGS = ["title", "author_name", "user_rating", "user_read_at", "book_image_url", "link"];

function toBook(item: Record<string, string>): Book {
  return {
    title: item.title,
    author: item.author_name,
    rating: parseInt(item.user_rating) || 0,
    dateRead: item.user_read_at,
    imageUrl: item.book_image_url,
    link: item.link,
  };
}

export default async function(): Promise<GoodreadsData> {
  const userId = "68621097";

  try {
    const [readXml, currentXml] = await Promise.all([
      fetchText(`https://www.goodreads.com/review/list_rss/${userId}?shelf=read`),
      fetchText(`https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`),
    ]);

    const readBooks = parseRssItems(readXml, TAGS)
      .filter(i => i.title && i.author_name)
      .map(toBook);

    const currentlyReading = parseRssItems(currentXml, TAGS)
      .filter(i => i.title && i.author_name)
      .map(toBook);

    return {
      read: readBooks.slice(0, 10),
      currentlyReading,
      totalRead: readBooks.length,
    };
  } catch (error) {
    console.error("Error fetching Goodreads data:", error);
    return { read: [], currentlyReading: [], totalRead: 0 };
  }
}

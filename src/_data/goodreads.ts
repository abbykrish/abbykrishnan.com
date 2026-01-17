import EleventyFetch from "@11ty/eleventy-fetch";

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

export default async function(): Promise<GoodreadsData> {
  const userId = "68621097";

  const readUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=read`;
  const currentlyReadingUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`;

  try {
    const [readXml, currentXml] = await Promise.all([
      EleventyFetch(readUrl, {
        duration: "1d",
        type: "text"
      }),
      EleventyFetch(currentlyReadingUrl, {
        duration: "1d",
        type: "text"
      })
    ]);

    const parseBooks = (xml: string): Book[] => {
      const books: Book[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml)) !== null) {
        const item = match[1];

        const getTag = (tag: string): string => {
          const regex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`);
          const m = item.match(regex);
          return m ? (m[1] || m[2] || '').trim() : '';
        };

        const title = getTag('title');
        const author = getTag('author_name');
        const rating = getTag('user_rating');
        const dateRead = getTag('user_read_at');
        const imageUrl = getTag('book_image_url');
        const link = getTag('link');

        if (title && author) {
          books.push({
            title,
            author,
            rating: parseInt(rating) || 0,
            dateRead,
            imageUrl,
            link
          });
        }
      }

      return books;
    };

    const readBooks = parseBooks(readXml as string);
    const currentlyReading = parseBooks(currentXml as string);

    return {
      read: readBooks.slice(0, 10),
      currentlyReading,
      totalRead: readBooks.length
    };
  } catch (error) {
    console.error("Error fetching Goodreads data:", error);
    return {
      read: [],
      currentlyReading: [],
      totalRead: 0
    };
  }
}

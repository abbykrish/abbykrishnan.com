import EleventyFetch from "@11ty/eleventy-fetch";

export default async function() {
  const userId = "68621097";

  // Fetch read books
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

    // Parse RSS XML
    const parseBooks = (xml) => {
      const books = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml)) !== null) {
        const item = match[1];

        const getTag = (tag) => {
          const regex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}>([\\s\\S]*?)<\\/${tag}>`);
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

    const readBooks = parseBooks(readXml);
    const currentlyReading = parseBooks(currentXml);

    return {
      read: readBooks.slice(0, 10), // Last 10 read
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

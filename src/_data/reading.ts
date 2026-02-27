import { fetchGoogleSheet } from "../lib/data-helpers.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

interface ReadingItem {
  name: string;
  link: string;
  type: string;
  date: string;
}

interface ReadingData {
  items: ReadingItem[];
  latestMonth: string;
}

export default async function(): Promise<ReadingData> {
  try {
    const data = await fetchGoogleSheet("1433215246");

    const items: ReadingItem[] = data
      .filter(row => row.name)
      .map(row => ({
        name: row.name,
        link: row.link || '',
        type: row.type || '',
        date: row.date || '',
      }));

    let latestMonth = '';
    let latest = dayjs('1970-01-01');
    for (const item of items) {
      if (!item.date) continue;
      const parsed = dayjs(item.date, 'M/YYYY');
      if (parsed.isValid() && parsed.isAfter(latest)) {
        latest = parsed;
        latestMonth = parsed.format('MMMM YYYY');
      }
    }

    return { items, latestMonth };
  } catch (error) {
    console.error("Error fetching reading data:", error);
    return { items: [], latestMonth: '' };
  }
}

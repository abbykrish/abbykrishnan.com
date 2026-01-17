import EleventyFetch from "@11ty/eleventy-fetch";

interface Spot {
  [key: string]: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export default async function(): Promise<Spot[]> {
  const sheetId = "1MuXPzd0MbSxNdsU-HWH5xXhMKFrfR2je4WIgs1pKZNI";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  try {
    const response = await EleventyFetch(url, {
      duration: "1d",
      type: "text"
    });

    const csv = typeof response === 'string' ? response : response.toString();

    const lines = csv.split('\n').filter((line: string) => line.trim());
    if (lines.length < 2) return [];

    const rawHeaders = parseCSVLine(lines[0]);
    const headers = rawHeaders.map((h: string) => h.toLowerCase().trim().replace(/\s+/g, ''));

    const spots: Spot[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const spot: Spot = {};

      headers.forEach((header: string, index: number) => {
        spot[header] = values[index] || '';
      });

      if (spot.name) {
        spots.push(spot);
      }
    }

    return spots;
  } catch (error) {
    console.error("Error fetching SF spots:", error);
    return [];
  }
}

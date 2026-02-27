import EleventyFetch from "@11ty/eleventy-fetch";
import Papa from "papaparse";

const SHEET_ID = "1MuXPzd0MbSxNdsU-HWH5xXhMKFrfR2je4WIgs1pKZNI";

export async function fetchText(url: string): Promise<string> {
  const response = await EleventyFetch(url, {
    duration: "1d",
    type: "text",
  });
  return typeof response === "string" ? response : response.toString();
}

export function parseRssItems(
  xml: string,
  tags: string[]
): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const parsed: Record<string, string> = {};
    for (const tag of tags) {
      const regex = new RegExp(
        `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`
      );
      const m = block.match(regex);
      parsed[tag] = m ? (m[1] || m[2] || "").trim() : "";
    }
    items.push(parsed);
  }

  return items;
}

export async function fetchGoogleSheet(
  gid: string = "0"
): Promise<Record<string, string>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

  const csv = await fetchText(url);
  const { data } = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.toLowerCase().trim().replace(/\s+/g, ""),
  });

  return data;
}

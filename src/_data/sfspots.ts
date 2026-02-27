import { fetchGoogleSheet } from "../lib/data-helpers.js";

interface Spot {
  [key: string]: string;
}

const typeLabels: Record<string, string> = {
  "Restaurant": "Restaurants",
  "Bar": "Bars",
  "Coffee": "Coffee Shops",
  "Gym": "Gyms",
  "Grocery": "Grocery Stores",
  "Bakery": "Bakeries",
  "Cafe": "Cafes",
  "Park": "Parks",
  "Museum": "Museums",
  "Shop": "Shops"
};

export default async function(): Promise<Spot[]> {
  try {
    const data = await fetchGoogleSheet();
    return data
      .filter(row => row.name)
      .map(spot => ({
        ...spot,
        type: (spot.type && typeLabels[spot.type]) ? typeLabels[spot.type] : spot.type,
      }));
  } catch (error) {
    console.error("Error fetching SF spots:", error);
    return [];
  }
}

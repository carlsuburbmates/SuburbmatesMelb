import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { logger } from "./logger";

type SuburbCouncilMapping = {
  suburb: string;
  council: string;
};

const SUBURB_COUNCIL_MAP: SuburbCouncilMapping[] = [
  // City of Melbourne
  { suburb: "Carlton", council: "City of Melbourne" },
  { suburb: "Docklands", council: "City of Melbourne" },
  { suburb: "Flemington", council: "City of Melbourne" },
  { suburb: "Kensington", council: "City of Melbourne" },
  { suburb: "North Melbourne", council: "City of Melbourne" },
  { suburb: "Parkville", council: "City of Melbourne" },
  { suburb: "Richmond", council: "City of Melbourne" },
  // City of Port Phillip
  { suburb: "Albert Park", council: "City of Port Phillip" },
  { suburb: "Balaclava", council: "City of Port Phillip" },
  { suburb: "Elwood", council: "City of Port Phillip" },
  { suburb: "St Kilda", council: "City of Port Phillip" },
  { suburb: "South Melbourne", council: "City of Port Phillip" },
  // City of Yarra
  { suburb: "Abbotsford", council: "City of Yarra" },
  { suburb: "Collingwood", council: "City of Yarra" },
  { suburb: "Fitzroy", council: "City of Yarra" },
  { suburb: "Richmond", council: "City of Yarra" },
  // City of Banyule
  { suburb: "Heidelberg", council: "City of Banyule" },
  { suburb: "Ivanhoe", council: "City of Banyule" },
  { suburb: "Watsonia", council: "City of Banyule" },
  { suburb: "Greensborough", council: "City of Banyule" },
  { suburb: "Eltham", council: "City of Banyule" },
  // City of Darebin
  { suburb: "Preston", council: "City of Darebin" },
  { suburb: "Reservoir", council: "City of Darebin" },
  { suburb: "Thornbury", council: "City of Darebin" },
  { suburb: "West Preston", council: "City of Darebin" },
  { suburb: "Fairfield", council: "City of Darebin" },
  // City of Hume
  { suburb: "Broadmeadows", council: "City of Hume" },
  { suburb: "Sunbury", council: "City of Hume" },
  { suburb: "Craigieburn", council: "City of Hume" },
  { suburb: "Roxburgh Park", council: "City of Hume" },
  { suburb: "Tullamarine", council: "City of Hume" },
  // City of Merri-bek
  { suburb: "Brunswick", council: "City of Merri-bek" },
  { suburb: "Coburg", council: "City of Merri-bek" },
  { suburb: "Fawkner", council: "City of Merri-bek" },
  { suburb: "Glenroy", council: "City of Merri-bek" },
  { suburb: "Pascoe Vale", council: "City of Merri-bek" },
  // City of Whittlesea
  { suburb: "South Morang", council: "City of Whittlesea" },
  { suburb: "Epping", council: "City of Whittlesea" },
  { suburb: "Doreen", council: "City of Whittlesea" },
  { suburb: "Mernda", council: "City of Whittlesea" },
  { suburb: "Kinglake", council: "City of Whittlesea" },
  // Shire of Nillumbik
  { suburb: "Diamond Creek", council: "Shire of Nillumbik" },
  { suburb: "Eltham North", council: "Shire of Nillumbik" },
  { suburb: "Kallista", council: "Shire of Nillumbik" },
  { suburb: "Monbulk", council: "Shire of Nillumbik" },
  { suburb: "Lilydale East", council: "Shire of Nillumbik" },
  // City of Boroondara
  { suburb: "Camberwell", council: "City of Boroondara" },
  { suburb: "Hawthorn", council: "City of Boroondara" },
  { suburb: "Kew", council: "City of Boroondara" },
  { suburb: "Balwyn", council: "City of Boroondara" },
  { suburb: "Glen Iris", council: "City of Boroondara" },
  // City of Knox
  { suburb: "Bayswater", council: "City of Knox" },
  { suburb: "Boronia", council: "City of Knox" },
  { suburb: "Mountain Gate", council: "City of Knox" },
  { suburb: "Knoxfield", council: "City of Knox" },
  { suburb: "Ferntree Gully", council: "City of Knox" },
  // City of Manningham
  { suburb: "Doncaster", council: "City of Manningham" },
  { suburb: "Templestowe", council: "City of Manningham" },
  { suburb: "Bulleen", council: "City of Manningham" },
  { suburb: "Park Orchards", council: "City of Manningham" },
  // City of Maroondah
  { suburb: "Croydon", council: "City of Maroondah" },
  { suburb: "Ringwood", council: "City of Maroondah" },
  { suburb: "Heathmont", council: "City of Maroondah" },
  { suburb: "Donvale", council: "City of Maroondah" },
  { suburb: "Warranwood", council: "City of Maroondah" },
  // City of Whitehorse
  { suburb: "Box Hill", council: "City of Whitehorse" },
  { suburb: "Nunawading", council: "City of Whitehorse" },
  { suburb: "Vermont", council: "City of Whitehorse" },
  { suburb: "Mitcham", council: "City of Whitehorse" },
  { suburb: "Blackburn", council: "City of Whitehorse" },
  // Shire of Yarra Ranges
  { suburb: "Lilydale", council: "Shire of Yarra Ranges" },
  { suburb: "Belgrave", council: "Shire of Yarra Ranges" },
  { suburb: "Emerald", council: "Shire of Yarra Ranges" },
  { suburb: "Coldstream", council: "Shire of Yarra Ranges" },
  { suburb: "Yarra Glen", council: "Shire of Yarra Ranges" },
  // City of Bayside
  { suburb: "Beaumaris", council: "City of Bayside" },
  { suburb: "Brighton", council: "City of Bayside" },
  { suburb: "Hampton", council: "City of Bayside" },
  { suburb: "Black Rock", council: "City of Bayside" },
  { suburb: "Sandringham", council: "City of Bayside" },
  // City of Glen Eira
  { suburb: "Caulfield", council: "City of Glen Eira" },
  { suburb: "Carnegie", council: "City of Glen Eira" },
  { suburb: "Bentleigh", council: "City of Glen Eira" },
  { suburb: "Elsternwick", council: "City of Glen Eira" },
  { suburb: "Murrumbeena", council: "City of Glen Eira" },
  // City of Kingston
  { suburb: "Mentone", council: "City of Kingston" },
  { suburb: "Moorabbin", council: "City of Kingston" },
  { suburb: "Aspendale", council: "City of Kingston" },
  { suburb: "Highett", council: "City of Kingston" },
  { suburb: "Sandown", council: "City of Kingston" },
  // City of Casey
  { suburb: "Narre Warren", council: "City of Casey" },
  { suburb: "Cranbourne", council: "City of Casey" },
  { suburb: "Fountain Gate", council: "City of Casey" },
  { suburb: "Officer", council: "City of Casey" },
  { suburb: "Clyde", council: "City of Casey" },
  // City of Frankston
  { suburb: "Frankston", council: "City of Frankston" },
  { suburb: "Seaford", council: "City of Frankston" },
  { suburb: "Karingal", council: "City of Frankston" },
  { suburb: "Skye", council: "City of Frankston" },
  { suburb: "Langwarrin", council: "City of Frankston" },
  // Shire of Cardinia
  { suburb: "Pakenham", council: "Shire of Cardinia" },
  { suburb: "Officer", council: "Shire of Cardinia" },
  { suburb: "Beaconsfield", council: "Shire of Cardinia" },
  { suburb: "Emerald", council: "Shire of Cardinia" },
  { suburb: "Bunyip", council: "Shire of Cardinia" },
  // Mornington Peninsula Shire
  { suburb: "Mornington", council: "Mornington Peninsula Shire" },
  { suburb: "Mount Martha", council: "Mornington Peninsula Shire" },
  { suburb: "Red Hill", council: "Mornington Peninsula Shire" },
  { suburb: "Sorrento", council: "Mornington Peninsula Shire" },
  { suburb: "Portsea", council: "Mornington Peninsula Shire" },
  // City of Brimbank
  { suburb: "Sunshine", council: "City of Brimbank" },
  { suburb: "St Albans", council: "City of Brimbank" },
  { suburb: "Keilor", council: "City of Brimbank" },
  { suburb: "Albanvale", council: "City of Brimbank" },
  { suburb: "Deer Park", council: "City of Brimbank" },
  // City of Hobsons Bay
  { suburb: "Williamstown", council: "City of Hobsons Bay" },
  { suburb: "Altona", council: "City of Hobsons Bay" },
  { suburb: "Newport", council: "City of Hobsons Bay" },
  { suburb: "Hobsons Bay", council: "City of Hobsons Bay" },
  { suburb: "Werribee South", council: "City of Hobsons Bay" },
  // City of Maribyrnong
  { suburb: "Footscray", council: "City of Maribyrnong" },
  { suburb: "Yarraville", council: "City of Maribyrnong" },
  { suburb: "Seddon", council: "City of Maribyrnong" },
  { suburb: "Kingsville", council: "City of Maribyrnong" },
  { suburb: "West Footscray", council: "City of Maribyrnong" },
  // City of Melton
  { suburb: "Caroline Springs", council: "City of Melton" },
  { suburb: "Melton", council: "City of Melton" },
  { suburb: "Hillside", council: "City of Melton" },
  { suburb: "Toolern", council: "City of Melton" },
  { suburb: "Brookfield", council: "City of Melton" },
  // City of Moonee Valley
  { suburb: "Essendon", council: "City of Moonee Valley" },
  { suburb: "Moonee Ponds", council: "City of Moonee Valley" },
  { suburb: "Ascot Vale", council: "City of Moonee Valley" },
  { suburb: "Strathmore", council: "City of Moonee Valley" },
  { suburb: "Avondale Heights", council: "City of Moonee Valley" },
  // City of Wyndham
  { suburb: "Werribee", council: "City of Wyndham" },
  { suburb: "Point Cook", council: "City of Wyndham" },
  { suburb: "Williams Landing", council: "City of Wyndham" },
  { suburb: "Tarneit", council: "City of Wyndham" },
  { suburb: "Manor Lakes", council: "City of Wyndham" },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function findCouncilsForSuburb(term: string) {
  const normalizedTerm = normalize(term);
  if (!normalizedTerm) return [];
  return SUBURB_COUNCIL_MAP.filter((entry) =>
    entry.suburb.toLowerCase().includes(normalizedTerm)
  );
}

export async function resolveLgaMatch(
  client: SupabaseClient<Database>,
  suburbTerm: string
) {
  const normalizedInput = suburbTerm.trim();
  if (!normalizedInput) {
    return null;
  }

  const suburbMatches = findCouncilsForSuburb(normalizedInput);

  const lgaNames = suburbMatches.map((match) => match.council);

  if (lgaNames.length === 0) {
    const { data: lgaRows, error } = await client
      .from("lgas")
      .select("id, name")
      .ilike("name", `%${normalizedInput}%`);

    if (error) {
      logger.error("lga_lookup_failed", error);
      return null;
    }

    if (!lgaRows || lgaRows.length === 0) {
      return null;
    }

    return {
      lgaIds: lgaRows.map((row) => row.id),
      matchedLabel: normalizedInput,
      matchedLgaNames: lgaRows.map((row) => row.name),
    };
  }

  const uniqueNames = Array.from(new Set(lgaNames));
  const { data: resolved, error: resolveError } = await client
    .from("lgas")
    .select("id, name")
    .in("name", uniqueNames);

  if (resolveError) {
    logger.error("lga_resolver_failed", resolveError);
    return null;
  }

  if (!resolved || resolved.length === 0) {
    return null;
  }

  const label = suburbMatches[0]?.suburb ?? normalizedInput;

  return {
    lgaIds: resolved.map((row) => row.id),
    matchedLabel: label,
    matchedLgaNames: resolved.map((row) => row.name),
  };
}

export async function resolveSingleLga(
  client: SupabaseClient<Database>,
  suburbTerm: string
) {
  const matches = await resolveLgaMatch(client, suburbTerm);
  if (!matches || matches.lgaIds.length === 0) {
    return null;
  }
  return {
    lgaId: matches.lgaIds[0],
    suburbLabel: matches.matchedLabel ?? suburbTerm,
    lgaName: matches.matchedLgaNames[0],
  };
}

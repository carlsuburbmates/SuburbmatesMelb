import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { logger } from "./logger";

type SuburbCouncilMapping = {
  suburb: string;
  council: string;
};

const SUBURB_COUNCIL_MAP: SuburbCouncilMapping[] = [
  // Inner Metro
  { suburb: "Carlton", council: "Inner Metro" },
  { suburb: "Docklands", council: "Inner Metro" },
  { suburb: "Flemington", council: "Inner Metro" },
  { suburb: "Kensington", council: "Inner Metro" },
  { suburb: "North Melbourne", council: "Inner Metro" },
  { suburb: "Parkville", council: "Inner Metro" },
  { suburb: "Richmond", council: "Inner Metro" },
  { suburb: "South Melbourne", council: "Inner Metro" },
  { suburb: "Albert Park", council: "Inner Metro" },
  { suburb: "Fitzroy", council: "Inner Metro" },
  { suburb: "Collingwood", council: "Inner Metro" },
  { suburb: "Abbotsford", council: "Inner Metro" },
  { suburb: "Brunswick", council: "Inner Metro" },
  // Western
  { suburb: "Footscray", council: "Western" },
  { suburb: "Yarraville", council: "Western" },
  { suburb: "Sunshine", council: "Western" },
  { suburb: "St Albans", council: "Western" },
  { suburb: "Werribee", council: "Western" },
  { suburb: "Altona", council: "Western" },
  { suburb: "Williamstown", council: "Western" },
  // Northern
  { suburb: "Preston", council: "Northern" },
  { suburb: "Reservoir", council: "Northern" },
  { suburb: "Coburg", council: "Northern" },
  { suburb: "Broadmeadows", council: "Northern" },
  { suburb: "Craigieburn", council: "Northern" },
  { suburb: "Epping", council: "Northern" },
  { suburb: "South Morang", council: "Northern" },
  // Eastern
  { suburb: "Hawthorn", council: "Eastern" },
  { suburb: "Camberwell", council: "Eastern" },
  { suburb: "Box Hill", council: "Eastern" },
  { suburb: "Doncaster", council: "Eastern" },
  { suburb: "Ringwood", council: "Eastern" },
  { suburb: "Croydon", council: "Eastern" },
  // Southern
  { suburb: "Brighton", council: "Southern" },
  { suburb: "Caulfield", council: "Southern" },
  { suburb: "Bentleigh", council: "Southern" },
  { suburb: "Mentone", council: "Southern" },
  { suburb: "Moorabbin", council: "Southern" },
  // Inner South-east 
  { suburb: "Narre Warren", council: "Inner South-east" },
  { suburb: "Cranbourne", council: "Inner South-east" },
  { suburb: "Frankston", council: "Inner South-east" },
  { suburb: "Dandenong", council: "Inner South-east" },
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

export async function resolveRegionMatch(
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
    const { data: regionRows, error } = await client
      .from("regions")
      .select("id, name")
      .ilike("name", `%${normalizedInput}%`);

    if (error) {
      logger.error("lga_lookup_failed", error);
      return null;
    }

    if (!regionRows || regionRows.length === 0) {
      // Fallback to first available region instead of hardcoded 1
      const { data: defaultRegion } = await client.from("regions").select("id, name").order("id").limit(1).single();
      if (!defaultRegion) return null;
      return {
        regionIds: [defaultRegion.id],
        matchedLabel: normalizedInput,
        matchedRegionNames: [defaultRegion.name],
      };
    }

    return {
      regionIds: regionRows.map((row) => row.id),
      matchedLabel: normalizedInput,
      matchedRegionNames: regionRows.map((row) => row.name),
    };
  }

  const uniqueNames = Array.from(new Set(lgaNames));
  const { data: resolved, error: resolveError } = await client
    .from("regions")
    .select("id, name")
    .in("name", uniqueNames);

  if (resolveError) {
    logger.error("region_resolver_failed", resolveError);
    return null;
  }

  if (!resolved || resolved.length === 0) {
    // Fallback to first available region
    const { data: defaultRegion } = await client.from("regions").select("id, name").order("id").limit(1).single();
    if (!defaultRegion) return null;
    return {
      regionIds: [defaultRegion.id],
      matchedLabel: normalizedInput,
      matchedRegionNames: [defaultRegion.name],
    };
  }

  const label = suburbMatches[0]?.suburb ?? normalizedInput;

  return {
    regionIds: resolved.map((row) => row.id),
    matchedLabel: label,
    matchedRegionNames: resolved.map((row) => row.name),
  };
}

export async function resolveSingleRegion(
  client: SupabaseClient<Database>,
  suburbTerm: string
) {
  const matches = await resolveRegionMatch(client, suburbTerm);
  if (!matches || matches.regionIds.length === 0) {
    return null;
  }
  return {
    regionId: matches.regionIds[0],
    suburbLabel: matches.matchedLabel ?? suburbTerm,
    regionName: matches.matchedRegionNames[0],
  };
}

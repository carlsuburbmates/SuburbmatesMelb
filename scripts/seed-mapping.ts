export const REGION_MAP: Record<string, number> = {
  "Inner Metro": 13,
  "Inner South-east": 14,
  "Northern": 15,
  "Western": 16,
  "Eastern": 17,
  "Southern": 18,
};

export const CATEGORY_MAP: Record<string, number> = {
  "Design & Art": 11,
  "Courses & Training": 11,
  "Graphics & Design": 12,
  "Software & Apps": 13,
  "Music & Audio": 14,
  "Photography": 15,
  "Business Services": 16,
  "Marketing Materials": 17,
  "Legal Documents": 18,
};

export function resolveRegionId(regionStr: string): number {
  const id = REGION_MAP[regionStr];
  if (!id) {
    throw new Error(`Mapping missing for Region: "${regionStr}"`);
  }
  return id;
}

export function resolveCategoryId(categoryStr: string): number {
  const id = CATEGORY_MAP[categoryStr];
  if (!id) {
    throw new Error(`Mapping missing for Category: "${categoryStr}"`);
  }
  return id;
}

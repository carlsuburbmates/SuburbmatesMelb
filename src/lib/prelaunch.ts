const HIDDEN_ENTITY_TERMS = [
  "demo",
  "sample",
  "placeholder",
  "launch partner",
  "test business",
];
// Matching is case-insensitive; terms are intentionally normalized to lowercase.

export function isPrelaunchSafetyMode(): boolean {
  return process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE !== "false";
}

export function shouldHidePublicEntity(...fields: Array<string | null | undefined>): boolean {
  const combined = fields
    .filter((field): field is string => typeof field === "string" && field.trim().length > 0)
    .join(" ")
    .toLowerCase();

  if (!combined) return false;

  return HIDDEN_ENTITY_TERMS.some((term) => combined.includes(term));
}

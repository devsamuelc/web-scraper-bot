import { Prisma } from "@prisma/client";

export function parseJsonArray(json: Prisma.JsonValue): string[] {
  if (json === null || json === undefined) {
    return [];
  }

  if (Array.isArray(json)) {
    return json.filter((item) => typeof item === "string");
  }

  return [];
}
import { describe, it, expect } from "vitest";
import { PALETTES, PALETTE_KEYS, type Identity } from "@/theme/palettes";

describe("palettes", () => {
  it("defines both identities", () => {
    const ids: Identity[] = ["researcher", "musician"];
    for (const id of ids) expect(PALETTES[id]).toBeDefined();
  });

  it("every identity defines every palette key", () => {
    for (const id of Object.keys(PALETTES) as Identity[]) {
      for (const key of PALETTE_KEYS) {
        expect(PALETTES[id][key], `${id}.${key}`).toMatch(/.+/);
      }
    }
  });
});

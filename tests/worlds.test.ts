import { describe, it, expect } from "vitest";
import { WORLDS, WORLD_KEYS, type WorldKey } from "@/theme/worlds";

describe("worlds", () => {
  it("defines research and music", () => {
    expect(WORLD_KEYS).toEqual(["research", "music"]);
  });

  it("each world has label, role, route, and accents", () => {
    for (const key of WORLD_KEYS as readonly WorldKey[]) {
      const w = WORLDS[key];
      expect(w.label).toMatch(/.+/);
      expect(w.role).toMatch(/.+/);
      expect(w.route).toMatch(/^\//);
      expect(w.accent).toMatch(/^#/);
      expect(w.accent2).toMatch(/^#/);
      expect(w.accentSoft).toMatch(/rgba/);
    }
  });
});

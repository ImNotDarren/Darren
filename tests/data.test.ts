import { describe, it, expect } from "vitest";
import { publications } from "@/data/publications";
import { projects } from "@/data/projects";
import { discography } from "@/data/discography";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";

const urlRe = /^(https?:|mailto:)/;

describe("data integrity", () => {
  it("publications have required fields and valid urls", () => {
    expect(publications.length).toBeGreaterThanOrEqual(11);
    for (const p of publications) {
      expect(p.title).toMatch(/.+/);
      expect(p.authors).toMatch(/.+/);
      expect(p.year).toBeGreaterThan(2000);
      expect(p.url).toMatch(urlRe);
      expect(["journal", "conference", "preprint"]).toContain(p.type);
    }
  });

  it("projects have name and description", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name).toMatch(/.+/);
      expect(p.description).toMatch(/.+/);
      if (p.url) expect(p.url).toMatch(urlRe);
    }
  });

  it("discography entries are valid", () => {
    for (const r of discography) {
      expect(r.title).toMatch(/.+/);
      expect(r.year).toBeGreaterThan(2000);
      expect(["album", "ep", "single"]).toContain(r.type);
      expect(r.url).toMatch(urlRe);
    }
  });

  it("experience entries are valid", () => {
    for (const e of experience) {
      expect(e.role).toMatch(/.+/);
      expect(e.org).toMatch(/.+/);
      expect(e.points.length).toBeGreaterThan(0);
    }
  });

  it("profile has contacts", () => {
    expect(profile.contacts.length).toBeGreaterThan(0);
    for (const c of profile.contacts) expect(c.href).toMatch(urlRe);
  });

  it("experience entries are world-tagged", () => {
    for (const e of experience) {
      expect(["research", "music", "both"]).toContain(e.world);
    }
    expect(experience.some((e) => e.world === "music")).toBe(true);
    expect(experience.some((e) => e.world === "research")).toBe(true);
  });

  it("profile has per-world about and stats", () => {
    expect(profile.about.research).toMatch(/.+/);
    expect(profile.about.music).toMatch(/.+/);
    expect(profile.stats.research.length).toBe(3);
    expect(profile.stats.music.length).toBe(3);
  });
});

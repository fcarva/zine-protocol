import { describe, expect, it } from "vitest";
import { getPublishedZines, parseZineFrontmatter } from "../lib/zines";

describe("zine frontmatter", () => {
  it("rejects campaign without required fields", () => {
    expect(() =>
      parseZineFrontmatter({
        slug: "teste",
        title: "Teste",
        artist_name: "Autor",
        artist_wallet: "0x1111111111111111111111111111111111111111",
        cover_image: "/images/teste.svg",
        excerpt: "descricao com tamanho suficiente para passar na regra",
        tags: ["teste"],
        language: "pt-BR",
        city: "Sao Paulo",
        year: 2026,
        format: "A5",
        themes_controlled: ["arquivo"],
        revnet_project_id: 12,
        funding_mode: "campaign",
        status: "published",
        sort_order: 1,
      }),
    ).toThrow();
  });

  it("rejects metadata outside controlled schema", () => {
    expect(() =>
      parseZineFrontmatter({
        slug: "teste-meta",
        title: "Teste Meta",
        artist_name: "Autoria",
        artist_wallet: "0x1111111111111111111111111111111111111111",
        cover_image: "/images/teste.svg",
        excerpt: "descricao com tamanho suficiente para passar na regra",
        tags: ["teste"],
        language: "de",
        city: "Berlin",
        year: 2026,
        format: "A5",
        themes_controlled: ["arquivo"],
        revnet_project_id: 15,
        funding_mode: "continuous",
        status: "published",
        sort_order: 2,
      }),
    ).toThrow();
  });

  it("loads published zines from repository content", async () => {
    const zines = await getPublishedZines();
    expect(zines.length).toBeGreaterThanOrEqual(3);
    expect(zines.every((zine) => zine.status === "published")).toBe(true);
    expect(zines.every((zine) => Boolean(zine.language && zine.city && zine.year && zine.format))).toBe(
      true,
    );
  });
});


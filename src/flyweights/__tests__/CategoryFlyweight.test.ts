import { beforeEach, describe, expect, it } from "vitest";
import {
  getCategory,
  primeCategories,
  resetCategories,
} from "@/flyweights/CategoryFlyweight";

describe("CategoryFlyweight", () => {
  beforeEach(() => {
    resetCategories();
  });

  it("returns the same category instance for the same id", () => {
    primeCategories([
      { id: "core", name: "Core", color: "#111111", icon: "Globe" },
    ]);

    const category = getCategory("core");
    expect(category).not.toBeNull();
    expect(getCategory("core")).toBe(category);
  });

  it("returns different category instances for different ids", () => {
    primeCategories([
      { id: "core", name: "Core", color: "#111111", icon: "Globe" },
      { id: "platform", name: "Platform", color: "#222222", icon: "Server" },
    ]);

    expect(getCategory("core")).not.toBe(getCategory("platform"));
  });

  it("freezes category flyweights", () => {
    primeCategories([
      { id: "core", name: "Core", color: "#111111", icon: "Globe" },
    ]);

    const category = getCategory("core");
    expect(category).not.toBeNull();
    expect(Object.isFrozen(category)).toBe(true);
  });
});

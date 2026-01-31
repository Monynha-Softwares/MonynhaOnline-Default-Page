import { describe, expect, it } from "vitest";
import { getIcon } from "@/flyweights/IconFactory";

describe("IconFactory", () => {
  it("returns the same icon instance for the same key", () => {
    const icon = getIcon("Globe");
    expect(getIcon("Globe")).toBe(icon);
  });

  it("returns different icon instances for different keys", () => {
    expect(getIcon("Globe")).not.toBe(getIcon("Zap"));
  });

  it("freezes icon flyweights", () => {
    expect(Object.isFrozen(getIcon("Globe"))).toBe(true);
  });
});

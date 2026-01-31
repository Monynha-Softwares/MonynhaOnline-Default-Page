import { describe, expect, it } from "vitest";
import { getStyle } from "@/flyweights/StyleFlyweight";

describe("StyleFlyweight", () => {
  it("returns the same style instance for the same key", () => {
    const style = getStyle("mutedForeground");
    expect(getStyle("mutedForeground")).toBe(style);
  });

  it("returns different style instances for different keys", () => {
    expect(getStyle("mutedForeground")).not.toBe(getStyle("glassCard"));
  });

  it("freezes style flyweights", () => {
    expect(Object.isFrozen(getStyle("mutedForeground"))).toBe(true);
  });
});

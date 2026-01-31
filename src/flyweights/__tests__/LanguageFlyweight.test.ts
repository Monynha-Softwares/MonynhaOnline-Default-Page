import { describe, expect, it } from "vitest";
import { getLanguage } from "@/flyweights/LanguageFlyweight";

describe("LanguageFlyweight", () => {
  it("returns the same language instance for the same code", () => {
    const language = getLanguage("en");
    expect(getLanguage("en")).toBe(language);
  });

  it("returns different language instances for different codes", () => {
    expect(getLanguage("en")).not.toBe(getLanguage("pt"));
  });

  it("freezes language flyweights", () => {
    expect(Object.isFrozen(getLanguage("en"))).toBe(true);
  });
});

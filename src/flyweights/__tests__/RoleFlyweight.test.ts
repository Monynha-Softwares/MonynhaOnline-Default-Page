import { describe, expect, it } from "vitest";
import { getRole } from "@/flyweights/RoleFlyweight";

describe("RoleFlyweight", () => {
  it("returns the same role instance for the same key", () => {
    const role = getRole("owner");
    expect(getRole("owner")).toBe(role);
  });

  it("returns different role instances for different keys", () => {
    expect(getRole("owner")).not.toBe(getRole("editor"));
  });

  it("freezes role flyweights", () => {
    expect(Object.isFrozen(getRole("owner"))).toBe(true);
  });
});

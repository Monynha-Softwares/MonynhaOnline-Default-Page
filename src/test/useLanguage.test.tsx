import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { useLanguage } from "@/hooks/useLanguage";

describe("useLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads the default language dictionary", async () => {
    const { result } = renderHook(() => useLanguage());

    await waitFor(() => {
      expect(result.current.t("heroTitle")).toBe("Monynha Online");
    });
  });

  it("switches languages and persists selection", async () => {
    const { result } = renderHook(() => useLanguage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.changeLanguage("en");
    });

    await waitFor(() => {
      expect(result.current.t("heroSubtitle")).toBe("The heart of our infrastructure.");
    });

    expect(window.localStorage.getItem("monynha-language")).toBe("en");
  });
});

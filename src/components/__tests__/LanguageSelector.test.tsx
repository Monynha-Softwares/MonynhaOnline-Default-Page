import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageSelector } from "@/components/LanguageSelector";

const changeLanguage = vi.fn();

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    currentLanguage: "en",
    changeLanguage,
    languages: ["en", "pt"],
  }),
}));

vi.mock("@/flyweights/LanguageFlyweight", () => ({
  getLanguage: (code: string) => ({
    code,
    nativeLabel: code === "en" ? "English" : "Português",
  }),
}));

vi.mock("@/flyweights/StyleFlyweight", () => ({
  getStyle: (key: string) => ({ key, className: `style-${key}` }),
}));

vi.mock("@/flyweights/IconFactory", () => ({
  getIcon: (name: string) =>
    function Icon(props: React.SVGProps<SVGSVGElement>) {
      return <svg data-icon={name} {...props} />;
    },
}));

describe("LanguageSelector", () => {
  it("renders the current language and icon from flyweights", () => {
    const { container } = render(<LanguageSelector />);

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(container.querySelector('svg[data-icon="Globe"]')).toBeInTheDocument();
  });
});

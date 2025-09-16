export const LINKS = {
  home: "/",
  social: {
    github: "https://github.com/monynha",
    twitter: "https://twitter.com/monynha",
    website: "https://monynha.com",
    about: "https://monynha.com/about",
    contact: "https://monynha.com/contact",
  },
  admin: {
    dashboard: "https://admin.monynha.online",
    itPortal: "https://it.monynha.online",
  },
  ecosystem: {
    monynhaCom: {
      domain: "monynha.com",
      url: "https://monynha.com",
    },
    monynhaTech: {
      domain: "monynha.tech",
      url: "https://monynha.tech",
    },
    monynhaFun: {
      domain: "monynha.fun",
      url: "https://monynha.fun",
    },
    monynhaMe: {
      domain: "monynha.me",
      url: "https://monynha.me",
    },
  },
} as const;

export type LinkConfig = typeof LINKS;
export type EcosystemLinkKey = keyof LinkConfig["ecosystem"];

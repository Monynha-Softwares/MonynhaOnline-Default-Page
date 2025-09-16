export const LINKS = {
  home: "/",
  social: {
    github: "https://github.com/Monynha-Softwares",
    website: "https://monynha.com",
    about: "https://monynha.com/about",
    contact: "https://monynha.com/contact",
  },
  admin: {
    dashboard: "https://it.monynha.online",
    itPortal: "https://it.monynha.online/projects",
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
      domain: "monynha.online",
      url: "https://monynha.fun",
    },
    monynhaMe: {
      domain: "docs.monynha",
      url: "https://monynha.me",
    },
  },
} as const;

export type LinkConfig = typeof LINKS;
export type EcosystemLinkKey = keyof LinkConfig["ecosystem"];

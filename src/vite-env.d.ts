/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_LIQUIDETHER_ENABLED?: string;
  readonly NEXT_PUBLIC_LIQUIDETHER_COLORS?: string;
  readonly NEXT_PUBLIC_LIQUIDETHER_RESOLUTION?: string;
  readonly NEXT_PUBLIC_LIQUIDETHER_INTENSITY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

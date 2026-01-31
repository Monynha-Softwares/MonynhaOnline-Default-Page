# Sistema de Profundidade (Elevation)

## Objetivo
Este documento descreve os tokens de profundidade e as classes utilitárias para sombras progressivas, garantindo consistência visual e hierarquia na interface.

## Tokens de profundidade
Os níveis de profundidade usam variáveis CSS globais, com valores em HSL para manter o padrão do design system.

### Light (padrão)
- `--shadow-sm`: `0 1px 2px hsl(0 0% 0% / 0.05)`
- `--shadow-md`: `0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1)`
- `--shadow-lg`: `0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1)`

- `--shadow-depth-1`: `var(--shadow-sm)`
- `--shadow-depth-2`: `var(--shadow-md)`
- `--shadow-depth-3`: `var(--shadow-lg)`

### Dark (`.dark`)
- `--shadow-depth-1`: `0 2px 6px hsl(0 0% 0% / 0.2)`
- `--shadow-depth-2`: `0 6px 15px -2px hsl(0 0% 0% / 0.3)`
- `--shadow-depth-3`: `0 8px 24px -3px hsl(0 0% 0% / 0.4)`

## Utilitários Tailwind
Além das classes padrão, há utilitários dedicados:
- `shadow-depth-1`, `shadow-depth-2`, `shadow-depth-3`: aplicam diretamente o nível de profundidade.

## Classes utilitárias globais
Use estas classes para padronizar estados de elevação sem editar componentes internos:

- `.elevation-card`: sombra base (depth-1) com aumento no hover/focus (depth-2).
- `.elevation-hover`: sem sombra em repouso, aplica depth-1 no hover/focus.
- `.elevation-dialog`: sombra máxima (depth-3) para modais/popovers.
- `.elevation-fab`: sombra depth-2 com aumento para depth-3 no hover/focus.

## Exemplos de uso
```tsx
<div className="elevation-card rounded-lg bg-card p-4">
  <PlaylistCard data={item} />
</div>
```

```tsx
<button className="elevation-fab rounded-full bg-primary p-4 text-primary-foreground">
  ➕
</button>
```

```tsx
<DialogContent className="elevation-dialog">
  {/* conteúdo */}
</DialogContent>
```

## Acessibilidade e contraste
- Para elementos focáveis, combine com `focus-visible:ring-2` e `focus-visible:ring-ring` quando fizer sentido.
- Verifique a legibilidade das sombras nos modos claro e escuro e ajuste os tokens se necessário.

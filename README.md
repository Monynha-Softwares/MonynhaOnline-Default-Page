# Monynha Online

Monynha Online é uma landing page estática que apresenta o ecossistema de projetos Monynha.
Ela é construída com [Vite](https://vitejs.dev/), [React](https://react.dev/) e [Tailwind CSS](https://tailwindcss.com/).

## Desenvolvimento

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```

## Build estático

Gere arquivos prontos para deploy com:
```sh
npm run build
```
Os arquivos finais serão criados na pasta `dist/`. O projeto utiliza `HashRouter`,
permitindo deploy em qualquer provedor de hospedagem estática sem necessidade de
configurações adicionais de rotas. Para testar a versão compilada localmente use:
```sh
npm run preview
```

## Estrutura

- `src/` – código fonte em TypeScript
- `index.html` – ponto de entrada da aplicação
- `404.html` – redireciona rotas desconhecidas para a aplicação

## Deploy

Basta servir o conteúdo da pasta `dist/` em um servidor estático (por exemplo,
GitHub Pages, Netlify ou Vercel). Nenhum backend é necessário.

## Licença

Projeto disponibilizado sob a licença MIT.

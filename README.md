# Radar Concursos

Painel em português de concursos públicos e seleções de TI no estado do Rio de Janeiro compatíveis com tecnólogo em Análise e Desenvolvimento de Sistemas (ADS).

## Rodar no VS Code

Use Node.js 22 e npm. Abra a pasta do projeto e execute no terminal:

```sh
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Use `npm run typecheck` para verificar o TypeScript e `npm run build` para gerar os arquivos estáticos em `out/`.

## Estrutura

- `src/app/` contém a página, os metadados e o CSS.
- `src/components/` contém o painel, os cartões, os detalhes, a comparação e o histórico.
- `src/data/opportunities.ts` guarda as oportunidades, as fontes e as retificações.
- `src/lib/catalog.ts` concentra a busca, os filtros, a ordenação e as regras de situação.
- `public/` contém o ícone do site.

## Atualizar o catálogo

Edite `src/data/opportunities.ts` depois de conferir os documentos oficiais. Mantenha o `id` dos cargos existentes para preservar os favoritos e use datas no formato `AAAA-MM-DD`. Atualize `reviewDate` com a data da conferência e registre retificações em `changes`.

A situação das inscrições usa o horário de São Paulo. A curadoria é manual. Favoritos ficam no navegador. O projeto dispensa API, banco de dados, login e variáveis de ambiente.

## Publicar na Vercel

Envie os arquivos desta pasta ao seu repositório GitHub. No painel da Vercel, selecione **Add New → Project**, importe o repositório e escolha o preset **Next.js**. Use Node.js 22, mantenha o comando de build padrão e deixe o diretório de saída no padrão do preset. Em seguida, selecione **Deploy**.

[Importação de repositórios Git na Vercel](https://vercel.com/docs/git)

# Radar Concursos

Painel em português de concursos públicos e seleções de diferentes áreas profissionais no Brasil, com cobertura inicial parcial.

## Rodar no VS Code

Use Node.js 22 e npm. Abra a pasta do projeto e execute no terminal:

```sh
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Use `npm run typecheck` para verificar o TypeScript e `npm run build` para compilar a versão de produção.

## Estrutura

- `src/app/` contém a página, os metadados e o CSS.
- `src/components/` contém o painel, os cartões, os detalhes, a comparação e o histórico.
- `src/data/opportunities.ts` guarda as oportunidades, as fontes e as retificações.
- `src/app/api/official-notices/` recebe as consultas sob demanda e `src/lib/official-notices/` integra o Diário Oficial do RJ.
- `src/lib/catalog.ts` concentra a busca, os filtros, a ordenação e as regras de situação.
- `public/` contém o ícone do site.

## Atualizar o catálogo

Edite `src/data/opportunities.ts` depois de conferir os documentos oficiais. Mantenha o `id` dos cargos existentes para preservar os favoritos e use datas no formato `AAAA-MM-DD`. Use `professionalArea` para a categoria ampla (como Saúde) e `specialty` para a especialidade (como Fonoaudiologia). Registre formação e habilitação em `requirement`. Atualize `reviewDate` com a data da conferência e registre retificações em `changes`.

Use `locations` para listar as UFs e municípios de lotação. Informe os códigos do [IBGE](https://servicodados.ibge.gov.br/api/docs/localidades) em `municipality.id`. Se o edital definir somente a UF, omita o município. Marque lotações possíveis com `tentative` e localidades que oferecem apenas cadastro de reserva com `reserveOnly`. Registre locais de prova separadamente em `examLocation`.

A situação das inscrições usa o horário de São Paulo. A curadoria é manual. Favoritos ficam no navegador. O projeto dispensa banco de dados, login e variáveis de ambiente.

## Busca sob demanda

A aba **Busca oficial** consulta o índice público do Diário Oficial do RJ por palavra-chave e mês e exibe até 25 matérias, com data, link oficial e indicação de revisão pendente. O catálogo revisado continua separado. O Diário Oficial da União tem acesso externo nesta etapa.

A API interna `GET /api/official-notices?q=concurso&month=2026-11` consulta o índice no momento da solicitação. A página principal continua pré-renderizada. A consulta usa uma função Next.js na Vercel e requer o preset Next.js com o diretório de saída no padrão, sem apontar para `out/`.

## Publicar na Vercel

Envie os arquivos desta pasta ao seu repositório GitHub. No painel da Vercel, selecione **Add New → Project**, importe o repositório e escolha o preset **Next.js**. Use Node.js 22, mantenha o comando de build padrão e deixe o diretório de saída no padrão do preset. Em seguida, selecione **Deploy**.

[Importação de repositórios Git na Vercel](https://vercel.com/docs/git)

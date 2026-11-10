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
- `src/data/opportunities.ts` guarda os cargos e seus dados vigentes.
- `src/data/notices.ts` guarda os editais, as fontes oficiais e as retificações.
- `src/app/api/official-notices/` recebe as consultas sob demanda e `src/lib/official-notices/` integra o Diário Oficial do RJ.
- `src/lib/catalog.ts` concentra a busca, os filtros, a ordenação e as regras de situação.
- `public/` contém o ícone do site.

## Atualizar o catálogo

Edite `src/data/opportunities.ts` depois de conferir os documentos oficiais. Mantenha o `id` dos cargos existentes para preservar os favoritos e use datas no formato `AAAA-MM-DD`. Use `professionalArea` para a categoria ampla (como Saúde) e `specialty` para a especialidade (como Fonoaudiologia). Registre formação e habilitação em `requirement`. Atualize `reviewDate` com a data da conferência.

Use `locations` para listar as UFs e municípios de lotação. Informe os códigos do [IBGE](https://servicodados.ibge.gov.br/api/docs/localidades) em `municipality.id`. Se o edital definir somente a UF, omita o município. Marque lotações possíveis com `tentative` e localidades que oferecem apenas cadastro de reserva com `reserveOnly`. Registre locais de prova separadamente em `examLocation`.

A situação das inscrições usa o horário de São Paulo. A curadoria é manual. Favoritos ficam no navegador. O catálogo e a busca sob demanda dispensam banco de dados, login e variáveis de ambiente.

## Registrar retificações conferidas

Use `noticeId` para vincular o cargo ao edital em `src/data/notices.ts`. Registre cada publicação oficial uma única vez em `amendments`, com identificador estável dentro do edital, data, link e lista de alterações. Use `before` e `after` para os valores conferidos, e `opportunityIds` quando a mudança só se aplicar a alguns cargos. Atualize os dados vigentes dos cargos afetados na mesma alteração.

O histórico público é gerado a partir desse registro revisado. As matérias encontradas na busca oficial só entram no catálogo após conferência manual do documento e vínculo com o edital de origem.

## Busca sob demanda

A aba **Busca oficial** consulta o índice público do Diário Oficial do RJ por palavra-chave e mês e exibe até 25 matérias, com data, link oficial e indicação de revisão pendente. O catálogo revisado continua separado. O Diário Oficial da União tem acesso externo nesta etapa.

A API interna `GET /api/official-notices?q=concurso&month=2026-11` consulta o índice no momento da solicitação. A página principal continua pré-renderizada. A consulta usa uma função Next.js na Vercel e requer o preset Next.js com o diretório de saída no padrão, sem apontar para `out/`.

## Ativar o monitoramento diário

O monitoramento consulta o Diário Oficial do RJ, a UFRRJ e a Prefeitura de Praia Grande. Registra o horário de cada tentativa e guarda a última leitura bem-sucedida, inclusive quando a fonte falha. As publicações continuam pendentes de revisão e o DOU segue com consulta externa.

1. Conecte uma instância do **Upstash Redis** ao projeto de produção na Vercel. Confirme as variáveis `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`. Se a integração usar outros nomes, copie os valores da aba REST do Upstash para essas variáveis.
2. Defina `CRON_SECRET` em produção com um segredo aleatório (por exemplo, gere-o com `openssl rand -hex 32`). Guarde as credenciais apenas no ambiente da Vercel ou no seu `.env.local`.
3. Faça um novo deploy de produção e confira **Schedules → Cron Jobs**. O `vercel.json` agenda `/api/cron/official-sources` diariamente às 15h UTC, na janela das 12h em Brasília.
4. Após a primeira execução, abra **Busca oficial → Monitoramento de fontes** para ver a situação. A rota pública `GET /api/official-sources` lê o registro. A atualização exige o cabeçalho `Authorization: Bearer <CRON_SECRET>`.

Sem as variáveis de armazenamento, a busca sob demanda e o catálogo continuam disponíveis e a interface indica que o monitoramento está pendente de configuração.

- [Agendamentos da Vercel](https://vercel.com/docs/schedules/cron-jobs)
- [Upstash Redis na Vercel](https://vercel.com/marketplace/upstash)

## Publicar na Vercel

Envie os arquivos desta pasta ao seu repositório GitHub. No painel da Vercel, selecione **Add New → Project**, importe o repositório e escolha o preset **Next.js**. Use Node.js 22, mantenha o comando de build padrão e deixe o diretório de saída no padrão do preset. Em seguida, selecione **Deploy**.

[Importação de repositórios Git na Vercel](https://vercel.com/docs/git)

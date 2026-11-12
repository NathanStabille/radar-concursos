# Radar Concursos

Portal em português de concursos públicos e seleções de diferentes áreas profissionais no Brasil. A cobertura ainda é parcial; os registros podem ter inscrições encerradas. Use os filtros e confira os documentos oficiais antes de se inscrever.

## Desenvolvimento local

Use Node.js 22 e npm:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Abra [localhost:3000](http://localhost:3000). Sem `DATABASE_URL`, o site usa os 35 cargos iniciais e sinaliza **Catálogo inicial**. Isso permite experimentar a interface sem configurar serviços externos.

```sh
npm run typecheck
npm test
npm run build
```

Os testes de integração executam as migrações e consultas em PostgreSQL embarcado com PGlite, sem credenciais ou conexão com o banco de produção.

## Ativar o catálogo no PostgreSQL

O catálogo usa PostgreSQL. O Redis já configurado continua guardando as leituras do monitoramento de fontes; ele não substitui o banco do catálogo.

1. Crie um banco PostgreSQL, por exemplo com a integração [Neon na Vercel](https://neon.com/docs/guides/vercel-overview).
2. Configure `DATABASE_URL` no projeto Vercel, no ambiente **Production**. A conexão com pool é adequada para as funções do site. Use outro banco para Preview e desenvolvimento se quiser testar alterações sem afetar produção.
3. No seu computador, preencha `DATABASE_URL` em `.env.local` com a conexão do banco que deseja preparar. Se o provedor fornecer uma conexão direta, ela pode ser informada em `DATABASE_URL_UNPOOLED` para o comando de migração. Não deixe essa variável vazia se for usá-la.
4. Execute, na raiz do projeto:

   ```sh
   npm run db:setup
   ```

5. Faça um novo deploy na Vercel após configurar as variáveis de ambiente.

O comando aplica as migrações de `db/migrations/` e importa os 35 cargos, seus editais, lotações e retificações em uma transação. Preserva os IDs dos favoritos e não sobrescreve registros existentes ao ser executado novamente. O build e as requisições públicas não executam migrações nem importações.

`.env.local` é ignorado pelo Git. As conexões e tokens pertencem ao servidor; não use prefixo `NEXT_PUBLIC_` nessas variáveis.

### Confirmar o funcionamento

Abra `/api/opportunities` no domínio publicado:

- `source: "database"`: a API está lendo o PostgreSQL. Após a primeira importação, `total` deve ser 35 e `items` deve trazer oito cargos.
- `source: "initial"`: `DATABASE_URL` ainda não está disponível nesse deploy.
- HTTP 503: o banco foi configurado, mas a consulta falhou. Confira a conexão e se `npm run db:setup` foi executado no mesmo banco.

Um banco configurado e vazio retorna zero registros. Falhas de conexão não trocam silenciosamente os dados pelo catálogo inicial.

### Como manter os registros nesta etapa

As tabelas `radar_organizations`, `radar_notices`, `radar_opportunities`, `radar_opportunity_locations` e `radar_amendments` guardam os dados. `radar_states` guarda as UFs; `radar_migrations` registra o esquema aplicado.

O campo `review_status` aceita `pending`, `approved` e `rejected`; novos editais, cargos e retificações começam pendentes. Um cargo só aparece quando ele e o edital estão aprovados. A aprovação de cargo e edital exige `reviewed_on`. O histórico mostra somente retificações aprovadas de editais com cargos publicados.

Por enquanto, a manutenção acontece pelo editor SQL do banco. Altere os dados vigentes e registre a retificação conferida na mesma transação. Use `changes` como uma lista de objetos com `category` (`Prazo`, `Escolaridade` ou `Remuneração`), `field`, `after` e, quando conhecidos, `before`, `context` e `opportunityIds`.

Preserve os IDs existentes. Valores ausentes, como remuneração e datas ainda não confirmadas, devem continuar nulos. Informe as lotações em `radar_opportunity_locations`, com código de município do [IBGE](https://servicodados.ibge.gov.br/api/docs/localidades); mantenha o local de prova no campo `exam_location` do cargo.

Depois da ativação do banco, os arquivos `src/data/opportunities.ts` e `src/data/notices.ts` servem apenas para a importação inicial e para ambientes sem conexão. Alterá-los não modifica registros já existentes no PostgreSQL.

O painel de revisão e a extração automática dos editais são as próximas etapas. O monitoramento atual encontra publicações, mas ainda não cria cargos automaticamente.

## API pública do catálogo

`GET /api/opportunities` aceita:

| Parâmetro                       | Valores                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `search`                        | Busca textual, até 100 caracteres, sem diferenciar acentos                                        |
| `state`, `municipality`         | Sigla da UF e código IBGE de sete dígitos                                                         |
| `professionalArea`, `specialty` | Área e especialidade cadastradas                                                                  |
| `salary`                        | `low` (< R$ 8 mil), `mid` (R$ 8 mil a menos de R$ 10 mil), `high` (≥ R$ 10 mil), `unknown`        |
| `status`                        | `open`, `upcoming`, `ongoing`, `closed`, `finished`, `unknown`                                    |
| `sort`                          | `recent` (padrão), `salary`, `org`                                                                |
| `page`                          | Página, começando em 1; oito cargos por página                                                    |
| `ids`                           | IDs separados por vírgula, até 200, para consultar favoritos; uma lista vazia retorna zero cargos |

A resposta contém `items`, `total`, `page`, `totalPages`, `first`, `last`, `facets`, `summary` e `source`. As opções dos filtros e o resumo são calculados a partir de todos os cargos publicados, enquanto `total` considera os filtros da consulta.

Exemplo: `/api/opportunities?state=RJ&professionalArea=Saúde&sort=salary&page=1`.

`GET /api/catalog/history` retorna `{ "entries": [...] }` e aceita `category=Prazo`, `Escolaridade` ou `Remuneração`. Parâmetros inválidos retornam HTTP 400. As duas rotas são somente leitura, exibem dados aprovados e usam `Cache-Control: no-store`.

A página consulta o banco a cada acesso. Os filtros e a paginação consultam a API, e o catálogo aberto é atualizado a cada minuto. Isso permite mostrar alterações salvas no banco sem recompilar o site; a coleta e a revisão das fontes continuam tendo sua própria frequência.

## Interface

O botão de sol/lua alterna os temas claro e escuro. No primeiro acesso, o tema acompanha o sistema; a escolha manual fica salva neste navegador. As cores são definidas pelos tokens de `src/app/globals.css`.

Catálogo e favoritos mostram oito cargos por página. Favoritos permanecem no navegador, e a comparação aceita até três cargos de páginas diferentes. A situação das inscrições segue o horário de São Paulo.

## Busca oficial e monitoramento

A aba **Busca oficial** consulta o índice público do Diário Oficial do RJ por palavra-chave e mês, com até 25 matérias. Os resultados mostram links oficiais e revisão pendente. O Diário Oficial da União tem acesso externo nesta etapa.

`GET /api/official-notices?q=concurso&month=2026-11` faz a busca sob demanda. O monitoramento diário consulta IOERJ, UFRRJ e Prefeitura de Praia Grande e conserva a última leitura bem-sucedida quando uma fonte falha.

Para ativar o monitoramento:

1. Conecte o **Upstash Redis** ao projeto Vercel. O código usa `KV_REST_API_URL` e `KV_REST_API_TOKEN`, criadas pela integração. Confirme que estão em **Production**, usando o token com permissão de escrita.
2. Defina `CRON_SECRET`, gerado por exemplo com `openssl rand -hex 32`.
3. Faça um deploy de produção e confira **Schedules → Cron Jobs**. O `vercel.json` agenda `/api/cron/official-sources` diariamente às 15h UTC, na janela das 12h em Brasília.
4. Confira **Busca oficial → Monitoramento de fontes**. A rota pública `/api/official-sources` lê o registro; executar o cron exige `Authorization: Bearer <CRON_SECRET>`.

Sem essas variáveis, a busca sob demanda funciona e o painel informa que o monitoramento está pendente de configuração.

## Organização do código

- `src/app/`: página dinâmica e rotas de API.
- `src/components/` e `src/hooks/`: interface e carregamento do catálogo.
- `src/types/catalog.ts`: contrato compartilhado do catálogo.
- `src/lib/catalog-db/`: conexão, validação, consultas e seleção entre banco e dados iniciais.
- `src/lib/catalog.ts`: formatação, datas e filtros do catálogo inicial.
- `src/lib/official-notices/`: integrações com fontes oficiais.
- `src/data/`: catálogo inicial e localidades.
- `db/migrations/` e `scripts/`: esquema e importação inicial.
- `tests/`: testes de integração do catálogo.

## Publicação

Envie os arquivos ao GitHub e importe o repositório na Vercel com o preset **Next.js**, Node.js 22 e build padrão. Mantenha o diretório de saída no padrão do preset: o projeto usa funções de servidor e não exportação estática para `out/`.

- [Importar repositórios na Vercel](https://vercel.com/docs/git)
- [Cron Jobs da Vercel](https://vercel.com/docs/schedules/cron-jobs)
- [Upstash na Vercel](https://vercel.com/marketplace/upstash)

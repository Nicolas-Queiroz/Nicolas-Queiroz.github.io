# CLAUDE.md

## Sobre o projeto

Portfolio pessoal e blog do Nícolas Roberto de Queiroz, publicado em
https://nicolas-queiroz.github.io. Site bilíngue PT/EN (rotas `/pt/*` e
`/en/*`), com um blog cujos posts nascem de notícias lidas pelo Nícolas e
são rascunhados com ajuda de um agente de IA, sempre revisados por ele antes
de publicar. Deploy automático via GitHub Actions em todo push na `main`.

## Stack

- Astro 5 (`astro@^5.1.1`), output estático
- Tailwind CSS 4 (`@tailwindcss/vite`)
- `@astrojs/sitemap`
- i18n nativo do Astro (`defaultLocale: pt`, `locales: [pt, en]`, `prefixDefaultLocale: true`)
- Node.js (sem runtime de servidor — build 100% estático para GitHub Pages)
- Bot de conteúdo em Python 3.12 (`requests`, `google-generativeai`, `python-slugify`)

## Comandos essenciais

```
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção (dist/)
npm run preview   # serve o build de dist/ localmente
```

Bot de posts (opcional, local):
```
pip install -r scripts/requirements.txt
CURRENTS_API_KEY=... GEMINI_API_KEY=... python scripts/gerar_post.py
```
Isso gera rascunhos em `drafts/pt/` e `drafts/en/` — nunca publica direto.

## Estrutura de conteúdo

- Posts publicados: `src/content/posts/pt/` e `src/content/posts/en/`
- Rascunhos do bot (pré-revisão): `drafts/pt/` e `drafts/en/`
- Capas: geradas automaticamente por `src/components/PostCover.astro` (placa de circuito derivada da seed do post). Imagem manual opcional em `public/posts-images/`
- Dados pessoais (bio, skills, experiência): `src/data/profile.ts`

Schema do frontmatter (`src/content.config.ts`):
```yaml
title: string          # obrigatório
description: string    # obrigatório
pubDate: date           # obrigatório (coagido de string)
lang: "pt" | "en"       # obrigatório
tags: string[]          # opcional, default []
source: string (URL)    # opcional
sourceName: string      # opcional
image: string           # opcional, substitui a capa gerada. Ex.: "/posts-images/slug.png"
```

Rotas dinâmicas que renderizam os posts: `src/pages/pt/blog/[...slug].astro`
e `src/pages/en/blog/[...slug].astro`. Listagens em
`src/pages/pt/blog/index.astro` e `src/pages/en/blog/index.astro`.
Card de post reutilizado em ambas: `src/components/ArticleCard.astro`.

## Convenções

- Nome de arquivo de post: `AAAA-MM-DD-slug.md`
- Slug: kebab-case, sem acento, curto (~50 caracteres)
- Todo post em PT deve ter equivalente em EN (mesma data, slug pode diferir por idioma — a UI não assume slugs iguais entre `pt/` e `en/`)
- Capa de post: não criar SVG à mão. Sem `image` no frontmatter, a página do post gera a capa com as peças de circuito (`src/lib/circuit.ts`), já nas cores do tema claro e escuro. A seed é `source` (ou o id do arquivo), então preencher `source` faz PT e EN terem a mesma capa e o mesmo carimbo. Só usar `image` quando houver uma imagem real que agregue (foto, diagrama, print)
- Identidade visual: peças de circuito (trilhas, chips, nós) na paleta `--color-tile-*`; peça ligada ao agente (bloco vermelho) fica azul com trilha amarela, desligada fica apagada. Reutilizar `Tile`, `TileStamp`, `TileWall` e `PostCover` em vez de criar gráficos novos
- Cores sempre via as variáveis de `src/styles/global.css` (`var(--color-accent)`, `--color-ink`, `--color-bg`, `--color-card`, `--color-border`, etc.) — nunca hardcode hex ou classes de cor fixas do Tailwind
- Layout base é sempre `src/layouts/BaseLayout.astro`

## Como escrever posts (voz e tom)

1. Primeira pessoa quando fizer sentido. Ex.: "Eu li isso e pensei X".
2. Nunca abrir com clichê: "No mundo tecnológico de hoje", "Cada vez mais", "Nos últimos anos", "A tecnologia X vem revolucionando" e variações são banidos. Abrir com opinião crua, constatação prática ou pergunta honesta.
3. 300–450 palavras. Parágrafo de abertura + uma seção `##` de análise técnica + opcionalmente uma seção final com reflexão ou provocação.
4. Trazer pelo menos uma conexão real com o contexto profissional abaixo, nunca inventar projetos ou opiniões fora dele.
5. Sem emoji. Sem listas com bullets, exceto quando essencial. Prefere prosa.
6. Encerrar com algo humano: opinião, dúvida, provocação. Nunca "Em conclusão" ou "É importante lembrar".
7. Versão em inglês é reescrita nativa, não tradução literal: mesma ideia, fluidez natural do idioma.
8. Citar a fonte no frontmatter (`source`, `sourceName`), mas nunca copiar frases longas da notícia, sempre reformular.
9. Nunca usar travessão (—) para intercalar ideias. Preferir ponto, vírgula, dois-pontos ou parênteses.

### Contexto profissional do Nícolas (pra dar sabor, não fabricar)

Engenheiro de Software, backend Python. Atualmente desenvolve módulos
customizados em Odoo 17 Enterprise para RH de uma rede com 90+ lojas, como
único desenvolvedor responsável ponta-a-ponta. Stack diária: Python,
Django, PostgreSQL, Odoo 17 Enterprise, Google Cloud Platform, Docker,
APIs RESTful. Já construiu: um serviço de programa de fidelidade em Odoo
com recursos consumidos por outras plataformas; um módulo independente de
logs GCP plugável a módulos selecionados; um agente MCP pessoal com skill
de code review e base de conhecimento em grafo no Obsidian. Interesses
fortes: agentes de IA, MCP, arquitetura modular desacoplada, automação,
código configurável/documentado/testado. Não inventar clientes, tecnologias
que ele não usa, ou opiniões fora deste contexto.

## Anti-padrões (evitar sempre)

- Não criar componentes React/Vue/etc. quando um `.astro` estático resolve.
- Não usar `client:*` a menos que interatividade seja essencial.
- Não hardcodar cores fora de `global.css`.
- Não criar um novo layout — usar `BaseLayout.astro`.
- Não alterar `src/data/profile.ts` sem confirmação explícita — são os dados pessoais do dono.
- Não adicionar dependências sem checar se o que já está instalado resolve.
- Publicação de post é commit direto na `main` (fluxo escolhido pelo dono) — não abrir PR para isso.

## Workflow de deploy

- Push na `main` dispara `.github/workflows/deploy.yml` (build Astro + `actions/deploy-pages`) automaticamente.
- Site atualiza em ~2 minutos. Não há comando de deploy manual.
- `.github/workflows/noticia.yml` roda o bot a cada 2 dias (cron) e só commita em `drafts/`, nunca em `src/content/posts/`.

## Quando pedir confirmação

- Antes de mudar o schema de content collections (`content.config.ts`).
- Antes de mudar estrutura de rotas ou o layout base.
- Antes de instalar dependência nova.
- Antes de mudar qualquer workflow em `.github/`.

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
- Capas: ilustrações SVG em `public/posts-images/` (ver "Como criar a capa do post"). `src/components/PostCover.astro` inlina o SVG para herdar as cores do tema; sem `image`, cai numa placa de circuito gerada
- O build converte cada capa SVG num PNG 1200x630 ao lado dela (`src/integrations/og-images.mjs`, usando `sharp`). Os PNGs são gerados, ignorados pelo git, e servem só ao `og:image` e ao botão de baixar a capa, porque LinkedIn, WhatsApp e X não renderizam SVG no preview de link
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
image: string           # esperado: "/posts-images/AAAA-MM-DD-slug-pt.svg" (mesmo arquivo no PT e no EN)
linkedin: string        # opcional, bloco YAML `|`: gancho do post do LinkedIn (ver seção abaixo)
```

Página inicial (`/pt/`, `/en/`) é a apresentação: `src/components/HomeContent.astro`
(hero + puzzle, bloco "Agora", últimos posts e `ContactSection.astro`).
O currículo completo mora em `/pt/sobre` e `/en/about`, via
`src/components/ResumeContent.astro` (stack, experiência, projetos, formação,
idiomas). Os slugs por idioma saem de `src/lib/routes.ts`, que também resolve
o link PT/EN do cabeçalho.
Rotas dinâmicas dos posts: `src/pages/{pt,en}/blog/[...slug].astro`, que
delegam para `src/components/PostPage.astro`. Listagens em
`src/pages/{pt,en}/blog/index.astro`, via `src/components/BlogIndex.astro`.
Card de post: `src/components/ArticleCard.astro`. Helpers de posts (ordenação,
href, tempo de leitura, relacionados): `src/lib/posts.ts`.

## Convenções

- Nome de arquivo de post: `AAAA-MM-DD-slug.md`
- Slug: kebab-case, sem acento, curto (~50 caracteres)
- Todo post em PT deve ter equivalente em EN (mesma data, slug pode diferir por idioma — a UI não assume slugs iguais entre `pt/` e `en/`)
- Todo post tem capa ilustrada sobre o tema do post (ver seção abaixo); PT e EN apontam para o mesmo SVG
- Identidade visual do site: peças de circuito (trilhas, chips, nós) na paleta `--color-tile-*`, usadas no puzzle do início (`TileWall`) e no logo (`TileStamp`). As capas usam a mesma paleta, mas com ilustração própria de cada assunto
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

## Como criar a capa do post

A capa é uma ilustração criativa sobre o assunto do post, nunca um gráfico
genérico. Pense numa metáfora visual da notícia (ex.: "a margem era pequena
demais" virando uma fita de prova em Lean; uma balança entre comprar e
construir; um balão de chat rachando e revelando uma UI de aprovação; uma
portaria na nuvem barrando crawlers). Use as capas existentes em
`public/posts-images/` como referência de nível.

- Arquivo: `public/posts-images/AAAA-MM-DD-slug-pt.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">`, sem prolog XML
- Sem texto em linguagem natural (a mesma capa serve PT e EN). Símbolos, números, código e matemática podem
- Cores só via classes num `<style>` interno, sempre com fallback: `fill: var(--color-tile-blue, #3f6df6)`. Variáveis: `--color-tile-blue`, `--color-tile-yellow`, `--color-tile-green`, `--color-tile-red`, `--color-tile-paper`, `--color-art-ink`
- Prefixo único por capa (2–3 letras + `-`) em todas as classes, keyframes e ids, porque o SVG é inlinado junto de outras capas
- Estilo: flat geométrico, formas grandes, contorno `--color-art-ink` com stroke-width 6 e cantos arredondados, fundo full-bleed numa cor da paleta (variar entre posts vizinhos), e sombra de adesivo (cópia da forma deslocada 10,10 em art-ink com opacity .2)
- Precisa funcionar como miniatura de ~360px: poucos detalhes minúsculos, nada cortado nas bordas
- Animação sutil: 2–3 loops CSS (transform/opacity), 3–8s, sem SMIL; elementos animados com a classe `<prefixo>-anim` e `@media (prefers-reduced-motion: reduce) { .<prefixo>-anim { animation: none !important; } }`
- Revisar renderizando nos temas claro e escuro antes de publicar

## Como preparar a publicação no LinkedIn

Cada post renderiza um bloco "Publicar no LinkedIn" no fim da página, com a
capa em PNG, o texto pronto e botões de copiar, baixar e abrir o LinkedIn. O
texto é montado em `linkedinPost()` (`src/lib/posts.ts`) juntando três partes:

1. o campo `linkedin` do frontmatter (ou, quando ele não existe, título +
   descrição como fallback);
2. a URL absoluta do post;
3. as hashtags derivadas de `tags`.

Então no frontmatter vai só o gancho, nunca o link nem as hashtags. Regras do
gancho: 60 a 120 palavras, primeira pessoa, abre com a opinião ou constatação
mais forte do post, fecha com pergunta honesta, sem emoji, sem hashtag e sem
travessão. Mesmas regras de voz dos posts. A versão EN é reescrita nativa.

O bot já gera esse campo nos rascunhos (`post_linkedin` no prompt do Gemini),
para ser revisado junto com o post.

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

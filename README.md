# Portfolio + Feed de Notícias por IA

Portfolio pessoal bilíngue (PT/EN) construído com Astro 5 + Tailwind CSS 4, hospedado no GitHub Pages, com feed de notícias curadas automaticamente por um agente de IA (Gemini + Currents API) rodando via GitHub Actions.

## Estrutura

```
Nicolas-Queiroz.github.io/
├── src/
│   ├── components/       # Header, Footer, HomeContent
│   ├── layouts/          # BaseLayout
│   ├── pages/
│   │   ├── pt/           # rotas em português
│   │   └── en/           # rotas em inglês
│   ├── content/posts/    # posts publicados (bot escreve aqui APÓS revisão)
│   │   ├── pt/
│   │   └── en/
│   ├── data/profile.ts   # SEUS DADOS PESSOAIS (edite aqui)
│   └── styles/
├── drafts/               # o bot escreve aqui primeiro (revisão manual)
│   ├── pt/
│   └── en/
├── scripts/
│   ├── gerar_post.py     # o bot
│   └── requirements.txt
├── .github/workflows/
│   ├── deploy.yml        # build + deploy do site
│   └── noticia.yml       # cron do bot (a cada 2 dias)
├── public/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Passo a passo — do zero ao site no ar

### 1. Antes de começar, edite seus dados

Abra `src/data/profile.ts` e:

- Troque o placeholder do LinkedIn: procure `SEU-USUARIO-AQUI` e substitua pelo seu username real.
- Confira se tudo mais está correto (email, telefone, bio, skills).

### 2. Teste localmente (opcional mas recomendado)

Você precisa de Node.js 22+ instalado. Depois:

```bash
npm install
npm run dev
```

Abra http://localhost:4321/ — vai redirecionar para /pt/. Confira o site.

### 3. Crie o repositório no GitHub

Importante: o nome do repositório precisa ser **exatamente** `Nicolas-Queiroz.github.io` (todo em minúsculas ou como você preferir, mas casando com seu username). Isso faz o site ser servido em `https://nicolas-queiroz.github.io/` sem sufixo.

1. Vá em https://github.com/new
2. Repository name: `Nicolas-Queiroz.github.io`
3. Deixe **público** (obrigatório para GitHub Pages grátis)
4. Não marque "Initialize this repository with..." (deixe tudo desmarcado)
5. Create repository

### 4. Faça o push do código

Dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Setup inicial: portfolio + bot de notícias"
git branch -M main
git remote add origin https://github.com/Nicolas-Queiroz/Nicolas-Queiroz.github.io.git
git push -u origin main
```

### 5. Ative GitHub Pages

1. No repo, vá em **Settings → Pages**
2. Em "Build and deployment", em "Source", selecione **GitHub Actions**
3. Pronto — o workflow `deploy.yml` vai rodar automaticamente e publicar o site.

Após ~2 minutos, o site estará em `https://nicolas-queiroz.github.io/`.

### 6. Configure as chaves secretas do bot

Antes de o bot rodar, você precisa criar contas grátis e adicionar as chaves como Secrets no GitHub.

**a) Chave do Currents API (grátis, sem cartão)**

1. Vá em https://currentsapi.services/
2. Register → crie conta gratuita
3. Copie a API key do dashboard

**b) Chave do Google Gemini (grátis, sem cartão)**

1. Vá em https://aistudio.google.com/
2. Login com Google
3. "Get API key" → "Create API key" → escolha um projeto (novo ou existente)
4. Copie a chave

⚠️ **Importante sobre o Gemini:** NÃO ative billing (cobrança) no projeto Google Cloud usado pelo Gemini. Se ativar, o free tier some completamente e cada chamada vira paga desde o primeiro token. Se precisar testar produção paga em algum momento, use um projeto Google Cloud SEPARADO.

**c) Adicione as chaves no GitHub**

1. No repo, **Settings → Secrets and variables → Actions**
2. Clique em **New repository secret**
3. Adicione as duas:
   - Name: `CURRENTS_API_KEY` → Value: sua chave da Currents
   - Name: `GEMINI_API_KEY` → Value: sua chave do Gemini

### 7. Rode o bot pela primeira vez (manual)

Não precisa esperar 2 dias — dispare manualmente:

1. No repo, aba **Actions**
2. No menu esquerdo, clique em **Gerar post de notícia (bot IA)**
3. Botão **Run workflow** → **Run workflow**
4. Aguarde ~1 minuto e recarregue a página

Se tudo deu certo, vão aparecer 2 arquivos novos em `drafts/pt/` e `drafts/en/`, e um commit automático "bot: novo(s) draft(s) de notícia" no seu repo.

### 8. Revise e publique o primeiro post

Este é o passo mais importante para qualidade:

1. Puxe as mudanças localmente: `git pull`
2. Abra os arquivos em `drafts/pt/` e `drafts/en/`
3. Leia — o Gemini escreve bem, mas às vezes precisa de ajustes
4. Se aprovar: **mova** os arquivos de `drafts/pt/` para `src/content/posts/pt/` (e o EN para `src/content/posts/en/`)
5. Delete os posts de exemplo (`2026-09-04-exemplo.md` e `2026-09-04-example.md`)
6. `git add`, `git commit -m "post: <título>"`, `git push`
7. O `deploy.yml` roda sozinho e em ~2 minutos o post está no ar.

### 9. Deixe rolar

A partir daqui, o cron dispara sozinho a cada 2 dias. Você só precisa revisar drafts e mover para posts quando quiser publicar. Se um dia o bot escolher uma notícia ruim ou o texto não te agradar, é só não mover — nada é publicado automaticamente.

## Ajustes que você pode querer fazer

### Mudar as palavras-chave que o bot busca

Edite `scripts/gerar_post.py`, seção `KEYWORDS` no topo.

### Mudar a frequência

Edite `.github/workflows/noticia.yml`, linha do `cron`. Exemplos:

- Diário: `"0 12 * * *"`
- Segunda, quarta, sexta: `"0 12 * * 1,3,5"`
- A cada 3 dias: `"0 12 */3 * *"`

### Publicar automaticamente (sem revisão)

Se um dia quiser confiar 100% no bot, edite `scripts/gerar_post.py` na função `write_draft` e troque `REPO_ROOT / "drafts" / lang` por `REPO_ROOT / "src" / "content" / "posts" / lang`. **Não recomendo** até você ter certeza da qualidade dos posts.

### Mudar cores

Edite as variáveis CSS em `src/styles/global.css` (bloco `@theme`).

## Custos

Zero. Detalhamento:

- **GitHub Pages**: grátis para repo público
- **GitHub Actions**: grátis para repo público (unlimited)
- **Currents API**: grátis, ~600-1000 requests/dia, sem cartão
- **Google Gemini** (Flash-Lite): grátis, 1000 requests/dia, sem cartão

Você usa ~8 requests a cada 2 dias (uma por keyword + 2 chamadas ao Gemini). Está anos-luz de bater qualquer limite.

## Transparência sobre IA

O rodapé do site informa claramente que os posts da seção Notícias são curados por IA que você desenvolveu, com revisão manual antes da publicação. Essa clareza é intencional — vira um ponto positivo do portfólio (mostra a habilidade prática com agentes/LLM) em vez de tentar disfarçar.

## Licença

MIT — use, modifique, redistribua livremente.

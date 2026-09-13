"""
Bot de curadoria de notícias com IA.

Fluxo:
1. Busca notícias recentes na Currents API filtrando por keywords do perfil.
2. Descarta as que já viraram post (compara URLs em posts existentes).
3. Escolhe a mais recente que sobrou.
4. Gera post original em PT e EN via Gemini.
5. Salva em drafts/pt/ e drafts/en/ para revisão manual.

Para publicar, mova o arquivo de drafts/{lang}/ para src/content/posts/{lang}/.

Variáveis de ambiente esperadas:
- CURRENTS_API_KEY: chave da Currents API (currentsapi.services)
- GEMINI_API_KEY: chave do Google AI Studio (aistudio.google.com)
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import google.generativeai as genai
import requests
from slugify import slugify

# ============================================================================
# Configuração
# ============================================================================

REPO_ROOT = Path(__file__).resolve().parent.parent

# Keywords que descrevem seu perfil profissional.
# Ajuste conforme sua evolução ou interesse.
KEYWORDS = [
    "python backend",
    "django framework",
    "odoo erp",
    "google cloud platform",
    "rest api",
    "software architecture",
    "mcp protocol",
    "ai agents",
]

CURRENTS_URL = "https://api.currentsapi.services/v1/search"

# Modelo Gemini: Flash-Lite é grátis com 1000 req/dia, suficiente com folga.
GEMINI_MODEL = "gemini-2.5-flash-lite"


# ============================================================================
# Utilitários
# ============================================================================

def load_existing_urls() -> set[str]:
    """Coleta URLs de todos os posts já publicados e drafts, para não repetir."""
    urls: set[str] = set()
    for folder in [
        REPO_ROOT / "src" / "content" / "posts" / "pt",
        REPO_ROOT / "src" / "content" / "posts" / "en",
        REPO_ROOT / "drafts" / "pt",
        REPO_ROOT / "drafts" / "en",
    ]:
        if not folder.exists():
            continue
        for md in folder.glob("*.md"):
            content = md.read_text(encoding="utf-8")
            match = re.search(r"^source:\s*['\"]?(https?://[^\s'\"]+)", content, re.M)
            if match:
                urls.add(match.group(1).strip())
    return urls


def fetch_news(api_key: str) -> list[dict]:
    """Busca notícias recentes agregando várias keywords."""
    all_articles: list[dict] = []
    seen_urls: set[str] = set()

    for kw in KEYWORDS:
        try:
            resp = requests.get(
                CURRENTS_URL,
                params={
                    "keywords": kw,
                    "language": "en",  # busca em inglês (mais fontes), depois traduzimos
                    "apiKey": api_key,
                },
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            print(f"⚠️  Falha ao buscar '{kw}': {e}", file=sys.stderr)
            continue

        for article in data.get("news", []):
            url = article.get("url")
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)
            all_articles.append(article)

    # Ordena por data (mais recente primeiro)
    all_articles.sort(key=lambda a: a.get("published", ""), reverse=True)
    return all_articles


def pick_best_article(articles: list[dict], published_urls: set[str]) -> dict | None:
    """Escolhe o primeiro artigo relevante ainda não publicado."""
    for article in articles:
        if article.get("url") in published_urls:
            continue
        title = (article.get("title") or "").strip()
        description = (article.get("description") or "").strip()
        if len(title) < 10 or len(description) < 20:
            continue
        return article
    return None


def gemini_generate(prompt: str) -> str:
    """Chama o Gemini e retorna o texto gerado."""
    model = genai.GenerativeModel(GEMINI_MODEL)
    response = model.generate_content(prompt)
    return response.text.strip()


def build_prompt(article: dict, lang: str) -> str:
    """Monta o prompt para o Gemini gerar o post."""
    idioma = "português brasileiro" if lang == "pt" else "English"

    contexto_perfil = (
        "Perfil do autor: Engenheiro de Software focado em backend Python, "
        "Django, Odoo 17 Enterprise, GCP e arquitetura modular."
    )

    return f"""Você é um engenheiro de software escrevendo um post curto para seu portfólio.

{contexto_perfil}

Notícia base:
- Título: {article.get('title')}
- Descrição: {article.get('description')}
- Fonte: {article.get('author') or 'desconhecida'}
- URL: {article.get('url')}

Tarefa: escreva um post em {idioma} de 300-450 palavras sobre esta notícia. Requisitos:

1. Comece com um parágrafo de contexto explicando a notícia com suas próprias palavras.
2. Adicione ao menos uma seção "## " com análise técnica ou implicações práticas.
3. Quando fizer sentido, conecte com desenvolvimento backend, Python, Django, Odoo, cloud ou IA.
4. Seja direto, sem enrolação. Evite frases genéricas de abertura tipo "No mundo tecnológico de hoje...".
5. NÃO inclua o título no corpo (será separado). NÃO inclua frontmatter.
6. Retorne APENAS o markdown do corpo do post.

Também gere no final, em uma linha JSON, os seguintes campos (sem markdown, sem cerca):
{{"titulo_post": "...", "descricao_curta": "..."}}

Onde:
- titulo_post: um título original em {idioma} (não copie o original), 8-12 palavras.
- descricao_curta: resumo em 1 frase, até 160 caracteres.

Estrutura da resposta:
CORPO_DO_POST

---METADATA---
{{"titulo_post": "...", "descricao_curta": "..."}}
"""


def parse_gemini_output(text: str) -> tuple[str, str, str]:
    """Extrai (corpo_markdown, titulo, descricao) da resposta do Gemini."""
    if "---METADATA---" in text:
        body, meta_raw = text.split("---METADATA---", 1)
    else:
        # Fallback: tenta achar um JSON na última linha
        lines = text.strip().splitlines()
        body_lines = []
        meta_raw = "{}"
        for i, line in enumerate(lines):
            if line.strip().startswith("{") and line.strip().endswith("}"):
                meta_raw = line.strip()
                body_lines = lines[:i]
                break
        else:
            body_lines = lines
        body = "\n".join(body_lines)

    body = body.strip()

    # Remove eventuais cercas de código ao redor do JSON
    meta_raw = meta_raw.strip().strip("`").replace("json", "", 1).strip()

    try:
        meta = json.loads(meta_raw)
        titulo = meta.get("titulo_post", "").strip()
        descricao = meta.get("descricao_curta", "").strip()
    except json.JSONDecodeError:
        titulo = ""
        descricao = ""

    return body, titulo, descricao


def guess_tags(article: dict) -> list[str]:
    """Extrai tags simples do título + descrição."""
    text = f"{article.get('title', '')} {article.get('description', '')}".lower()
    all_tags = {
        "python": "Python",
        "django": "Django",
        "odoo": "Odoo",
        "gcp": "GCP",
        "google cloud": "GCP",
        "cloud": "Cloud",
        "backend": "Backend",
        "api": "APIs",
        "ai": "AI",
        "artificial intelligence": "AI",
        "mcp": "MCP",
        "llm": "LLMs",
        "postgres": "PostgreSQL",
        "docker": "Docker",
    }
    tags = []
    for needle, label in all_tags.items():
        if needle in text and label not in tags:
            tags.append(label)
    return tags[:5]


def write_draft(
    lang: str,
    title: str,
    description: str,
    body: str,
    source_url: str,
    source_name: str,
    tags: list[str],
) -> Path:
    """Escreve o arquivo markdown do post na pasta drafts/{lang}/."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    slug = slugify(title, max_length=60) or "sem-titulo"
    filename = f"{today}-{slug}.md"
    dest_dir = REPO_ROOT / "drafts" / lang
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / filename

    tags_yaml = "[" + ", ".join(f'"{t}"' for t in tags) + "]"

    # Escapa aspas duplas no título/descrição para o YAML
    safe_title = title.replace('"', '\\"')
    safe_desc = description.replace('"', '\\"')
    safe_source_name = source_name.replace('"', '\\"')

    frontmatter = (
        f"---\n"
        f'title: "{safe_title}"\n'
        f'description: "{safe_desc}"\n'
        f"pubDate: {today}\n"
        f"tags: {tags_yaml}\n"
        f'lang: "{lang}"\n'
        f"source: {source_url}\n"
        f'sourceName: "{safe_source_name}"\n'
        f"---\n\n"
    )

    dest.write_text(frontmatter + body + "\n", encoding="utf-8")
    return dest


# ============================================================================
# Main
# ============================================================================

def main() -> int:
    currents_key = os.environ.get("CURRENTS_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")

    if not currents_key or not gemini_key:
        print("❌ Faltam variáveis: CURRENTS_API_KEY e/ou GEMINI_API_KEY", file=sys.stderr)
        return 1

    genai.configure(api_key=gemini_key)

    print("📡 Buscando notícias...", flush=True)
    articles = fetch_news(currents_key)
    print(f"   → {len(articles)} artigos candidatos", flush=True)

    published_urls = load_existing_urls()
    print(f"   → {len(published_urls)} URLs já publicadas/em draft", flush=True)

    article = pick_best_article(articles, published_urls)
    if not article:
        print("ℹ️  Nenhum artigo novo relevante hoje. Nada a fazer.", flush=True)
        return 0

    print(f"✅ Notícia escolhida: {article.get('title')}", flush=True)

    tags = guess_tags(article)
    source_url = article.get("url", "")
    source_name = article.get("author") or "Currents API"

    for lang in ("pt", "en"):
        print(f"🤖 Gerando post em {lang.upper()}...", flush=True)
        prompt = build_prompt(article, lang)
        try:
            raw = gemini_generate(prompt)
        except Exception as e:
            print(f"❌ Falha no Gemini ({lang}): {e}", file=sys.stderr)
            return 1

        body, title, description = parse_gemini_output(raw)

        if not title:
            title = article.get("title", "Sem título")
        if not description:
            description = article.get("description", "")[:160]

        dest = write_draft(
            lang=lang,
            title=title,
            description=description,
            body=body,
            source_url=source_url,
            source_name=source_name,
            tags=tags,
        )
        print(f"   → salvo em {dest.relative_to(REPO_ROOT)}", flush=True)

    print("✨ Concluído. Revise os arquivos em drafts/ e mova para src/content/posts/ quando aprovar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

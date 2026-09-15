import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'pt' | 'en';
export type Post = CollectionEntry<'posts'>;

export async function getPosts(lang: Lang): Promise<Post[]> {
  return (await getCollection('posts', ({ data }) => data.lang === lang)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export function postSlug(post: Post): string {
  return post.id.replace(`${post.data.lang}/`, '');
}

export function postHref(post: Post): string {
  return `/${post.data.lang}/blog/${postSlug(post)}/`;
}

export function readingMinutes(post: Post): number {
  const words = post.body ? post.body.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export function readingLabel(post: Post): string {
  const minutes = readingMinutes(post);
  return post.data.lang === 'pt' ? `${minutes} min de leitura` : `${minutes} min read`;
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Seed estável entre PT e EN: a capa manual (compartilhada) ou a fonte.
export function postSeed(post: Post): string {
  return post.data.image ?? post.data.source ?? post.id;
}

// Posts do mesmo idioma ordenados por tags em comum (depois por data).
export function relatedPosts(post: Post, posts: Post[], limit = 2): Post[] {
  const tags = new Set(post.data.tags);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: p.data.tags.filter((t) => tags.has(t)).length }))
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ p }) => p);
}

// Capa em PNG ao lado do SVG: o site mostra o SVG, mas og:image e o botão de
// baixar precisam de raster (LinkedIn não renderiza SVG no preview).
export function coverPng(post: Post): string | undefined {
  const image = post.data.image;
  return image?.endsWith('.svg') ? image.replace(/\.svg$/, '.png') : image;
}

// "REST APIs" e "Model Context Protocol" viram #RESTAPIs e #ModelContextProtocol.
export function hashtags(post: Post): string {
  return post.data.tags
    .map((tag) => `#${tag.replace(/[^\p{L}\p{N}]/gu, '')}`)
    .filter((tag) => tag.length > 1)
    .join(' ');
}

// Texto pronto pro LinkedIn: o gancho do frontmatter (ou título + descrição,
// quando o post não traz um), o link e as hashtags das tags.
export function linkedinPost(post: Post, url: string): string {
  const fallback =
    post.data.lang === 'pt'
      ? `${post.data.title}\n\n${post.data.description}\n\nEscrevi sobre isso no blog:`
      : `${post.data.title}\n\n${post.data.description}\n\nI wrote about it on my blog:`;

  return [post.data.linkedin?.trim() || fallback, url, hashtags(post)]
    .filter(Boolean)
    .join('\n\n');
}

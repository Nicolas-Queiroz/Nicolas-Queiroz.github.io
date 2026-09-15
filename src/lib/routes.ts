import type { Lang } from './posts';

// O currículo tem slug próprio em cada idioma.
export function resumeHref(lang: Lang): string {
  return lang === 'pt' ? '/pt/sobre' : '/en/about';
}

// Caminho equivalente no outro idioma, para o botão PT/EN do cabeçalho.
export function otherLangHref(lang: Lang, path: string): string {
  const other: Lang = lang === 'pt' ? 'en' : 'pt';
  if (path.startsWith(`/${lang}/blog`)) return `/${other}/blog`;
  if (path === resumeHref(lang)) return resumeHref(other);
  return `/${other}`;
}

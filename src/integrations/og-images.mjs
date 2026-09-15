// Gera o PNG de cada capa SVG, porque LinkedIn, WhatsApp e X não renderizam
// SVG no preview de link. O site continua usando o SVG (inlinado, animado,
// herdando o tema); o PNG só alimenta og:image e o botão de baixar a imagem.
//
// Os PNGs são escritos ao lado dos SVGs em public/ (e ignorados pelo git), o
// que faz `astro dev` e `astro build` servirem os dois do mesmo jeito.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
// Renderiza acima do tamanho final e reduz: texto e curvas saem sem serrilhado.
const DENSITY = 150;

async function mtime(file) {
  try {
    return (await fs.stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

export default function ogImages({ dir = 'posts-images' } = {}) {
  return {
    name: 'og-images',
    hooks: {
      'astro:config:setup': async ({ logger }) => {
        const folder = path.join(process.cwd(), 'public', dir);
        let files;
        try {
          files = (await fs.readdir(folder)).filter((f) => f.endsWith('.svg'));
        } catch {
          return;
        }

        let written = 0;
        for (const file of files) {
          const svg = path.join(folder, file);
          const png = svg.replace(/\.svg$/, '.png');
          if ((await mtime(png)) >= (await mtime(svg))) continue;

          await sharp(await fs.readFile(svg), { density: DENSITY })
            .resize(WIDTH, HEIGHT, { fit: 'cover' })
            .png({ compressionLevel: 9 })
            .toFile(png);
          written += 1;
        }

        if (written > 0) logger.info(`${written} capa(s) convertida(s) em PNG para o preview de link`);
      },
    },
  };
}

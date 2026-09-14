---
title: "Bloquear bot de treinamento por padrão é admitir que ninguém lia os termos de uso"
description: "A partir de 15 de setembro de 2026, novos domínios na Cloudflare bloqueiam por padrão crawlers de IA de treinamento em páginas com anúncios, mas liberam bots de busca."
pubDate: 2026-09-13
tags: ["Cloud", "AI", "Backend"]
lang: "pt"
image: "/posts-images/2026-09-13-cloudflare-bloqueia-bots-ia.svg"
---

Achei sintomático que a solução pra "seu conteúdo está sendo usado sem permissão pra treinar modelo" tenha virado, na prática, uma configuração de infraestrutura em vez de uma questão contratual. A partir de 15 de setembro de 2026, todo domínio novo criado na Cloudflare vai bloquear automaticamente crawlers de "Agente" e "Treinamento" de IA em páginas com anúncio, enquanto continua liberando bots de busca. Dá pro dono do site um controle bem mais granular sobre quem pode raspar o conteúdo, mas o fato de isso precisar existir como default de CDN diz muito sobre como esse assunto nunca foi resolvido em nenhum outro nível.

## Isso é decisão de arquitetura, não só de política

Trabalho com Google Cloud Platform no dia a dia e uma coisa que aprendi construindo o módulo independente de logs GCP que uso na empresa é que separar "quem pode ler" de "quem pode processar" quase sempre vale a pena resolver na camada de infraestrutura, não na aplicação. É mais fácil de auditar, mais difícil de esquecer de aplicar em um endpoint novo, e não depende de cada time lembrar de configurar certo. A Cloudflare distinguindo bot de busca de bot de treinamento na borda da rede é exatamente esse princípio: a decisão de acesso acontece antes mesmo do request chegar em qualquer coisa que eu escrevi.

O detalhe irônico é que esse blog que você está lendo agora tem posts rascunhados com ajuda de um agente de IA que eu mesmo desenvolvi. Ao mesmo tempo, se eu hospedasse ele atrás de uma configuração como essa, estaria bloqueando o mesmo tipo de bot que ajudou a escrever o texto. Não acho isso contraditório, na real: uma coisa é eu escolher usar IA como ferramenta no meu processo, outra bem diferente é alguém raspar meu conteúdo sem eu ter escolhido nada. A diferença toda é quem decide.

Queria saber que fração dos sites que vão nascer com esse bloqueio ligado por padrão vai realmente saber que a opção existe, versus quantos vão só herdar a configuração sem entender o que significa. Suspeito que vai ser a maioria no segundo grupo, e isso talvez seja o resultado mais importante disso tudo: a decisão que mais afeta quem treina o próximo modelo pode acabar sendo tomada por um valor padrão, não por escolha consciente de ninguém.

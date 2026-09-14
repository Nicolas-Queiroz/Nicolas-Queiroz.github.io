---
title: "Fermat verificado por máquina: o que isso me lembra do meu próprio código"
description: "A Anthropic diz que o Claude traduziu uma prova do Último Teorema de Fermat pra Lean e teve o resultado verificado por computador em 11 dias."
pubDate: 2026-09-13
tags: ["AI", "LLMs", "MCP"]
lang: "pt"
---

Fico pensando no seguinte: se uma IA leva 11 dias pra traduzir uma prova inteira do Último Teorema de Fermat pra Lean e sair do outro lado com um resultado verificado por computador, o que muda de verdade não é só "a IA sabe matemática". É a régua do que a gente chama de verificado.

A Anthropic afirma que o Claude pegou uma prova já existente do teorema e reescreveu em Lean, uma linguagem formal onde cada passo lógico precisa fechar pra o compilador aceitar. Não tem meio-termo: ou a prova é logicamente sólida do início ao fim, ou o verificador rejeita. É bem diferente do jeito que a maioria do código de produção é validado.

## Prova formal é teste automatizado levado ao extremo

No meu trabalho, uma das coisas que mais repito é que fluxo bom é fluxo configurável, documentado e coberto por teste automatizado. Mas teste de software, no fundo, é uma amostragem: eu escrevo casos pros cenários que consigo imaginar, rodo, e confio que cobri o suficiente. Sempre sobra a pergunta incômoda de "e o caso que eu não pensei?".

Prova formal em Lean não tem esse buraco. Ou o argumento é válido pra qualquer entrada possível, seguindo as regras da lógica, ou não é. É a diferença entre "testei e não quebrou" e "é matematicamente impossível quebrar". Pra um teorema centenário isso é natural. Pra sistema de produção, é praticamente inviável: a maior parte do software não tem especificação formal nem precisa ter.

Mas o gancho que fica é outro: se uma IA consegue automatizar 11 dias de tradução formal que, feita por humano, levaria muito mais tempo e expertise específica, isso baixa o custo de aplicar rigor formal em pedaços menores e mais críticos de sistemas reais. Não o sistema inteiro, mas talvez a parte que calcula desconto, ou a que decide se um lote de dados pode ser processado. Áreas onde "eu acho que testei o suficiente" não é uma resposta satisfatória.

Não sei se um dia vou rodar alguma variante disso pra provar que meu módulo de fidelidade não deixa passar desconto duplicado, mas confesso que a ideia ficou martelando. Alguém já tentou aplicar verificação formal em regra de negócio de verdade, fora de academia, e sobreviveu pra contar como foi?

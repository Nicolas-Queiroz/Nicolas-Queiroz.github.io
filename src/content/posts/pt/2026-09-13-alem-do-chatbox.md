---
title: "Chat é só a interface mais preguiçosa pra um agente de IA"
description: "Framework 'Beyond the Chatbox' defende telas específicas e raciocínio visível no lugar de chat genérico, prevendo que 40% dos apps corporativos terão agentes até 2026."
pubDate: 2026-09-13
tags: ["AI", "MCP", "APIs"]
lang: "pt"
image: "/posts-images/2026-09-13-alem-do-chatbox.svg"
---

Uma agência de design lançou um framework chamado "Beyond the Chatbox" defendendo algo que, pra mim, devia ser óbvio há tempo: se um agente de IA vai tomar uma ação real no seu sistema, uma caixinha de texto genérica é quase sempre a pior interface possível pra isso. A proposta é mostrar o raciocínio do agente de forma visível, com checkpoints de aprovação humana e telas específicas (formulário aqui, tabela ali) em vez de devolver tudo como resposta corrida de chat. A previsão citada é que até o fim de 2026 cerca de 40% dos aplicativos corporativos vão ter agentes de IA pra tarefas específicas, contra menos de 5% em 2025.

## Isso é literalmente o que eu já faço com meu agente MCP

Tenho um agente baseado em Model Context Protocol que uso pro meu contexto de trabalho, com skill própria de revisão de código fundamentada em artigos que li sobre code review e IA. Eu documento tudo em grafo no Obsidian, onde cada nó é um módulo, submódulo ou característica do sistema que ele entende. Se eu tivesse desenhado esse agente pra só responder em texto corrido de chat, ele seria bem menos útil do que é.

O que faz esse tipo de agente funcionar de verdade não é a resposta em si, é a estrutura em volta dela: eu sei em qual módulo ele está olhando, consigo rastrear de onde veio um apontamento de revisão e, mais importante, tenho um ponto claro de aprovação antes de qualquer coisa virar ação real no código. Isso é essencialmente o "checkpoint de aprovação humana" que o framework descreve, só que eu cheguei lá por necessidade prática, não por ler um manifesto de design.

Acho que o motivo desse tipo de interface ainda ser raridade é que chat genérico é muito mais barato de implementar do que UI específica por tarefa. Dá pra jogar qualquer coisa numa caixa de texto e chamar de "produto com IA". Construir uma tela de aprovação decente, com o raciocínio do agente exposto de um jeito que faça sentido pra quem vai revisar, dá trabalho de verdade: é praticamente um produto à parte.

Se a projeção de 40% até o fim de 2026 se confirmar, acho que a pergunta que vai sobrar não é "os agentes vão aparecer nos apps corporativos", isso já é dado como certo. É quantos desses agentes vão ter uma interface pensada de verdade pra mostrar o que estão fazendo, e quantos vão ser só mais uma caixinha de chat colada como enfeite.

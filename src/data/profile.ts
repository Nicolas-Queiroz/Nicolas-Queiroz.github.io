// Único arquivo com seus dados pessoais.
// Edite aqui para atualizar o site inteiro.

export const profile = {
  name: 'Nícolas Roberto de Queiroz',
  title: {
    pt: 'Engenheiro de Software',
    en: 'Software Engineer',
  },
  location: 'Brasília, Distrito Federal, Brasil',
  email: 'nicolas.roberto777@gmail.com',
  phone: '(61) 98618-0872',
  github: 'https://github.com/Nicolas-Queiroz',
  linkedin: 'https://www.linkedin.com/in/nicolas-roberto-50b243201/',
  bio: {
    pt: 'Engenheiro de Software com 3+ anos de experiência em desenvolvimento backend, especializado em Python, Django, Odoo e Google Cloud Platform. Atualmente desenvolvo módulos customizados em Odoo 17 Enterprise para gestão de RH em rede com mais de 90 lojas, atuando como único desenvolvedor responsável por projetos completos.',
    en: 'Software Engineer with 3+ years of backend development experience, specialized in Python, Django, Odoo, and Google Cloud Platform. Currently developing custom modules in Odoo 17 Enterprise for HR management across a 90+ store retail chain, acting as the sole developer responsible for end-to-end projects.',
  },
  skills: {
    languages: ['Python', 'TypeScript'],
    frameworks: ['Django', 'Odoo 17 Enterprise', 'Angular'],
    databases: ['PostgreSQL'],
    cloud: ['Google Cloud Platform', 'Docker'],
    integration: ['REST APIs'],
    tools: ['Git', 'Obsidian', 'Model Context Protocol', 'Cordova'],
  },
  experience: [
    {
      role: { pt: 'Desenvolvedor de Software', en: 'Software Developer' },
      company: 'Coco Bambu Restaurante',
      period: '2024 – Atual',
      bullets: {
        pt: [
          'Desenvolvimento de módulos customizados em Odoo 17 Enterprise para gestão de RH em rede com mais de 90 lojas.',
          'Único desenvolvedor responsável por projetos completos, incluindo serviço de programa de fidelidade com recursos expostos para consumo por outras plataformas.',
          'Arquitetura de módulos desacoplados e reutilizáveis (ex.: módulo independente de logs GCP, plugável a módulos selecionados).',
          'Integração com Google Cloud Platform para logs, escalabilidade e processamento de dados.',
          'Fluxos configuráveis, documentados e cobertos por testes automatizados.',
          'Criação de APIs RESTful para integração entre sistemas internos e externos.',
        ],
        en: [
          'Development of custom Odoo 17 Enterprise modules for HR management across a 90+ store retail chain.',
          'Sole developer responsible for end-to-end projects, including a loyalty program service with resources exposed to other platforms.',
          'Architecture of decoupled and reusable modules (e.g., independent GCP logs module, pluggable into selected modules).',
          'Integration with Google Cloud Platform for logs, scalability, and data processing.',
          'Configurable workflows, documented and covered by automated tests.',
          'Development of RESTful APIs for internal and external system integration.',
        ],
      },
    },
    {
      role: { pt: 'Estagiário em Desenvolvimento de Software', en: 'Software Development Intern' },
      company: 'Coco Bambu Restaurante',
      period: '2022 – 2024',
      bullets: {
        pt: [
          'Desenvolvimento e manutenção de sistemas em Python, Django e Odoo.',
          'Desenvolvimento web e mobile em Angular para aplicativo de delivery nacional, com empacotamento mobile via Cordova (gerando o APK).',
          'Implementação de melhorias em processos internos para otimização operacional.',
          'Colaboração com equipes para integrar novas funcionalidades.',
        ],
        en: [
          'Development and maintenance of systems in Python, Django, and Odoo.',
          'Web and mobile development in Angular for a national delivery app, with mobile packaging via Cordova (building the APK).',
          'Implementation of improvements to internal processes for operational optimization.',
          'Collaboration with teams to integrate new features.',
        ],
      },
    },
  ],
  projects: [
    {
      name: 'Agente MCP para Revisão de Código',
      description: {
        pt: 'Agente baseado em Model Context Protocol especializado no meu contexto de trabalho. Executa revisões de código com skill própria, fundamentada em artigos sobre code review e IA. Documentação em grafo no Obsidian, onde cada nó representa um módulo, submódulo ou característica.',
        en: 'Model Context Protocol agent specialized in my work context. Performs code reviews with a custom skill based on articles about code review and AI. Graph-based documentation in Obsidian, where each node represents a module, submodule, or feature.',
      },
      tags: ['MCP', 'AI', 'Python', 'Obsidian'],
    },
  ],
  education: {
    course: { pt: 'Engenharia de Software', en: 'Software Engineering' },
    school: { pt: 'Universidade de Brasília (UnB)', en: 'University of Brasília (UnB)' },
    period: '2020 – 2026',
  },
  languages: {
    pt: [
      { name: 'Português', level: 'Nativo' },
      { name: 'Inglês', level: 'Intermediário (Leitura); Básico (Conversação)' },
    ],
    en: [
      { name: 'Portuguese', level: 'Native' },
      { name: 'English', level: 'Intermediate (Reading); Basic (Conversation)' },
    ],
  },
};

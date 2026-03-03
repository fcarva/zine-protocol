export interface TeachingTrack {
  id: string;
  title: string;
  format: string;
  duration: string;
  audience: string;
  objective: string;
  outcomes: string[];
  steps: string[];
  materials: string[];
}

export interface ResourceItem {
  title: string;
  type: string;
  summary: string;
  href: string;
}

export interface ResourceSection {
  id: string;
  title: string;
  description: string;
  items: ResourceItem[];
}

export interface EditorialEvent {
  id: string;
  isoDate: string;
  title: string;
  kind: "oficina" | "leitura" | "chamada" | "publicacao";
  location: string;
  summary: string;
}

export const teachingTracks: TeachingTrack[] = [
  {
    id: "oficina-fotocopia",
    title: "Oficina de fotocopia afetiva",
    format: "Aula oficina presencial",
    duration: "2h30",
    audience: "Ensino medio, coletivos territoriais, laboratorios de arte",
    objective: "Transformar memoria de bairro em zine de circulacao rapida.",
    outcomes: [
      "1 zine coletivo por turma.",
      "Mapa de referencias locais para futuras edicoes.",
      "Registro fotografico da oficina.",
    ],
    steps: [
      "Roda de abertura com referencias de zine e jornal de bairro.",
      "Coleta de relatos curtos, manchetes e imagens de arquivo pessoal.",
      "Montagem de paginas com colagem e fotocopia em preto e branco.",
      "Fechamento editorial com leitura publica e distribuicao em rede local.",
    ],
    materials: ["papel A4/A3", "canetas", "tesoura", "cola", "fotocopiadora", "fita crepe"],
  },
  {
    id: "leitura-critica",
    title: "Leitura critica de zines e revista independente",
    format: "Seminario guiado",
    duration: "1h40",
    audience: "Cursos de comunicacao, design, letras e artes visuais",
    objective: "Desenvolver criterio curatorial para leitura de publicacao independente.",
    outcomes: [
      "Fichas de analise por edicao.",
      "Debate sobre autoria, forma e contexto politico.",
      "Proposta de serie editorial para a turma.",
    ],
    steps: [
      "Selecao de 3 zines do catalogo com linguagens distintas.",
      "Leitura em grupos com protocolo de analise rapida.",
      "Comparacao entre grid, materialidade, ritmo e voz editorial.",
      "Sintese coletiva com criterios para futuras curadorias.",
    ],
    materials: ["projetor", "caderno de anotacoes", "zines impressos ou digitais"],
  },
  {
    id: "publicacao-coletiva",
    title: "Publicacao coletiva em 7 dias",
    format: "Laboratorio intensivo",
    duration: "4 encontros de 2h",
    audience: "Coletivos, bibliotecas comunitarias e produtoras culturais",
    objective: "Sair de ideia para edicao publicada no repositorio em uma semana.",
    outcomes: [
      "1 zine publicado com metadata completa.",
      "Pipeline de curadoria replicavel.",
      "Plano de apoio com wallet, email e pix sandbox.",
    ],
    steps: [
      "Dia 1: pauta, escopo e distribuicao de funcoes editoriais.",
      "Dia 2: producao visual e revisao de texto em pares.",
      "Dia 3: fechamento tecnico de imagem, pagina e frontmatter.",
      "Dia 4: publicacao por PR e ativacao do apoio no checkout.",
    ],
    materials: ["editor de texto", "editor de imagem", "template frontmatter", "repositorio Git"],
  },
];

export const resourceSections: ResourceSection[] = [
  {
    id: "bibliografia",
    title: "Bibliografia e referencia editorial",
    description: "Leituras para ampliar repertorio de zine, curadoria e publicacao independente.",
    items: [
      {
        title: "Barnard Zine Library - Zine Basics",
        type: "Guia",
        summary: "Introducao a historia, generos e metodos de producao de zine.",
        href: "https://zines.barnard.edu/zine-basics",
      },
      {
        title: "Barnard - Lesson Plans",
        type: "Plano de aula",
        summary: "Modelos educacionais para aplicar zines em sala e oficinas.",
        href: "https://zines.barnard.edu/lesson-plans",
      },
      {
        title: "The Drift Magazine",
        type: "Referencia editorial",
        summary: "Ritmo de secao e estrutura de revista de ideias para adaptacao no lab.",
        href: "https://www.thedriftmag.com/",
      },
    ],
  },
  {
    id: "zineotecas",
    title: "Zineotecas e redes de acervo",
    description: "Mapa de colecoes e redes para pesquisa, parceria e circulacao.",
    items: [
      {
        title: "Barnard Zines Online Links",
        type: "Diretorio",
        summary: "Indice de acervos e bibliotecas com foco em zines.",
        href: "https://zines.barnard.edu/barnard-zines-online-links",
      },
      {
        title: "Barnard - Zine Sites",
        type: "Diretorio",
        summary: "Links para arquivos, coletivos e plataformas independentes.",
        href: "https://zines.barnard.edu/zine-sites",
      },
      {
        title: "Barnard - Zineography",
        type: "Pesquisa",
        summary: "Levantamento de materiais e referencias para estudo aprofundado.",
        href: "https://zines.barnard.edu/zineography",
      },
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas de producao e publicacao",
    description: "Stack minimo para fechar uma edicao do rascunho ao upload.",
    items: [
      {
        title: "Template de frontmatter do Zine Protocol",
        type: "Template",
        summary: "Campos obrigatorios para publicar no arquivo com validação estrita.",
        href: "/curadoria",
      },
      {
        title: "Fluxo de apoio (wallet/email/pix)",
        type: "Guia de produto",
        summary: "Explica como configurar e acionar apoio sem jargao tecnico.",
        href: "/como-apoiar",
      },
      {
        title: "Playbook de sprint editorial",
        type: "Documento",
        summary: "Plano de blocos para manter ritmo de publicacao semanal.",
        href: "/eventos",
      },
    ],
  },
];

export const editorialEvents: EditorialEvent[] = [
  {
    id: "2026-03-10-zine-semana",
    isoDate: "2026-03-10T19:00:00-03:00",
    title: "Arquivo vivo - zine da semana",
    kind: "publicacao",
    location: "Online / Home do Zine Protocol",
    summary: "Publicacao de edicao comentada com foco em memoria urbana.",
  },
  {
    id: "2026-03-13-oficina-fotocopia",
    isoDate: "2026-03-13T14:00:00-03:00",
    title: "Oficina aberta de fotocopia afetiva",
    kind: "oficina",
    location: "Faisca Lab - Sao Paulo",
    summary: "Laboratorio pratico para criar mini-zines em tiragem curta.",
  },
  {
    id: "2026-03-18-club-leitura",
    isoDate: "2026-03-18T20:00:00-03:00",
    title: "Leitura guiada: cidade, mapa e territorio",
    kind: "leitura",
    location: "Online / sala aberta",
    summary: "Sessao comentada com 3 zines do catalogo e debate de linguagem.",
  },
  {
    id: "2026-03-22-chamada-comunidade",
    isoDate: "2026-03-22T10:00:00-03:00",
    title: "Chamada de publicacao por convite",
    kind: "chamada",
    location: "Formulario de curadoria",
    summary: "Janela de candidatura para nova rodada editorial do laboratorio.",
  },
  {
    id: "2026-03-27-boletim-mensal",
    isoDate: "2026-03-27T18:00:00-03:00",
    title: "Boletim mensal do laboratorio",
    kind: "publicacao",
    location: "Manifesto + indice curatorial",
    summary: "Resumo de apoios, novos zines e pautas para abril de 2026.",
  },
];

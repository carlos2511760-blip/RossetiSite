# RossetiSite — Design System Catalog

Design System extraído e estruturado a partir do site **sa.design** (showcase do projeto *Litecom*), preservando rigorosamente a identidade visual, cinemática de animações, tipografia original e tokens de design.

---

## 📌 Visão Geral do Catálogo

O catálogo é uma aplicação de navegação dividida em duas visões principais:

1. **Overview (`#overview`):**
   - Adaptação funcional da página copiada com os textos editoriais originais substituídos por cópias de amostra (mantendo hierarquia, tags e extensões).
   - Navbar interna duplicada suprimida para integração fluida.
   - Preservação integral das animações em WebGL/Three.js, rolagem suave (*Luxy.js*), efeitos de perspectiva (*hover-effect*), transições de cor e cinemática de tipografia vazada.

2. **Components (`#components`):**
   - Catálogo vivo e estruturado com barra lateral fixa (*sticky*) e *scroll spy*.
   - Fundações de design (*Typography*, *Colors*, *Backgrounds*, *Surfaces*, *Icons*).
   - Componentes completos com metadados de código, seletores CSS reais, classes e estados ativos.

---

## 🚀 Como Executar Localmente

Devido ao uso de módulos dinâmicos empacotados, buffers e carregamento de fontes personalizadas, a execução requer um servidor HTTP local:

### Opção 1: Via Python (Recomendado)
Execute no terminal na raiz do repositório:

```powershell
python -m http.server 8080
```

Abra o navegador em:
- **Catálogo Completo:** [http://localhost:8080/design-system.html](http://localhost:8080/design-system.html)
- **Visualização Overview:** [http://localhost:8080/design-system.html#overview](http://localhost:8080/design-system.html#overview)
- **Catálogo de Componentes:** [http://localhost:8080/design-system.html#components](http://localhost:8080/design-system.html#components)

---

## 📁 Estrutura de Arquivos

```text
RossetiSite/
├── design-system.html              # Catálogo principal (Navbar integrada, Overview & Components)
├── index.html                      # Ponto de entrada padrão com redirecionamento automático
├── README.md                       # Documentação do projeto e catálogo
└── assets/
    └── overview/
        ├── index.html              # Projeto base Overview (com textos adaptados e navbar suprimida)
        └── assets/                 # Mídias, fontes e estilos originais
            ├── cdn.prod.website-files.com/
            │   └── 5f46be79ccba856d1a52df5a/
            │       ├── css/sa-design.shared.f2af7490e.css     # Estilização base do site
            │       ├── 5f46be79ccba85789852df65_Aguila-Medium.otf # Fonte primária Display
            │       └── ... (ícones SVG e avif)
            ├── use.typekit.net/    # Scripts Typekit / Neue Haas Grotesk
            └── cdnjs.cloudflare.com/ # Three.js, GSAP TweenMax, Luxy.js
```

---

## 🎨 Fundações de Design Extraídas

### 1. Tipografia
| Papel | Família & Peso | Seletor CSS | Tamanho Declarado |
| :--- | :--- | :--- | :--- |
| **Heading 1 (Hero)** | `Aguila`, Medium (500) | `.heading.hero` | `14vw \| 10vw` |
| **Display Kinetic** | `Aguila`, Medium (500) | `.sliding-text` | `14vw \| 18vw` |
| **Heading 2 (Subhead)** | `Neue Haas Grotesk`, Light (200) | `.descroption-text` | `38px \| 20px \| 18px` |
| **Heading 3 (Eyebrow)** | `Neue Haas Grotesk`, Medium (500) | `.heading-3` | `18px \| 14px` |
| **Button / Action** | `Neue Haas Grotesk`, Medium (500) | `.link` | `20px \| 18px` |
| **Meta / Breadcrumb** | `Neue Haas Grotesk`, Regular (400) | `.btnback` | `14px` |
| **Text 2 (Metadata)** | `Neue Haas Grotesk`, Medium (500) | `.team-text2` | `14px` |

### 2. Paleta de Cores & Tokens Funcionais
- **Brand & Accent:**
  - `Primary Brand Red`: `#e90f15` (Token: `--footer-color-var`) — Fundo do hero e indicador de abas ativas.
  - `Accent Tomato`: `#ff3644` (Token: `--tomato`) — Destaques e contrastes.
  - `Transition Blue`: `#0030a8` (Token: `--blue`) — Cor base de transições e overlays.
- **Surfaces:**
  - `Deep Void Black`: `#0b0b0b` / `#1c1c1c` (Tokens: `--black-2`, `--black`) — Fundo principal do viewport escuro.
  - `Paper White`: `#ffffff` (Token: `--white`) — Fundo do rodapé e áreas com inversão de contraste.
- **Text & Icons:**
  - `Primary White`: `#ffffff` — Textos e ícones sobre fundo escuro.
  - `Primary Dark`: `#1c1c1c` — Títulos e rótulos sobre fundo claro.
  - `Muted Grey`: `#cccbcb` (Token: `--light-grey`) — Metadados e textos secundários.

### 3. Backgrounds do Projeto
- **Landing Hero:** `#e90f15`
- **Main Canvas:** `#0b0b0b`
- **Transition Overlay:** `#0030a8`
- **Footer Inverted Surface:** `#ffffff`

---

## 🧩 Componentes Catalogados

1. **Ações & Gatilhos (`Actions & Triggers`):**
   - `.back-btn` / `.btnback`: Gatilho de retorno com ícone de seta.
   - `.link`: Link de chamada editorial com ativação de cursor customizado.
   - `.hamburger`: Botão de alternância com estados dinâmicos (claro/escuro).
2. **Navegação & Marca (`Navigation & Brand`):**
   - `.logo-container`: Monograma vetorial nativo `#logo_nav` acompanhado da marca textual `sa.design`.
   - `.lang-selector`: Alternador de idiomas (`Eng / Esp / Por`).
3. **Cinemática & Display (`Kinetic & Display`):**
   - `.sliding-text`: Tipografia cinética contornada (*stroke text*) com deslocamento horizontal.
   - `.slider-text-footer`: Letreiro com máscara em duas camadas.
4. **Mídia & Cartões (`Media & Cards`):**
   - `.vertical-pics`: Grade com paralaxe vertical e leve rotação (*skew*).
   - `.mobile-images`: Vitrine de dispositivos em colunas móveis responsivas.
5. **Controles Interativos (`Interactive Controls`):**
   - `.cursor-wrapper`: Seguidor dinâmico de mouse com rótulos contextuais (`Launch`, `Contact`, `View More`).

---

## 🛠️ Tecnologias Utilizadas
- **HTML5 & CSS3 nativo** (com CSS Custom Properties e flexbox/grid)
- **Aguila Font** (`.otf` nativo) & **Typekit Adobe Fonts** (*Neue Haas Grotesk Display*)
- **Luxy.js** (Inertia smooth scrolling)
- **Three.js** & **GSAP (TweenMax)** (Efeitos de distorção de imagem por mapa de deslocamento)

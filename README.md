# PULSO SP — Guia Cultural Aberto de São Paulo

> **"A cidade acontece. Você só precisa encontrá-la."**

O **Pulso SP** é uma plataforma digital criada para reunir e divulgar eventos culturais gratuitos ou acessíveis na cidade de São Paulo. O projeto busca democratizar e facilitar o acesso dos jovens à cultura, centralizando informações que normalmente ficam espalhadas em diferentes redes sociais, sites de instituições e páginas institucionais.

O usuário pode explorar eventos por categoria, preço (com filtro dedicado para eventos **100% gratuitos**) e por região da cidade (Centro, Zona Norte, Zona Sul, Zona Leste e Zona Oeste), encontrando opções de lazer e cultura de maneira ágil, moderna e visualmente impactante.

---

## 🎯 Problema & Propósito
- **O Problema:** São Paulo transborda cultura diariamente, mas os eventos independentes, gratuitos e acessíveis sofrem com a dispersão de dados e falta de um canal unificado e jovem.
- **A Solução:** Um feed visual, dinâmico e colaborativo que agrupa shows, peças teatrais, mostras de cinema, batalhas de rima, exposições e encontros de tecnologia e games com curadoria regionalizada.

---

## ✨ Funcionalidades Principais

1. **Capa & Tipografia Cinética:**
   - Fotografia impactante de festival/show ao vivo.
   - Tipografia display marcante (*Aguila* e *Neue Haas Grotesk*), paleta de alto contraste (*Void Black* e *Pulse Red*).
   - Letreiro dinâmico de manifesto cultural.

2. **Filtro Funcional em Tempo Real (Sem Recarregar a Página):**
   - **Por Categoria:** `[Todos]` • `[🔥 Entrada Gratuita]` • `[Música]` • `[Exposições]` • `[Teatro]` • `[Cinema]` • `[Cultura Urbana]` • `[Tecnologia & Games]`.
   - **Por Região:** `[Todas as Regiões]` • `[Centro]` • `[Zona Oeste]` • `[Zona Sul]` • `[Zona Leste]` • `[Zona Norte]`.
   - **Busca Textual Instantânea:** Busca rápida por nome do artista, evento ou local.

3. **Evento da Semana em Destaque:**
   - Seção ampla ocupando a tela com informações completas do destaque da curadoria (Ex: *Festival Cidade Viva 2026* no Parque Villa-Lobos).

4. **Seção "Perto de Você":**
   - Atalhos visuais para as 5 regiões de São Paulo, permitindo ao usuário filtrar com um clique o que está acontecendo no seu entorno geográfico.

5. **Envie um Evento (Colaborativo com `localStorage`):**
   - Formulário completo para produtores e frequentadores cadastrarem novos eventos.
   - Salva os dados no navegador e adiciona o novo evento imediatamente ao topo do feed com notificação visual (*Toast Alert*).

6. **Catálogo de Design System Integrado:**
   - Mantém o link direto para `design-system.html`, permitindo a desenvolvedores e designers inspecionar todas as fundações, tokens e componentes do projeto.

---

## 🚀 Como Executar Localmente

Abra o terminal na pasta do projeto e inicie um servidor local:

```powershell
python -m http.server 8080
```

Acesse no navegador:
- 🌐 **Plataforma Pulso SP:** [http://localhost:8080/](http://localhost:8080/)
- 📐 **Design System:** [http://localhost:8080/design-system.html](http://localhost:8080/design-system.html)

---

## 📁 Estrutura do Repositório

```text
RossetiSite/
├── index.html                      # Aplicação web completa do Pulso SP
├── design-system.html              # Catálogo do Design System
├── README.md                       # Apresentação e documentação do projeto
├── .nojekyll                       # Desativa processamento Jekyll no GitHub Pages
└── assets/                         # Mídias, estilos, ícones e fontes originais
```

---

## 🛠️ Tecnologias
- **HTML5 & CSS3 nativo** (variáveis CSS, layouts Flexbox e Grid responsivo)
- **JavaScript Moderno (ES6+)** para filtragem dinâmica, busca em tempo real e persistência com `localStorage`
- **Fontes Display:** *Aguila Medium* e *Neue Haas Grotesk*
- **Fotografia Cultural:** Curadoria de alta resolução temática de São Paulo

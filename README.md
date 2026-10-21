# Pulso SP

> **A cidade acontece. Você só precisa encontrá-la.**

O Pulso SP é uma plataforma visual para descobrir shows, exposições, festivais, apresentações e eventos gratuitos ou acessíveis na cidade de São Paulo.

## Funcionalidades

- Agenda visual com informações de data, horário, local, preço, classificação e categoria.
- Filtros por gratuidade, música, arte e tecnologia.
- Navegação pelas regiões Centro, Norte, Sul, Leste e Oeste.
- Categorias de música, cinema, teatro, exposições, cultura urbana, tecnologia e games.
- Formulário de envio que salva novos eventos no `localStorage` do navegador.
- Interface responsiva e acessível, com suporte a movimento reduzido.

Os eventos incluídos na página são dados de demonstração do protótipo.

## Executar localmente

Na raiz do repositório, execute:

```bash
python3 -m http.server 8080
```

Abra [http://localhost:8080](http://localhost:8080). Não há dependências ou etapa de build.

## Estrutura principal

```text
├── index.html          # Redirecionamento para a aplicação
├── design-system.html  # Conteúdo e estrutura do Pulso SP
├── styles.css          # Identidade visual e responsividade
├── app.js              # Filtros, menu e armazenamento local
└── assets/             # Fontes, imagens e recursos visuais locais
```

O deploy para GitHub Pages é executado automaticamente pelo workflow em `.github/workflows/deploy.yml` após alterações na branch `main`.

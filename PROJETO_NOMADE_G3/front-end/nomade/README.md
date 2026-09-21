# Nômade — Sistema de Gestão de Estoque (front-end)

Projeto front-end estático, construído com **Bootstrap 5**, baseado nos
wireframes enviados (login, cadastro/entrada/saída de produto, painel de
controle, inventário, usuários, gráficos de desempenho e configurações).

## Como abrir

Não há build nem dependências de instalação. Basta abrir `index.html`
diretamente no navegador (duplo clique) ou servir a pasta com qualquer
servidor estático:

```bash
# opção simples com Python
python3 -m http.server 5500
# depois acesse http://localhost:5500
```

O login é apenas ilustrativo: qualquer envio do formulário leva ao painel.

## Estrutura

```
nomade/
├── index.html            → Tela de login
├── dashboard.html         → Painel de controle (métricas, gráficos, alertas)
├── estoque.html            → Gestão de estoque (tabela global, filtros)
├── produtos.html            → Catálogo + cadastro de novo produto/SKU
├── movimentacao.html         → Entrada / Saída / Retirada de mercadoria
├── usuarios.html               → Gestão de equipe e permissões
├── relatorios.html              → Gráficos de desempenho de vendas por ano
├── configuracoes.html            → Perfil, sistema e segurança
├── assets/
│   ├── css/style.css              → Tokens de design e componentes
│   └── js/
│       ├── layout.js               → Monta sidebar + topbar em cada página
│       └── app.js                   → Toasts, steppers, filtros, gráficos CSS
└── README.md
```

## Como o layout é montado

Cada página interna tem um `<div id="app-shell">` vazio (exceto pelo
`<div class="content">` com o conteúdo da página). O script
`assets/js/layout.js` injeta a barra lateral e a barra superior no
carregamento, a partir de uma única lista de navegação
(`NOMADE_NAV`), então para adicionar ou renomear um item de menu basta
editar esse array uma vez.

## Personalização rápida

- **Cores e tipografia**: tudo fica em variáveis CSS no topo de
  `assets/css/style.css` (`:root { --accent: ...; --bg: ...; }`).
- **Itens de menu**: array `NOMADE_NAV` em `assets/js/layout.js`.
- **Ícones**: objeto `NOMADE_ICONS` em `assets/js/layout.js` (SVGs inline,
  sem dependência de ícone externo).
- **Dados de exemplo** (tabelas, gráficos, alertas): estão direto no HTML
  de cada página ou em pequenos arrays dentro do `<script>` no final do
  arquivo — fáceis de trocar por dados reais de uma API.

## Bibliotecas usadas (via CDN)

- [Bootstrap 5.3](https://getbootstrap.com/) — grid, modais, componentes base
- [Google Fonts](https://fonts.google.com/) — Space Grotesk (títulos) + Inter (texto)

Nenhuma outra dependência é necessária.

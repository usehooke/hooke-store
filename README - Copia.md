# 🛍️ Hooke Store - Loja Online

Loja online moderna de moda masculina premium construída com **Next.js 14**, **TypeScript**, **Tailwind CSS** e **Zustand**.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14.2 (App Router)
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4 + PostCSS
- **Estado:** Zustand
- **UI Components:** Radix UI + shadcn/ui patterns
- **Ícones:** Lucide React
- **Notificações:** React Hot Toast + Sonner
- **Analytics:** Vercel Analytics + Speed Insights

## 📂 Estrutura do Projeto

```
src/hooke-store/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Layout raiz
│   ├── page.tsx              # Home
│   ├── globals.css           # Estilos globais
│   ├── sitemap.ts            # Sitemap para SEO
│   ├── camisetas/            # Página de todos os produtos
│   ├── contato/              # Página de contato
│   ├── sobre/                # Sobre a loja
│   ├── politica-de-devolucao/# Políticas
│   └── produto/
│       └── [slug]/           # Página dinâmica do produto
│
├── components/               # Componentes React (reutilizáveis)
│   ├── cart/                 # Componentes do carrinho
│   ├── home/                 # Componentes da homepage
│   ├── layout/               # Navbar, Footer, TopBar
│   ├── shop/                 # Componentes da loja (cards, galeria)
│   ├── seo/                  # Schema, metadata
│   └── ui/                   # Componentes base (dialog, sheet)
│
├── data/                     # Dados estáticos
│   ├── products.ts           # Catálogo de produtos
│   └── size-guide.ts         # Guia de tamanhos
│
├── config/                   # Configurações
│   └── site.ts               # Config global (WhatsApp, redes sociais)
│
├── store/                    # Zustand stores
│   └── cart-store.ts         # Estado do carrinho
│
├── types/                    # TypeScript types
│   └── index.ts              # Interfaces (Product, MenuItem, etc)
│
├── lib/                      # Utilitários
│   └── utils.ts              # Funções helpers
│
├── public/                   # Assets estáticos
│   ├── hero-*.avif           # Banners
│   └── produtos/             # Imagens de produtos (formato AVIF)
│
├── config files              # Configuração
│   ├── next.config.js        # Next.js
│   ├── tailwind.config.ts    # Tailwind
│   ├── tsconfig.json         # TypeScript
│   ├── postcss.config.js     # PostCSS
│   ├── eslint.config.mjs     # ESLint
│   └── components.json       # shadcn/ui
│
└── .env.example              # Exemplo de variáveis de ambiente
```

## 🎯 Principais Funcionalidades

✅ **E-commerce Completo**
- Catálogo de produtos com busca e filtragem
- Página de detalhes do produto com galeria
- Carrinho de compras (Zustand)
- Integração com WhatsApp para checkout

✅ **Performance**
- Imagens otimizadas em AVIF/WebP
- Server-side rendering com Next.js
- CSS otimizado com Tailwind
- Sem dependências desnecessárias

✅ **SEO**
- Sitemap dinâmico
- Metadata customizada
- Schema.org para produtos
- Open Graph tags

✅ **Design Responsivo**
- Mobile-first
- Tailwind CSS
- Componentes adaptáveis

## 🛠️ Instalação & Setup

### Pré-requisitos
- Node.js >= 18
- npm, yarn ou pnpm

### Passos

1. **Clonar repositório**
```bash
git clone https://github.com/usehooke/hooke-loja-v3-final.git
cd hooke-loja-v3-final
```

2. **Instalar dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env.local
```
Edite `.env.local` com seus valores (WhatsApp, domínio, etc)

4. **Executar em desenvolvimento**
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

5. **Build para produção**
```bash
npm run build
npm run start
```

## 📝 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build otimizado para produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa ESLint
```

## 😊 Como Adicionar Produtos

1. Abra `data/products.ts`
2. Adicione um novo objeto na array `products`:

```typescript
{
  id: "seu-produto-id",
  name: "Nome do Produto",
  slug: "seu-produto-slug",
  price: 99.90,
  featured: false,
  isNew: false,
  description: "Descrição curta",
  imageUrl: "/produtos/imagem.avif",
  images: ["/produtos/img1.avif", "/produtos/img2.avif"],
  sizes: ["P", "M", "G", "GG", "XG"],
  category: "Oversized",
  details: {
    fabric: "Algodão Premium",
    model: "Oversized",
    wash: "Amaciada"
  }
}
```

## 🎨 Customização

### Cores (Tailwind)
Edite `tailwind.config.ts` na seção `theme.extend.colors`

### Metadata & Redes Sociais
Edite `config/site.ts`

### Layout & Componentes
Os componentes estão em `components/` - sinta-se livre para editar!

## 📱 WhatsApp Integration

O número do WhatsApp está configurado em `.env.local` e usado em:
- Botão flutuante (WhatsAppButton)
- Checkout via WhatsApp
- Contato direto

Atualize `NEXT_PUBLIC_WHATSAPP_NUMBER` com seu número no formato: `5511999999999` (com código de país e área)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```
Seguir as instruções interativas. Vercel detectará automaticamente que é Next.js.

### Outras plataformas
- Netlify
- AWS Amplify
- Docker (se tiver)
- Self-hosted

## 📊 Performance

- **Lighthouse Score:** 90+
- **Imagens:** AVIF/WebP otimizadas
- **Bundle:** ~45KB (gzipped)
- **LCP:** < 2.5s

## 🔒 Segurança

- HTTP-only cookies para sessões (quando implementado)
- CSRF protection
- XSS prevention com React
- Content Security Policy prontos

## 🐛 Troubleshooting

### "Cannot find module '@/...'"
Verificar `tsconfig.json` - alias `@/*` deve apontar para raiz

### Imagens não aparecem
- Verificar caminho em `public/produtos/`
- Usar formato AVIF quando possível
- Validar loader em `next.config.js`

### Build falha
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Documentação Útil

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças (`git commit -m 'Add nova feature'`)
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

## 📄 Licença

Privado - Hooke Store

## 📧 Contato

WhatsApp: Envie uma mensagem
Instagram: [@usehooke](https://instagram.com/usehooke)

---

**Última atualização:** Fevereiro 2026

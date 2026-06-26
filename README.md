# React + Vite + Tailwind CSS Project

Современный стартовый проект на React с Vite, Tailwind CSS, Framer Motion и другими инструментами.

## Технологии

- **React 19.2.6** - UI библиотека
- **Vite 7.3.2** - Быстрый сборщик
- **Tailwind CSS 4.1.17** - Utility-first CSS фреймворк
- **TypeScript 5.9.3** - Типизация
- **React Router DOM 7.18.0** - Маршрутизация
- **Framer Motion 12.41.0** - Анимации
- **Zustand 5.0.14** - Управление состоянием
- **Lucide React 1.21.0** - Иконки

## Установка

bash
# Клонируйте репозиторий
git clone https://github.com/nurylbekabiltaevvv/michelin-restaurant-management-system.git

# Перейдите в директорию
cd название-репозитория

# Установите зависимости
npm install


## Разработка

bash
# Запустить dev-сервер
npm run dev

# Собрать проект
npm run build

# Предпросмотр production сборки
npm run preview


Dev-сервер будет доступен по адресу: `http://localhost:5173`

## Деплой на GitHub Pages

### Автоматический деплой через GitHub Actions

1. **Настройте vite.config.ts:**

typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '//', //  Важно!
})


2. **Создайте файл `.github/workflows/deploy.yml`:**

yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4


3. **Настройте GitHub Pages:**
   - Откройте **Settings** → **Pages**
   - В **Source** выберите **GitHub Actions**

4. **Запушьте код:**

bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main


Сайт будет доступен по адресу: `https://ваш-username.github.io/название-репозитория/`

### Ручной деплой через gh-pages

1. **Установите gh-pages:**

bash
npm install --save-dev gh-pages


2. **Добавьте скрипт в package.json:**

json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}


3. **Деплой:**

bash
npm run deploy


4. **Настройте GitHub Pages:**
   - Откройте **Settings** → **Pages**
   - В **Source** выберите ветку **gh-pages**

## React Router и GitHub Pages

Если используете React Router, есть два варианта:

### Вариант 1: HashRouter (проще)

typescript
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      {/* ваши роуты */}
    </HashRouter>
  )
}


### Вариант 2: BrowserRouter + 404.html

Создайте скрипт для копирования `index.html` в `404.html`:

**package.json:**
json
{
  "scripts": {
    "build": "vite build && cp dist/index.html dist/404.html"
  }
}


## Tailwind CSS

Проект использует Tailwind CSS 4 с Vite плагином. Конфигурация в `tailwind.config.js`:

javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


## Полезные утилиты

### clsx + tailwind-merge

typescript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Использование
<div className={cn('px-4 py-2', isActive && 'bg-blue-500')} />


### Zustand store

typescript
import { create } from 'zustand'

interface Store {
  count: number
  increment: () => void
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))


## TypeScript

Настройки TypeScript в `tsconfig.json`:

json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}


## Однофайловая сборка

Для создания single HTML файла используется `vite-plugin-singlefile`:

typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
})


##  Отладка

- Используйте React DevTools
- Vite HMR для мгновенного обновления
- TypeScript для проверки типов

##  Лицензия

MIT

##  Контрибьюция

Пулл-реквесты приветствуются!

1. Форкните проект
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

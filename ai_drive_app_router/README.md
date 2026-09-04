# ai_drive_app_router

AI駆動開発の練習用プロジェクトです。Next.js（App Router）と Express / Prisma / PostgreSQL を使い、Qiita 風の記事投稿アプリをフロントエンド・バックエンド・DBまで一通り実装しています。

Pages Router 版は隣の `ai_drive/` にあります。こちらは App Router 専用で、ポートも分けているので同時起動できます。

## プロジェクト概要

記事の一覧・詳細・投稿・編集・削除ができる Web アプリケーションです。

- フロントエンドはローカルの Next.js（App Router）から Backend API へ HTTP 通信します
- バックエンドは Docker 上の Node.js + TypeScript + Express で動作します
- データベースは Docker 上の PostgreSQL を使用します
- Next.js の `pages/` や Route Handler（`app/api/`）は使用しません

通信の流れ:

```text
Next.js (localhost:3002)
  ↓
http://localhost:3003/api/articles
  ↓
Express
  ↓
Controller → Service → Repository
  ↓
Prisma
  ↓
PostgreSQL
```

## 技術構成

### フロントエンド

- Next.js 15（App Router）
- TypeScript
- React 19

### バックエンド

- Node.js
- TypeScript
- Express
- Prisma
- REST API

### データベース

- PostgreSQL 15

### インフラ

- Docker
- Docker Compose

## レンダリングの使い分け

| 方式 | 画面 | App Router での指定 |
| --- | --- | --- |
| SSR | `/articles`, `/articles/[id]`, `/articles/[id]/edit` | `dynamic = 'force-dynamic'` と `cache: 'no-store'` |
| SSG | `/learn/ssg`, `/learn/ssg/stack` | `dynamic = 'force-static'` |
| ISR | `/learn/isr`, `/learn/isr/stats` | `revalidate = 10` |
| CSR | 投稿・編集フォーム、削除ボタン | `'use client'` |

## ディレクトリ構成

```text
.
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── articles/
│   │   └── learn/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## ポート

Pages Router 版（`ai_drive/`）とぶつからないよう、ポートをずらしています。

| 役割 | このプロジェクト | Pages Router 版 |
| --- | --- | --- |
| フロントエンド | 3002 | 3000 |
| バックエンド | 3003 | 3001 |
| PostgreSQL | 5434 | 5432 |

## 環境変数

### フロントエンド (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

### バックエンド（docker-compose.yml で設定）

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/qiita_app_approuter
PORT=3003
FRONTEND_ORIGIN=http://localhost:3002
```

## Backend起動方法

プロジェクトルート（`ai_drive_app_router/`）で:

```bash
docker compose up --build
```

バックエンドは `http://localhost:3003` で起動します。

```bash
curl http://localhost:3003/health
```

停止:

```bash
docker compose down
```

## Frontend起動方法

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:3002` を開きます。

SSG / ISR の差を見るときは:

```bash
cd frontend
npm run build
npm start
```

## API一覧

Base URL: `http://localhost:3003`

| メソッド | パス | 説明 |
| --- | --- | --- |
| GET | `/health` | ヘルスチェック |
| GET | `/api/articles` | 記事一覧 |
| GET | `/api/articles/:id` | 記事詳細 |
| POST | `/api/articles` | 記事作成 |
| PATCH | `/api/articles/:id` | 記事更新 |
| DELETE | `/api/articles/:id` | 記事削除 |

## 開発時の注意事項

- Next.js は App Router です。`pages/` ディレクトリは使用しないでください
- Next.js の Route Handler は使用せず、Express の REST API を呼び出してください
- バックエンドは Docker 上の Node.js で動かしてください
- フロントエンド起動前に Backend / PostgreSQL を起動してください
- 投稿者は seed されたデモユーザー（`demo@example.com`）を利用します

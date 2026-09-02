# ai_drive

AI駆動開発の練習用プロジェクトです。Next.js 12（Page Router）と Express / Prisma / PostgreSQL を使い、Qiita 風の記事投稿アプリをフロントエンド・バックエンド・DBまで一通り実装しています。

## プロジェクト概要

記事の一覧・詳細・投稿・編集・削除ができる Web アプリケーションです。

- フロントエンドはローカルの Next.js 12 から Backend API へ HTTP 通信します
- バックエンドは Docker 上の Node.js + TypeScript + Express で動作します
- データベースは Docker 上の PostgreSQL を使用します
- Next.js の API Routes や App Router（`app/`）は使用しません

通信の流れ:

```text
Next.js (localhost:3000)
  ↓
http://localhost:3001/api/articles
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

- Next.js 12.3.4（Page Router）
- TypeScript
- React 18

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

## ディレクトリ構成

```text
.
├── frontend/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── articles/
│   │   │   ├── index.tsx
│   │   │   ├── new.tsx
│   │   │   ├── [id].tsx
│   │   │   └── [id]/
│   │   │       └── edit.tsx
│   │   └── _app.tsx
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── public/
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
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Docker構成

Docker Compose では次の 2 つのコンテナを起動します。

```text
backend container
├── Node.js
├── TypeScript
├── Express
└── Prisma
        ↓
postgres container
└── PostgreSQL
```

- `backend` は `backend/Dockerfile` からビルドします
- ソースコードは volume でマウントし、`npm run dev` によるホットリロードが可能です
- `db` のヘルスチェックが成功してから backend が起動します
- 起動時に Prisma Client の生成、Migration の適用、初期データの seed を実行します

## 環境変数

### フロントエンド (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### バックエンド（docker-compose.yml で設定）

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/qiita_app
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
```

サンプルは `frontend/.env.example` と `backend/.env.example` を参照してください。

## PostgreSQLの接続情報

| 項目 | 値 |
| --- | --- |
| Host（コンテナ間） | `db` |
| Host（ホストOSから） | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Password | `postgres` |
| Database | `qiita_app` |
| URL | `postgresql://postgres:postgres@localhost:5432/qiita_app` |

Prisma は Backend コンテナから `db:5432` へ接続します。

## Prisma Migration方法

DB 変更は SQL を直接管理せず、Prisma Migration で管理します。

スキーマを変更したあとは、Backend コンテナ内で次を実行します。

```bash
docker compose exec backend npx prisma migrate dev --name <migration_name>
```

すでに作成済みの Migration を適用する場合:

```bash
docker compose exec backend npx prisma migrate deploy
```

`docker compose up` 時にも `prisma migrate deploy` が自動実行されます。

## Prisma Client生成方法

```bash
docker compose exec backend npx prisma generate
```

コンテナ起動時にも `npx prisma generate` が実行されます。

## Backend起動方法

プロジェクトルートで:

```bash
docker compose up --build
```

バックエンドは `http://localhost:3001` で起動します。

ヘルスチェック:

```bash
curl http://localhost:3001/health
```

停止:

```bash
docker compose down
```

DB データまで削除する場合:

```bash
docker compose down -v
```

## Frontend起動方法

フロントエンドは Docker ではなく、ローカルで起動します。

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## API一覧

Base URL: `http://localhost:3001`

| メソッド | パス | 説明 |
| --- | --- | --- |
| GET | `/health` | ヘルスチェック |
| GET | `/api/articles` | 記事一覧 |
| GET | `/api/articles/:id` | 記事詳細 |
| POST | `/api/articles` | 記事作成 |
| PATCH | `/api/articles/:id` | 記事更新 |
| DELETE | `/api/articles/:id` | 記事削除 |

### GET /api/articles

記事一覧を返します。各記事には `id`, `title`, `content`, `author`, `tags`, `createdAt`, `updatedAt` が含まれます。

### POST /api/articles

リクエスト例:

```json
{
  "title": "Next.jsについて",
  "content": "Next.jsについての記事です。",
  "authorId": 1,
  "tags": ["Next.js", "TypeScript"]
}
```

初期 seed で `authorId: 1` のデモユーザーが作成されます。フロントエンドの新規投稿もこのユーザーを使用します。

エラーレスポンス例:

```json
{
  "statusCode": 400,
  "message": "タイトルを入力してください"
}
```

- `400 Bad Request`: バリデーションエラー
- `404 Not Found`: 記事またはエンドポイントが存在しない
- `500 Internal Server Error`: サーバー内部エラー

## 開発時の注意事項

- Next.js は 12 系 + Page Router です。`app/` ディレクトリや App Router は使用しないでください
- Next.js の API Routes は使用せず、Express の REST API を呼び出してください
- バックエンドはローカルの Node.js ではなく、Docker 上の Node.js で動かしてください
- バックエンドのソースを編集すると、volume 経由でコンテナに反映されホットリロードされます
- `package.json` の依存関係を変更した場合は `docker compose up --build` で backend を再ビルドしてください
- Prisma schema を変更したら、Backend コンテナ内で `npx prisma migrate dev` を実行してください
- フロントエンド起動前に Backend / PostgreSQL を起動してください
- 投稿者は seed されたデモユーザー（`demo@example.com`）を利用します

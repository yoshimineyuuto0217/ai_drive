import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
    connectionTimeoutMillis: 5000,
  }),
});

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'デモユーザー',
      email: 'demo@example.com',
    },
  });

  const articleCount = await prisma.article.count();
  if (articleCount > 0) {
    return;
  }

  const sample = await prisma.article.create({
    data: {
      title: 'AI駆動開発を始める',
      content:
        'このアプリは、Next.js 12（Page Router）と Express / Prisma / PostgreSQL を組み合わせた Qiita 風の記事投稿アプリです。\n\n記事の作成・編集・削除を通じて、フロントエンドから REST API、DB までの一連の流れを確認できます。',
      authorId: demoUser.id,
      tags: {
        create: [
          {
            tag: {
              connectOrCreate: {
                where: { name: 'AI駆動開発' },
                create: { name: 'AI駆動開発' },
              },
            },
          },
          {
            tag: {
              connectOrCreate: {
                where: { name: 'TypeScript' },
                create: { name: 'TypeScript' },
              },
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded user id=${demoUser.id}, article id=${sample.id}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

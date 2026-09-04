import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="hero card">
      <p className="eyebrow">AI駆動開発 練習プロジェクト / App Router</p>
      <h1>Qiita風の記事投稿アプリ</h1>
      <p className="hero-lead">
        Next.js（App Router）から Express / Prisma / PostgreSQL へ接続し、記事の作成・編集・削除まで一通り試せます。
        一覧・詳細は Server Component（SSR）、投稿・編集・削除は Client Component です。
      </p>
      <div className="hero-actions">
        <Link href="/articles" className="button-primary">
          記事一覧を見る
        </Link>
        <Link href="/articles/new" className="button-secondary">
          記事を投稿する
        </Link>
        <Link href="/learn/ssg" className="button-secondary">
          SSG / ISR を学ぶ
        </Link>
      </div>
    </section>
  );
}

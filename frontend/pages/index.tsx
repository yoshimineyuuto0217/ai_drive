import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Qiita Clone</title>
      </Head>
      <section className="hero card">
        <p className="eyebrow">AI駆動開発 練習プロジェクト</p>
        <h1>Qiita風の記事投稿アプリ</h1>
        <p className="hero-lead">
          Next.js 12（Page Router）から Express / Prisma / PostgreSQL へ接続し、記事の作成・編集・削除まで一通り試せます。
        </p>
        <div className="hero-actions">
          <Link href="/articles">
            <a className="button-primary">記事一覧を見る</a>
          </Link>
          <Link href="/articles/new">
            <a className="button-secondary">記事を投稿する</a>
          </Link>
        </div>
      </section>
    </>
  );
}

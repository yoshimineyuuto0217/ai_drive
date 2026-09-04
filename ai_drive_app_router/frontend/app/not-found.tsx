import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="card">
      <h1>ページが見つかりません</h1>
      <p className="muted">指定された記事またはページは存在しません。</p>
      <p>
        <Link href="/articles" className="text-link">
          記事一覧へ戻る
        </Link>
      </p>
    </section>
  );
}

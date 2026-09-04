import { ArticleCard } from '../../components/ArticleCard';
import { ErrorBanner } from '../../components/ErrorBanner';
import { articleApi } from '../../lib/api';
import { Article } from '../../lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '記事一覧',
};

export default async function ArticleListPage() {
  let articles: Article[] = [];
  let error = '';

  try {
    articles = await articleApi.list({ cache: 'no-store' });
  } catch (err) {
    error = err instanceof Error ? err.message : '記事の取得に失敗しました';
  }

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">SSR / Server Component</p>
        <h1>記事一覧</h1>
        <p className="muted">fetch に cache: &apos;no-store&apos; を付け、リクエストごとに取得します。</p>
      </div>
      {error && <ErrorBanner message={error} />}
      {!error && articles.length === 0 && (
        <p className="empty">まだ記事がありません。最初の記事を投稿してみましょう。</p>
      )}
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}

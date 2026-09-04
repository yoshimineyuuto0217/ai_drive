import { ArticleCard } from '../../../components/ArticleCard';
import { ErrorBanner } from '../../../components/ErrorBanner';
import { GeneratedMeta } from '../../../components/GeneratedMeta';
import { LearnNav } from '../../../components/LearnNav';
import { articleApi } from '../../../lib/api';
import { Article } from '../../../lib/types';

export const revalidate = 10;

export const metadata = {
  title: 'ISR 記事スナップショット',
};

export default async function IsrArticlesPage() {
  let articles: Article[] = [];
  let error = '';

  try {
    articles = await articleApi.list({ next: { revalidate: 10 } });
  } catch (err) {
    error = err instanceof Error ? err.message : '記事の取得に失敗しました';
  }

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 1 / 2</p>
        <h1>ISR（Incremental Static Regeneration）</h1>
        <p className="muted">
          export const revalidate = 10 と fetch の next.revalidate で、記事一覧のスナップショットを定期再生成します。
        </p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="ISR" generatedAt={new Date().toISOString()} revalidateSeconds={10} />
        <h2>このページで確認すること</h2>
        <ul className="learn-list">
          <li>本番では、最初のアクセスでキャッシュされた HTML が返ります。</li>
          <li>記事を投稿・削除しても、最大 10 秒は古い一覧のままです。</li>
          <li>期限後の次アクセスで裏再生成され、その次から新しい一覧になります。</li>
        </ul>
      </section>
      {error && <ErrorBanner message={error} />}
      {!error && articles.length === 0 && <p className="empty">スナップショット時点で記事はありません。</p>}
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}

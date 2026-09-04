import { ErrorBanner } from '../../../../components/ErrorBanner';
import { GeneratedMeta } from '../../../../components/GeneratedMeta';
import { LearnNav } from '../../../../components/LearnNav';
import { articleApi } from '../../../../lib/api';

export const revalidate = 10;

export const metadata = {
  title: 'ISR 記事統計',
};

export default async function IsrStatsPage() {
  let articleCount = 0;
  let latestTitle = '';
  let error = '';

  try {
    const articles = await articleApi.list({ next: { revalidate: 10 } });
    articleCount = articles.length;
    latestTitle = articles[0]?.title ?? '';
  } catch (err) {
    error = err instanceof Error ? err.message : '記事の取得に失敗しました';
  }

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 2 / 2</p>
        <h1>ISR で記事統計を出す</h1>
        <p className="muted">件数と最新タイトルだけを、10秒ごとに再生成します。</p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="ISR" generatedAt={new Date().toISOString()} revalidateSeconds={10} />
        {error && <ErrorBanner message={error} />}
        {!error && (
          <ul className="learn-list">
            <li>
              記事数: <strong>{articleCount}</strong>
            </li>
            <li>
              最新記事: <strong>{latestTitle || 'なし'}</strong>
            </li>
          </ul>
        )}
      </section>
    </>
  );
}

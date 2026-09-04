import { GetStaticProps } from 'next';
import Head from 'next/head';
import { ErrorBanner } from '../../../components/ErrorBanner';
import { GeneratedMeta } from '../../../components/GeneratedMeta';
import { LearnNav } from '../../../components/LearnNav';
import { articleApi } from '../../../lib/api';

const REVALIDATE_SECONDS = 10;

type IsrStatsPageProps = {
  articleCount: number;
  latestTitle: string;
  error: string;
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<IsrStatsPageProps> = async () => {
  try {
    const articles = await articleApi.list();
    return {
      props: {
        articleCount: articles.length,
        latestTitle: articles[0]?.title ?? '',
        error: '',
        generatedAt: new Date().toISOString(),
      },
      revalidate: REVALIDATE_SECONDS,
    };
  } catch (err) {
    return {
      props: {
        articleCount: 0,
        latestTitle: '',
        error: err instanceof Error ? err.message : '記事の取得に失敗しました',
        generatedAt: new Date().toISOString(),
      },
      revalidate: REVALIDATE_SECONDS,
    };
  }
};

export default function IsrStatsPage({
  articleCount,
  latestTitle,
  error,
  generatedAt,
}: IsrStatsPageProps) {
  return (
    <>
      <Head>
        <title>ISR 記事統計 | Qiita Clone</title>
      </Head>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 2 / 2</p>
        <h1>ISR で記事統計を出す</h1>
        <p className="muted">件数と最新タイトルだけを、{REVALIDATE_SECONDS}秒ごとに再生成します。</p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="ISR" generatedAt={generatedAt} revalidateSeconds={REVALIDATE_SECONDS} />
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

import { GetStaticProps } from 'next';
import Head from 'next/head';
import { ArticleCard } from '../../../components/ArticleCard';
import { ErrorBanner } from '../../../components/ErrorBanner';
import { GeneratedMeta } from '../../../components/GeneratedMeta';
import { LearnNav } from '../../../components/LearnNav';
import { articleApi } from '../../../lib/api';
import { Article } from '../../../lib/types';

const REVALIDATE_SECONDS = 10;

type IsrArticlesPageProps = {
  articles: Article[];
  error: string;
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<IsrArticlesPageProps> = async () => {
  try {
    const articles = await articleApi.list();
    return {
      props: {
        articles,
        error: '',
        generatedAt: new Date().toISOString(),
      },
      revalidate: REVALIDATE_SECONDS,
    };
  } catch (err) {
    return {
      props: {
        articles: [],
        error: err instanceof Error ? err.message : '記事の取得に失敗しました',
        generatedAt: new Date().toISOString(),
      },
      revalidate: REVALIDATE_SECONDS,
    };
  }
};

export default function IsrArticlesPage({ articles, error, generatedAt }: IsrArticlesPageProps) {
  return (
    <>
      <Head>
        <title>ISR 記事スナップショット | Qiita Clone</title>
      </Head>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 1 / 2</p>
        <h1>ISR（Incremental Static Regeneration）</h1>
        <p className="muted">
          `getStaticProps` に `revalidate: {REVALIDATE_SECONDS}` を付け、記事一覧のスナップショットを定期再生成します。
        </p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="ISR" generatedAt={generatedAt} revalidateSeconds={REVALIDATE_SECONDS} />
        <h2>このページで確認すること</h2>
        <ul className="learn-list">
          <li>本番では、最初のアクセスでキャッシュされた HTML が返ります。</li>
          <li>記事を投稿・削除しても、最大 {REVALIDATE_SECONDS} 秒は古い一覧のままです。</li>
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

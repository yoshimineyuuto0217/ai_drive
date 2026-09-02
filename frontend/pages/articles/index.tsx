import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ArticleCard } from '../../components/ArticleCard';
import { ErrorBanner } from '../../components/ErrorBanner';
import { articleApi } from '../../lib/api';
import { Article } from '../../lib/types';

type ArticleListPageProps = {
  articles: Article[];
  error: string;
};

export const getServerSideProps: GetServerSideProps<ArticleListPageProps> = async () => {
  try {
    const articles = await articleApi.list();
    return {
      props: {
        articles,
        error: '',
      },
    };
  } catch (err) {
    return {
      props: {
        articles: [],
        error: err instanceof Error ? err.message : '記事の取得に失敗しました',
      },
    };
  }
};

export default function ArticleListPage({ articles, error }: ArticleListPageProps) {
  return (
    <>
      <Head>
        <title>記事一覧 | Qiita Clone</title>
      </Head>
      <div className="page-heading">
        <h1>記事一覧</h1>
        <p className="muted">投稿された記事を新しい順に表示します。</p>
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

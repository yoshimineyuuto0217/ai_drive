import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorBanner } from '../../components/ErrorBanner';
import { TagList } from '../../components/TagList';
import { articleApi } from '../../lib/api';
import { formatDate, parsePositiveInt } from '../../lib/format';
import { Article } from '../../lib/types';

type ArticleDetailPageProps = {
  article: Article | null;
  error: string;
};

export const getServerSideProps: GetServerSideProps<ArticleDetailPageProps> = async (context) => {
  const id = parsePositiveInt(context.params?.id);
  if (id === null) {
    return {
      props: {
        article: null,
        error: '記事IDが不正です',
      },
    };
  }

  try {
    const article = await articleApi.getById(id);
    return {
      props: {
        article,
        error: '',
      },
    };
  } catch (err) {
    return {
      props: {
        article: null,
        error: err instanceof Error ? err.message : '記事の取得に失敗しました',
      },
    };
  }
};

export default function ArticleDetailPage({ article, error: initialError }: ArticleDetailPageProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setError(initialError);
  }, [initialError, article?.id]);

  const handleDelete = async () => {
    if (!article) {
      return;
    }

    const confirmed = window.confirm('この記事を削除しますか？');
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError('');
    try {
      await articleApi.remove(article.id);
      await router.push('/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setDeleting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{article ? `${article.title} | Qiita Clone` : '記事詳細 | Qiita Clone'}</title>
      </Head>
      {error && <ErrorBanner message={error} />}
      {article && (
        <article className="card article-detail">
          <TagList tags={article.tags} />
          <h1>{article.title}</h1>
          <div className="article-card-meta">
            <span className="author-badge">{article.author.name.slice(0, 1)}</span>
            <div>
              <p className="meta-text">{article.author.name}</p>
              <p className="meta-text muted">{formatDate(article.createdAt)}</p>
            </div>
          </div>
          <div className="article-actions">
            <Link href={`/articles/${article.id}/edit`}>
              <a className="button-secondary">編集</a>
            </Link>
            <button
              type="button"
              className="button-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '削除中...' : '削除'}
            </button>
          </div>
          <div className="article-body">{article.content}</div>
        </article>
      )}
    </>
  );
}

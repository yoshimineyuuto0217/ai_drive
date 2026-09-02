import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorBanner } from '../../components/ErrorBanner';
import { Loading } from '../../components/Loading';
import { TagList } from '../../components/TagList';
import { articleApi } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { Article } from '../../lib/types';

export default function ArticleDetailPage() {
  const router = useRouter();
  const id = Number(router.query.id);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!Number.isInteger(id) || id <= 0) {
      setError('記事IDが不正です');
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    articleApi
      .getById(id)
      .then((data) => {
        if (mounted) {
          setArticle(data);
          setError('');
        }
      })
      .catch((err: Error) => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [router.isReady, id]);

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
      {loading && <Loading />}
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

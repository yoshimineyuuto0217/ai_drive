import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArticleForm, ArticleFormValues, parseTagInput } from '../../../components/ArticleForm';
import { ErrorBanner } from '../../../components/ErrorBanner';
import { Loading } from '../../../components/Loading';
import { articleApi } from '../../../lib/api';
import { Article } from '../../../lib/types';

export default function EditArticlePage() {
  const router = useRouter();
  const id = Number(router.query.id);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    articleApi
      .getById(id)
      .then((data) => {
        if (mounted) {
          setArticle(data);
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

  const handleSubmit = async (values: ArticleFormValues) => {
    if (!article) {
      return;
    }

    setError('');
    try {
      const updated = await articleApi.update(article.id, {
        title: values.title,
        content: values.content,
        tags: parseTagInput(values.tags),
      });
      await router.push(`/articles/${updated.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  return (
    <>
      <Head>
        <title>{article ? `${article.title} を編集 | Qiita Clone` : '記事を編集 | Qiita Clone'}</title>
      </Head>
      <div className="page-heading">
        <h1>記事を編集</h1>
        <p className="muted">内容を修正して更新できます。</p>
      </div>
      {error && <ErrorBanner message={error} />}
      {loading && <Loading />}
      {article && (
        <div className="card">
          <ArticleForm
            initialValues={{
              title: article.title,
              content: article.content,
              tags: article.tags.join(', '),
            }}
            submitLabel="更新する"
            submittingLabel="更新中..."
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </>
  );
}

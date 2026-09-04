import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArticleForm, ArticleFormValues, parseTagInput } from '../../../components/ArticleForm';
import { ErrorBanner } from '../../../components/ErrorBanner';
import { articleApi } from '../../../lib/api';
import { parsePositiveInt } from '../../../lib/format';
import { Article } from '../../../lib/types';

type EditArticlePageProps = {
  article: Article | null;
  error: string;
};

export const getServerSideProps: GetServerSideProps<EditArticlePageProps> = async (context) => {
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

export default function EditArticlePage({ article, error: initialError }: EditArticlePageProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError);

  useEffect(() => {
    setError(initialError);
  }, [initialError, article?.id]);

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

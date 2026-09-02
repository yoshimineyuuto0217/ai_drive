import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ArticleForm, ArticleFormValues, parseTagInput } from '../../components/ArticleForm';
import { ErrorBanner } from '../../components/ErrorBanner';
import { articleApi, DEFAULT_AUTHOR_ID } from '../../lib/api';

export default function NewArticlePage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (values: ArticleFormValues) => {
    setError('');
    try {
      const article = await articleApi.create({
        title: values.title,
        content: values.content,
        authorId: DEFAULT_AUTHOR_ID,
        tags: parseTagInput(values.tags),
      });
      await router.push(`/articles/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    }
  };

  return (
    <>
      <Head>
        <title>記事を投稿 | Qiita Clone</title>
      </Head>
      <div className="page-heading">
        <h1>記事を投稿</h1>
        <p className="muted">タイトル・本文・タグを入力して投稿できます。</p>
      </div>
      {error && <ErrorBanner message={error} />}
      <div className="card">
        <ArticleForm submitLabel="投稿する" submittingLabel="投稿中..." onSubmit={handleSubmit} />
      </div>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { articleApi, DEFAULT_AUTHOR_ID } from '../lib/api';
import { ArticleForm, ArticleFormValues, parseTagInput } from './ArticleForm';
import { ErrorBanner } from './ErrorBanner';

export const NewArticleForm = () => {
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
      router.push(`/articles/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    }
  };

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <div className="card">
        <ArticleForm submitLabel="投稿する" submittingLabel="投稿中..." onSubmit={handleSubmit} />
      </div>
    </>
  );
};

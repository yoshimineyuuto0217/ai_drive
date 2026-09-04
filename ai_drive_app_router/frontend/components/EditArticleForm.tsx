'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { articleApi } from '../lib/api';
import { Article } from '../lib/types';
import { ArticleForm, ArticleFormValues, parseTagInput } from './ArticleForm';
import { ErrorBanner } from './ErrorBanner';

type EditArticleFormProps = {
  article: Article;
};

export const EditArticleForm = ({ article }: EditArticleFormProps) => {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (values: ArticleFormValues) => {
    setError('');
    try {
      const updated = await articleApi.update(article.id, {
        title: values.title,
        content: values.content,
        tags: parseTagInput(values.tags),
      });
      router.push(`/articles/${updated.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  return (
    <>
      {error && <ErrorBanner message={error} />}
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
    </>
  );
};

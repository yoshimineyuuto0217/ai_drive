'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { articleApi } from '../lib/api';
import { ErrorBanner } from './ErrorBanner';

type ArticleDeleteButtonProps = {
  articleId: number;
};

export const ArticleDeleteButton = ({ articleId }: ArticleDeleteButtonProps) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('この記事を削除しますか？');
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError('');
    try {
      await articleApi.remove(articleId);
      router.push('/articles');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <button type="button" className="button-danger" onClick={handleDelete} disabled={deleting}>
        {deleting ? '削除中...' : '削除'}
      </button>
    </>
  );
};

'use client';

import { FormEvent, useState } from 'react';

export type ArticleFormValues = {
  title: string;
  content: string;
  tags: string;
};

type ArticleFormProps = {
  initialValues?: ArticleFormValues;
  submitLabel: string;
  submittingLabel?: string;
  onSubmit: (values: ArticleFormValues) => Promise<void>;
};

export const ArticleForm = ({
  initialValues,
  submitLabel,
  submittingLabel = '送信中...',
  onSubmit,
}: ArticleFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [tags, setTags] = useState(initialValues?.tags ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ title, content, tags });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>タイトル</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="記事のタイトル"
          required
          maxLength={200}
        />
      </label>

      <label className="field">
        <span>タグ（カンマ区切り）</span>
        <input
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="Next.js, TypeScript"
        />
      </label>

      <label className="field">
        <span>本文</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="記事の本文を入力してください"
          rows={16}
          required
        />
      </label>

      <button type="submit" className="button-primary" disabled={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
};

export const parseTagInput = (value: string): string[] =>
  value
    .split(/[,、]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

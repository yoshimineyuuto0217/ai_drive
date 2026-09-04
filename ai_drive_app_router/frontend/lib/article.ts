import { notFound } from 'next/navigation';
import { cache } from 'react';
import { articleApi, FetchInit } from './api';
import { parsePositiveInt } from './format';
import { ApiError, Article } from './types';

const ssrInit: FetchInit = { cache: 'no-store' };

export const getArticleOrNotFound = cache(async (idParam: string): Promise<Article> => {
  const id = parsePositiveInt(idParam);
  if (id === null) {
    notFound();
  }

  try {
    return await articleApi.getById(id, ssrInit);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }
});

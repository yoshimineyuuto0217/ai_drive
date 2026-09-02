import { ApiError, Article, ArticleInput, ArticleUpdateInput } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    if (data.message) {
      return data.message;
    }
  } catch {
    // ignore JSON parse errors
  }

  if (response.status === 400) {
    return '入力内容を確認してください';
  }
  if (response.status === 404) {
    return '指定された記事が見つかりません';
  }
  if (response.status >= 500) {
    return 'サーバーでエラーが発生しました。時間をおいて再度お試しください';
  }
  return 'リクエストに失敗しました';
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      ...options,
    });
  } catch {
    throw new ApiError(
      0,
      'APIサーバーに接続できません。バックエンドが起動しているか確認してください'
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const articleApi = {
  list() {
    return request<Article[]>('/api/articles');
  },

  getById(id: number) {
    return request<Article>(`/api/articles/${id}`);
  },

  create(input: ArticleInput) {
    return request<Article>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  update(id: number, input: ArticleUpdateInput) {
    return request<Article>(`/api/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  remove(id: number) {
    return request<void>(`/api/articles/${id}`, {
      method: 'DELETE',
    });
  },
};

export const DEFAULT_AUTHOR_ID = 1;

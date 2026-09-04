export type Author = {
  id: number;
  name: string;
  email: string;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  author: Author;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ArticleInput = {
  title: string;
  content: string;
  authorId: number;
  tags: string[];
};

export type ArticleUpdateInput = {
  title: string;
  content: string;
  tags: string[];
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

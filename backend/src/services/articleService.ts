import { BadRequestError, NotFoundError } from '../errors/AppError';
import { articleRepository } from '../repositories/articleRepository';
import { userRepository } from '../repositories/userRepository';
import { toArticleResponse } from '../types/article';

type CreateArticleInput = {
  title?: unknown;
  content?: unknown;
  authorId?: unknown;
  tags?: unknown;
};

type UpdateArticleInput = {
  title?: unknown;
  content?: unknown;
  tags?: unknown;
};

const TITLE_MAX_LENGTH = 200;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const parseAuthorId = (value: unknown): number => {
  const authorId = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(authorId) || authorId <= 0) {
    throw new BadRequestError('authorId は正の整数で指定してください');
  }
  return authorId;
};

const parseTags = (value: unknown): string[] => {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value) || value.some((tag) => typeof tag !== 'string')) {
    throw new BadRequestError('tags は文字列の配列で指定してください');
  }

  const unique = new Set(
    value
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  );

  return Array.from(unique);
};

const parseOptionalTags = (value: unknown): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return parseTags(value);
};

const parseTitle = (value: unknown): string => {
  if (!isNonEmptyString(value)) {
    throw new BadRequestError('タイトルを入力してください');
  }

  const title = value.trim();
  if (title.length > TITLE_MAX_LENGTH) {
    throw new BadRequestError(`タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください`);
  }

  return title;
};

const parseContent = (value: unknown): string => {
  if (!isNonEmptyString(value)) {
    throw new BadRequestError('本文を入力してください');
  }
  return value.trim();
};

export const articleService = {
  async list() {
    const articles = await articleRepository.findMany();
    return articles.map(toArticleResponse);
  },

  async getById(id: number) {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('記事が見つかりません');
    }
    return toArticleResponse(article);
  },

  async create(input: CreateArticleInput) {
    const title = parseTitle(input.title);
    const content = parseContent(input.content);
    const authorId = parseAuthorId(input.authorId);
    const tags = parseTags(input.tags);

    const author = await userRepository.findById(authorId);
    if (!author) {
      throw new BadRequestError('指定された投稿者が存在しません');
    }

    const article = await articleRepository.create({
      title,
      content,
      authorId,
      tags,
    });

    return toArticleResponse(article);
  },

  async update(id: number, input: UpdateArticleInput) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('記事が見つかりません');
    }

    const hasTitle = input.title !== undefined;
    const hasContent = input.content !== undefined;
    const hasTags = input.tags !== undefined;

    if (!hasTitle && !hasContent && !hasTags) {
      throw new BadRequestError('更新する項目を指定してください');
    }

    const article = await articleRepository.update(id, {
      title: hasTitle ? parseTitle(input.title) : undefined,
      content: hasContent ? parseContent(input.content) : undefined,
      tags: parseOptionalTags(input.tags),
    });

    return toArticleResponse(article);
  },

  async remove(id: number) {
    const existing = await articleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('記事が見つかりません');
    }

    await articleRepository.delete(id);
  },
};

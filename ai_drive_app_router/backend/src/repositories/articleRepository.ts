import { prisma } from '../lib/prisma';

export const articleInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  tags: {
    include: {
      tag: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

export type CreateArticleData = {
  title: string;
  content: string;
  authorId: number;
  tags: string[];
};

export type UpdateArticleData = {
  title?: string;
  content?: string;
  tags?: string[];
};

export const articleRepository = {
  findMany() {
    return prisma.article.findMany({
      include: articleInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      include: articleInclude,
    });
  },

  create(data: CreateArticleData) {
    return prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        tags: {
          create: data.tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
      include: articleInclude,
    });
  },

  async update(id: number, data: UpdateArticleData) {
    return prisma.$transaction(async (tx) => {
      if (data.tags) {
        await tx.articleTag.deleteMany({ where: { articleId: id } });
      }

      return tx.article.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.content !== undefined ? { content: data.content } : {}),
          ...(data.tags
            ? {
                tags: {
                  create: data.tags.map((name) => ({
                    tag: {
                      connectOrCreate: {
                        where: { name },
                        create: { name },
                      },
                    },
                  })),
                },
              }
            : {}),
        },
        include: articleInclude,
      });
    });
  },

  delete(id: number) {
    return prisma.article.delete({
      where: { id },
    });
  },
};

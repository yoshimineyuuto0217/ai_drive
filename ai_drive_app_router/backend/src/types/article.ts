export type ArticleWithRelations = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    name: string;
    email: string;
  };
  tags: { tag: { name: string } }[];
};

export const toArticleResponse = (article: ArticleWithRelations) => ({
  id: article.id,
  title: article.title,
  content: article.content,
  author: {
    id: article.author.id,
    name: article.author.name,
    email: article.author.email,
  },
  tags: article.tags.map((item) => item.tag.name),
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
});

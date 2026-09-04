import Link from 'next/link';
import { Article } from '../lib/types';
import { excerpt, formatDate } from '../lib/format';
import { TagList } from './TagList';

type ArticleCardProps = {
  article: Article;
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="article-card">
      <div className="article-card-meta">
        <span className="author-badge">{article.author.name.slice(0, 1)}</span>
        <div>
          <p className="meta-text">{article.author.name}</p>
          <p className="meta-text muted">{formatDate(article.createdAt)}</p>
        </div>
      </div>
      <h2 className="article-card-title">
        <Link href={`/articles/${article.id}`}>{article.title}</Link>
      </h2>
      <TagList tags={article.tags} />
      <p className="article-excerpt">{excerpt(article.content)}</p>
      <Link href={`/articles/${article.id}`} className="text-link">
        続きを読む
      </Link>
    </article>
  );
};

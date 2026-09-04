import Link from 'next/link';
import { ArticleDeleteButton } from '../../../components/ArticleDeleteButton';
import { ErrorBanner } from '../../../components/ErrorBanner';
import { TagList } from '../../../components/TagList';
import { getArticleOrNotFound } from '../../../lib/article';
import { formatDate } from '../../../lib/format';
import { ApiError } from '../../../lib/types';

export const dynamic = 'force-dynamic';

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { id } = await params;
  const article = await getArticleOrNotFound(id);
  return { title: article.title };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = await params;

  try {
    const article = await getArticleOrNotFound(id);

    return (
      <article className="card article-detail">
        <p className="eyebrow">SSR / Server Component</p>
        <TagList tags={article.tags} />
        <h1>{article.title}</h1>
        <div className="article-card-meta">
          <span className="author-badge">{article.author.name.slice(0, 1)}</span>
          <div>
            <p className="meta-text">{article.author.name}</p>
            <p className="meta-text muted">{formatDate(article.createdAt)}</p>
          </div>
        </div>
        <div className="article-actions">
          <Link href={`/articles/${article.id}/edit`} className="button-secondary">
            編集
          </Link>
          <ArticleDeleteButton articleId={article.id} />
        </div>
        <div className="article-body">{article.content}</div>
      </article>
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return <ErrorBanner message={err.message} />;
    }
    throw err;
  }
}

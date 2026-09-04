import { EditArticleForm } from '../../../../components/EditArticleForm';
import { ErrorBanner } from '../../../../components/ErrorBanner';
import { getArticleOrNotFound } from '../../../../lib/article';
import { ApiError } from '../../../../lib/types';

export const dynamic = 'force-dynamic';

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleOrNotFound(id);
  return { title: `${article.title} を編集` };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  try {
    const article = await getArticleOrNotFound(id);

    return (
      <>
        <div className="page-heading">
          <p className="eyebrow">SSR + Client Component</p>
          <h1>記事を編集</h1>
          <p className="muted">初期データは Server Component で取得し、フォーム操作だけクライアントに任せます。</p>
        </div>
        <EditArticleForm article={article} />
      </>
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return <ErrorBanner message={err.message} />;
    }
    throw err;
  }
}

import { NewArticleForm } from '../../../components/NewArticleForm';

export const metadata = {
  title: '記事を投稿',
};

export default function NewArticlePage() {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">CSR / Client Component</p>
        <h1>記事を投稿</h1>
        <p className="muted">タイトル・本文・タグを入力して投稿できます。送信処理だけクライアントで行います。</p>
      </div>
      <NewArticleForm />
    </>
  );
}

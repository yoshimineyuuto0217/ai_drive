import { GeneratedMeta } from '../../../components/GeneratedMeta';
import { LearnNav } from '../../../components/LearnNav';

export const dynamic = 'force-static';

export const metadata = {
  title: 'SSG 概要',
};

export default function SsgOverviewPage() {
  const generatedAt = new Date().toISOString();

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 1 / 2</p>
        <h1>SSG（Static Site Generation）</h1>
        <p className="muted">export const dynamic = &apos;force-static&apos; で、ビルド時に HTML を確定します。</p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="SSG" generatedAt={generatedAt} />
        <h2>このページで確認すること</h2>
        <ul className="learn-list">
          <li>revalidate を付けていないので、再ビルドまで内容は固定されます。</li>
          <li>API を呼ばないため、バックエンドが止まっていてもビルドできます。</li>
          <li>本番（next start）でリロードしても、生成時刻は変わりません。</li>
        </ul>
      </section>
    </>
  );
}

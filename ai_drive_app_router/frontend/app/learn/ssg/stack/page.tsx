import { GeneratedMeta } from '../../../../components/GeneratedMeta';
import { LearnNav } from '../../../../components/LearnNav';

export const dynamic = 'force-static';

export const metadata = {
  title: 'SSG 技術構成',
};

const stack = [
  { layer: 'フロントエンド', name: 'Next.js App Router' },
  { layer: 'バックエンド', name: 'Express + TypeScript' },
  { layer: 'ORM', name: 'Prisma' },
  { layer: 'データベース', name: 'PostgreSQL' },
] as const;

export default function SsgStackPage() {
  const generatedAt = new Date().toISOString();

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 2 / 2</p>
        <h1>SSG で技術構成を出す</h1>
        <p className="muted">ビルド時に埋め込んだ静的データを、そのまま HTML に出します。</p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="SSG" generatedAt={generatedAt} />
        <h2>このアプリの構成</h2>
        <ul className="learn-list">
          {stack.map((item) => (
            <li key={item.layer}>
              <strong>{item.layer}</strong>: {item.name}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import { GetStaticProps } from 'next';
import Head from 'next/head';
import { GeneratedMeta } from '../../../components/GeneratedMeta';
import { LearnNav } from '../../../components/LearnNav';

type StackItem = {
  layer: string;
  name: string;
};

type SsgStackPageProps = {
  generatedAt: string;
  stack: StackItem[];
};

export const getStaticProps: GetStaticProps<SsgStackPageProps> = async () => {
  return {
    props: {
      generatedAt: new Date().toISOString(),
      stack: [
        { layer: 'フロントエンド', name: 'Next.js 12 Pages Router' },
        { layer: 'バックエンド', name: 'Express + TypeScript' },
        { layer: 'ORM', name: 'Prisma' },
        { layer: 'データベース', name: 'PostgreSQL' },
      ],
    },
  };
};

export default function SsgStackPage({ generatedAt, stack }: SsgStackPageProps) {
  return (
    <>
      <Head>
        <title>SSG 技術構成 | Qiita Clone</title>
      </Head>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 2 / 2</p>
        <h1>SSG で技術構成を出す</h1>
        <p className="muted">ビルド時に渡した静的データを、そのまま HTML に埋め込みます。</p>
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

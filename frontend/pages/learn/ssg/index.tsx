import { GetStaticProps } from 'next';
import Head from 'next/head';
import { GeneratedMeta } from '../../../components/GeneratedMeta';
import { LearnNav } from '../../../components/LearnNav';

type SsgOverviewPageProps = {
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<SsgOverviewPageProps> = async () => {
  return {
    props: {
      generatedAt: new Date().toISOString(),
    },
  };
};

export default function SsgOverviewPage({ generatedAt }: SsgOverviewPageProps) {
  return (
    <>
      <Head>
        <title>SSG 概要 | Qiita Clone</title>
      </Head>
      <div className="page-heading">
        <p className="eyebrow">学習用ページ 1 / 2</p>
        <h1>SSG（Static Site Generation）</h1>
        <p className="muted">`getStaticProps` だけで、ビルド時に HTML を確定します。</p>
      </div>
      <LearnNav />
      <section className="card">
        <GeneratedMeta mode="SSG" generatedAt={generatedAt} />
        <h2>このページで確認すること</h2>
        <ul className="learn-list">
          <li>`revalidate` を付けていないので、再ビルドまで内容は固定されます。</li>
          <li>API を呼ばないため、バックエンドが止まっていてもビルドできます。</li>
          <li>本番（`next start`）でリロードしても、生成時刻は変わりません。</li>
        </ul>
      </section>
    </>
  );
}

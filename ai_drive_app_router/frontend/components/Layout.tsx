import Link from 'next/link';
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="logo">
            Qiita Clone
          </Link>
          <nav className="nav">
            <Link href="/articles">記事一覧</Link>
            <Link href="/learn/ssg">学習</Link>
            <Link href="/articles/new" className="button-primary header-cta">
              投稿する
            </Link>
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
    </div>
  );
};

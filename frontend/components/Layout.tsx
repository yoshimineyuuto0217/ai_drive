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
          <Link href="/">
            <a className="logo">Qiita Clone</a>
          </Link>
          <nav className="nav">
            <Link href="/articles">
              <a>記事一覧</a>
            </Link>
            <Link href="/articles/new">
              <a className="button-primary header-cta">投稿する</a>
            </Link>
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
    </div>
  );
};

import type { Metadata } from 'next';
import { Layout } from '../components/Layout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Qiita Clone',
    template: '%s | Qiita Clone',
  },
  description: 'Next.js App Router で作った Qiita 風の記事投稿アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

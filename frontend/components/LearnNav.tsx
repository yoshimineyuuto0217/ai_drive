import Link from 'next/link';

const links = [
  { href: '/learn/ssg', label: 'SSG 概要' },
  { href: '/learn/ssg/stack', label: 'SSG 技術構成' },
  { href: '/learn/isr', label: 'ISR 記事スナップショット' },
  { href: '/learn/isr/stats', label: 'ISR 記事統計' },
] as const;

export const LearnNav = () => {
  return (
    <nav className="learn-nav" aria-label="学習用ページ">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <a>{link.label}</a>
        </Link>
      ))}
    </nav>
  );
};

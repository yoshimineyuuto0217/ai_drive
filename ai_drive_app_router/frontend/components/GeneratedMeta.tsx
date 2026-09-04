import { formatDate } from '../lib/format';

type GeneratedMetaProps = {
  mode: 'SSG' | 'ISR';
  generatedAt: string;
  revalidateSeconds?: number;
};

export const GeneratedMeta = ({ mode, generatedAt, revalidateSeconds }: GeneratedMetaProps) => {
  return (
    <div className="learn-meta">
      <p className="eyebrow">{mode}</p>
      <p>
        この HTML が生成された時刻: <strong>{formatDate(generatedAt)}</strong>
      </p>
      {revalidateSeconds !== undefined && (
        <p className="muted">
          ISR: {revalidateSeconds}秒経過後の次アクセスでバックグラウンド再生成します。
        </p>
      )}
      {revalidateSeconds === undefined && (
        <p className="muted">SSG: 再ビルドするまでこの時刻は変わりません。</p>
      )}
      <p className="muted">
        `next dev` では毎回再生成されます。差を見るには `next build && next start` で確認してください。
      </p>
    </div>
  );
};

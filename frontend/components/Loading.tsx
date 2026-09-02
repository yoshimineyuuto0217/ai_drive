type LoadingProps = {
  label?: string;
};

export const Loading = ({ label = '読み込み中...' }: LoadingProps) => {
  return <p className="loading">{label}</p>;
};

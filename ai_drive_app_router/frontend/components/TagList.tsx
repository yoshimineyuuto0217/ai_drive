type TagListProps = {
  tags: string[];
};

export const TagList = ({ tags }: TagListProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
};

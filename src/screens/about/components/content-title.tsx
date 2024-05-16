interface ContentTitleInterface {
  title: string;
}

export const ContentTitle = (props: ContentTitleInterface) => {
  const { title } = props;
  return <div className="text-xl">{title}</div>;
};
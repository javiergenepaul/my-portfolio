interface ContentTitleInterface {
  title: string;
}

export const ContentTitle = (props: ContentTitleInterface) => {
  const { title } = props;
  return <div className="text-2xl font-bold pb-4">{title}</div>;
};

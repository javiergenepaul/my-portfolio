interface IndicatorContainerInterface {
  children: React.ReactNode;
  onClick?: () => void;
}

export const IndicatorContainer = (props: IndicatorContainerInterface) => {
  const { children, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer group"
    >
      {children}
    </div>
  );
};

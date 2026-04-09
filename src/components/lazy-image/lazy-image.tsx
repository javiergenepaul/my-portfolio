interface LazyImageInterface {
  src: string;
  alt: string;
  width?: string | number;
  className?: string;
}

export const LazyImage = ({ src, alt, width, className }: LazyImageInterface) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      className={className ?? "flex"}
    />
  );
};

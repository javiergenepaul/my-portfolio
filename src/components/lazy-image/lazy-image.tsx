interface LazyImageInterface {
  src: string | { src: string };
  alt: string;
  width?: string | number;
  className?: string;
}

export const LazyImage = ({ src, alt, width, className }: LazyImageInterface) => {
  const srcString = typeof src === "string" ? src : src.src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcString}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      className={className ?? "flex"}
    />
  );
};

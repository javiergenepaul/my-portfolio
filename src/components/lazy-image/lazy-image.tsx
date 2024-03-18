import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface LazyImageInterface {
  src: string;
  alt: string;
  width?: string;
}

export const LazyImage = (props: LazyImageInterface) => {
  const { src, alt, width } = props;
  return (
    <LazyLoadImage
    className="flex"
      width={width ? width : undefined}
      alt={alt}
      src={src}
      effect="blur"
    />
  );
};

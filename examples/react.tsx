// This is a React implementation example of process-web-image
//
//
// You should delete the @ts-nocheck comment before using this code
//@ts-nocheck
//srcLocation -> path/to/image
//Dont pass  in the extension.. it should only end with the file name
type Props = {
  srcLocation: string;
  alt: string;
  width: number;
  height: number;
};
export default function Image({ srcLocation, alt, width, height }: Props) {
  return (
    <picture>
      {/* Source for extra large screens (xl) */}
      <source
        media="(min-width: 1280px)"
        srcSet={`${srcLocation}_xl.webp`}
        type="image/webp"
      />

      {/* Source for large screens (lg) */}
      <source
        media="(min-width: 1024px)"
        srcSet={`${srcLocation}_lg.webp`}
        type="image/webp"
      />

      {/* Source for medium screens (md) */}
      <source
        media="(min-width: 768px)"
        srcSet={`${srcLocation}_md.webp`}
        type="image/webp"
      />

      {/* Source for small screens (sm) */}
      <source
        media="(min-width: 640px)"
        srcSet={`${srcLocation}_sm.webp`}
        type="image/webp"
      />

      {/* Base WebP for smaller screens or default when specific sizes aren't needed */}
      <source srcSet={`${srcLocation}.webp`} type="image/webp" />

      {/* Fallback image for all other cases */}
      <img
        src={`${srcLocation}.png`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
    </picture>
  );
}

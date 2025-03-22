<script lang="ts">
  /**
   * This is a Svelte implementation example of process-web-image
   * 
   * @param srcLocation - Path to the image without the extension
   * @param alt - Alternative text for the image
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * 
   * Example usage:
   * <Image srcLocation="path/to/image" alt="Description" width={500} height={300} />
   */
  export let srcLocation: string;
  export let alt: string;
  export let width: number;
  export let height: number;
</script>

<picture>
  <!-- Source for extra large screens (xl) -->
  <source media="(min-width: 1280px)" srcset="{srcLocation}_xl.webp" type="image/webp" />

  <!-- Source for large screens (lg) -->
  <source media="(min-width: 1024px)" srcset="{srcLocation}_lg.webp" type="image/webp" />

  <!-- Source for medium screens (md) -->
  <source media="(min-width: 768px)" srcset="{srcLocation}_md.webp" type="image/webp" />

  <!-- Source for small screens (sm) -->
  <source media="(min-width: 640px)" srcset="{srcLocation}_sm.webp" type="image/webp" />

  <!-- Base WebP for smaller screens or default when specific sizes aren't needed -->
  <source srcset="{srcLocation}.webp" type="image/webp" />

  <!-- Fallback image for all other cases -->
  <img
    src="{srcLocation}.png"
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
  />
</picture>

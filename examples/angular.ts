// This is an Angular implementation example of process-web-image
//
//
// You should delete the @ts-nocheck comment before using this code
//@ts-nocheck
// srcLocation -> path/to/image
// Don't pass in the extension; it should only end with the file name

import { Component, Input } from "@angular/core";

@Component({
  selector: "app-responsive-image",
  template: `
    <picture>
      <!-- Source for extra large screens (xl) -->
      <source
        media="(min-width: 1280px)"
        [srcset]="srcLocation + '_xl.webp'"
        type="image/webp"
      />

      <!-- Source for large screens (lg) -->
      <source
        media="(min-width: 1024px)"
        [srcset]="srcLocation + '_lg.webp'"
        type="image/webp"
      />

      <!-- Source for medium screens (md) -->
      <source
        media="(min-width: 768px)"
        [srcset]="srcLocation + '_md.webp'"
        type="image/webp"
      />

      <!-- Source for small screens (sm) -->
      <source
        media="(min-width: 640px)"
        [srcset]="srcLocation + '_sm.webp'"
        type="image/webp"
      />

      <!-- Base WebP for smaller screens or default when specific sizes aren't needed -->
      <source [srcset]="srcLocation + '.webp'" type="image/webp" />

      <!-- Fallback image for all other cases -->
      <img
        [src]="srcLocation + '.png'"
        [alt]="alt"
        [width]="width"
        [height]="height"
        loading="lazy"
      />
    </picture>
  `,
})
export class ResponsiveImageComponent {
  @Input() srcLocation!: string;
  @Input() alt!: string;
  @Input() width!: number;
  @Input() height!: number;
}

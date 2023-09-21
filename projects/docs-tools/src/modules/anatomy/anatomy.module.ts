import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyImageModule } from '@blackbaud/skyux-lib-media';
import { SkyFluidGridModule } from '@skyux/layout';

import { SkyDocsThumbnailModule } from '../thumbnail/thumbnail.module';

import { SkyDocsAnatomyItemComponent } from './anatomy-item.component';
import { SkyDocsAnatomyThumbnailComponent } from './anatomy-thumbnail.component';
import { SkyDocsAnatomyComponent } from './anatomy.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsThumbnailModule,
    SkyFluidGridModule,
    SkyImageModule,
  ],
  declarations: [
    SkyDocsAnatomyComponent,
    SkyDocsAnatomyItemComponent,
    SkyDocsAnatomyThumbnailComponent,
  ],
  exports: [
    SkyDocsAnatomyComponent,
    SkyDocsAnatomyItemComponent,
    SkyDocsAnatomyThumbnailComponent,
  ],
})
export class SkyDocsAnatomyModule {}

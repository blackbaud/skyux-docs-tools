import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyImageModule } from '@blackbaud/skyux-lib-media';

import { SkyFluidGridModule } from '@skyux/layout';

import { SkyDocsAnatomyComponent } from './anatomy.component';

import { SkyDocsAnatomyItemComponent } from './anatomy-item.component';
import { SkyDocsThumbnailModule } from '../thumbnail/thumbnail.module';
import { SkyDocsAnatomyThumbnailComponent } from './anatomy-thumbnail.component';

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

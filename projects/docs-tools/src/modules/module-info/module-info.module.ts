import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyClipboardModule } from '@blackbaud/skyux-lib-clipboard';

import { SkyCodeModule } from '@blackbaud/skyux-lib-code-block';

import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyDescriptionListModule } from '@skyux/layout';

import { SkyPopoverModule } from '@skyux/popovers';

import { SkyDocsModuleInfoComponent } from './module-info.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule,
    SkyClipboardModule,
    SkyDescriptionListModule,
    SkyHelpInlineModule,
    SkyPopoverModule,
  ],
  declarations: [SkyDocsModuleInfoComponent],
  exports: [SkyDocsModuleInfoComponent],
})
export class SkyDocsModuleInfoModule {}

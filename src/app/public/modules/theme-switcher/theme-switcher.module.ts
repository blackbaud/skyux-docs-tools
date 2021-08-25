import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyDocsThemeSwitcherComponent
} from './theme-switcher.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyRadioModule
  ],
  declarations: [
    SkyDocsThemeSwitcherComponent
  ],
  exports: [
    SkyDocsThemeSwitcherComponent
  ]
})
export class SkyDocsThemeSwitcherModule {}

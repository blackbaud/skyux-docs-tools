import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';

import { SkyIconModule } from '@skyux/icon';

import { SkyThemeModule } from '@skyux/theme';

import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

import { SkyDocsDemoComponent } from './demo.component';

import { SkyDocsDemoControlPanelCheckboxComponent } from './demo-control-panel-checkbox.component';

import { SkyDocsDemoControlPanelComponent } from './demo-control-panel.component';

import { SkyDocsDemoControlPanelRadioGroupComponent } from './demo-control-panel-radio-group.component';

import { SkyDocsDemoControlPanelSectionComponent } from './demo-control-panel-section.component';
import { SkyDocsDemoCustomControlPanelComponent } from './demo-custom-control-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyRadioModule,
    SkyThemeModule,
  ],
  declarations: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent,
    SkyDocsDemoCustomControlPanelComponent,
  ],
  exports: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent,
    SkyDocsDemoCustomControlPanelComponent,
  ],
})
export class SkyDocsDemoModule {}

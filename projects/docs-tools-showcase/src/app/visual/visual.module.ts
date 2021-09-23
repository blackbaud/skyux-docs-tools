import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VisualComponent } from './visual.component';
import { DemoControlPanelThemeVisualComponent } from './demo-control-panel-theme/demo-control-panel-theme-visual.component';
import { SkyDocsDemoModule } from 'projects/docs-tools/src/public-api';

@NgModule({
  declarations: [
    VisualComponent,
    DemoControlPanelThemeVisualComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyDocsDemoModule
  ]
})
export class VisualModule { }

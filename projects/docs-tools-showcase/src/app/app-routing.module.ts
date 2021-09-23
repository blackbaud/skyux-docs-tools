import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoControlPanelThemeVisualComponent } from './visual/demo-control-panel-theme/demo-control-panel-theme-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent
  },
  {
    path: 'visual/demo-control-panel-theme',
    component: DemoControlPanelThemeVisualComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

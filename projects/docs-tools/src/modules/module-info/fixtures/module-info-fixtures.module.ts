import { NgModule } from '@angular/core';

import { SkyDocsModuleInfoModule } from '../module-info.module';

import { ModuleInfoFixtureComponent } from './module-info-fixture.component';

@NgModule({
  declarations: [ModuleInfoFixtureComponent],
  imports: [SkyDocsModuleInfoModule],
})
export class ModuleInfoFixturesModule {}

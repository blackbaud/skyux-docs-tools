import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SkyDatepickerModule } from '@skyux/datetime';

import {
  SkyDocsSourceCodeProvider,
  SkyDocsSupportalService,
  SkyDocsToolsModule,
  SkyDocsTypeDefinitionsProvider,
} from 'projects/docs-tools/src/public-api';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LocalDocsService } from './local-docs.service';
import documentationJson from './mock-documentation.json';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  providers: [
    {
      provide: SkyDocsTypeDefinitionsProvider,
      useValue: {
        anchorIds: documentationJson.anchorIds,
        typeDefinitions: documentationJson.typedoc.children,
      },
    },
    {
      provide: SkyDocsSourceCodeProvider,
      useValue: {
        sourceCode: documentationJson.codeExamples,
        dependencies: documentationJson.codeExampleDependencies,
      },
    },
    {
      provide: SkyDocsSupportalService,
      useClass: LocalDocsService,
    },
  ],
})
export class HomeModule {}

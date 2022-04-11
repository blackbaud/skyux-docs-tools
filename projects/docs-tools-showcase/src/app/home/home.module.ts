import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyColorpickerModule } from '@skyux/colorpicker';

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

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SkyColorpickerModule,
    SkyDocsToolsModule,
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
      },
    },
    {
      provide: SkyDocsSupportalService,
      useClass: LocalDocsService,
    },
  ],
})
export class HomeModule {}

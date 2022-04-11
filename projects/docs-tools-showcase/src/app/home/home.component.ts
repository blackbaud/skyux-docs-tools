import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyDocsToolsOptions } from 'projects/docs-tools/src/public-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux',
        packageName: '@skyux/colorpicker',
      },
    },
  ],
})
export class HomeComponent {
  public model: any = {
    favoriteColor: 'rgb(0, 0, 225)',
  };
}

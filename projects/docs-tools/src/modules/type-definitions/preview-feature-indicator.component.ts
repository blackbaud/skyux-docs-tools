import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyStatusIndicatorModule } from '@skyux/indicators';

@Component({
  selector: 'sky-docs-preview-feature-indicator',
  templateUrl: './preview-feature-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyStatusIndicatorModule],
})
export class SkyDocsPreviewIndicatorComponent {}

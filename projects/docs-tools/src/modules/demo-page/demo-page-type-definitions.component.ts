import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyDocsTypeDefinitions } from '../type-definitions/type-definitions';

/**
 * @internal
 */
@Component({
  selector: 'sky-docs-demo-page-type-definitions',
  templateUrl: './demo-page-type-definitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDocsDemoPageTypeDefinitionsComponent {
  @Input()
  public types: SkyDocsTypeDefinitions;
}

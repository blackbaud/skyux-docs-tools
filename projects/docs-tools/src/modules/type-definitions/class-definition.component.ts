import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyDocsClassDefinition } from './class-definition';

@Component({
  selector: 'sky-docs-class-definition',
  templateUrl: './class-definition.component.html',
  styleUrls: ['./class-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDocsClassDefinitionComponent {
  @Input()
  public config: SkyDocsClassDefinition;
}

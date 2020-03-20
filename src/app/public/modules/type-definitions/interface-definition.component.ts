import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

@Component({
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent {

  @Input()
  public config: SkyDocsInterfaceDefinition;

}

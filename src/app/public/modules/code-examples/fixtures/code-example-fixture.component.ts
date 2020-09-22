import {
  Component,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  SkyDocsCodeExampleComponent
} from '../../code-examples/code-example.component';

@Component({
  selector: 'code-example-fixture',
  template: `
    <sky-docs-code-example
      heading="My code example"
      sourceCodePath="src/app/public/plugin-resources/foobar"
      [theme]="theme"
    >
    </sky-docs-code-example>`
})
export class CodeExampleFixtureComponent {

  public theme: string;

  @ViewChildren(SkyDocsCodeExampleComponent)
  public codeExampleComponents: QueryList<SkyDocsCodeExampleComponent>;

}

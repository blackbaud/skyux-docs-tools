import { Component, ViewChild } from '@angular/core';

import { SkyDocsCodeExampleComponent } from '../code-example.component';

@Component({
  selector: 'sky-code-example-fixture',
  template: ` <sky-docs-code-example
    heading="My code example"
    sourceCodePath="src/app/public/plugin-resources/foobar"
    [theme]="theme"
  >
  </sky-docs-code-example>`,
  standalone: false,
})
export class CodeExampleFixtureComponent {
  public theme: string;

  @ViewChild(SkyDocsCodeExampleComponent)
  public codeExampleComponents: SkyDocsCodeExampleComponent;
}

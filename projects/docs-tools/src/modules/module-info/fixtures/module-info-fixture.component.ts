import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-module-info-fixture',
  templateUrl: './module-info-fixture.component.html',
  standalone: false,
})
export class ModuleInfoFixtureComponent {
  @Input()
  public gitRepoUrl: string | undefined;

  @Input()
  public moduleName: string | undefined;

  @Input()
  public packageName: string | undefined;

  @Input()
  public packageUrl: string | undefined;
}

import { Component } from '@angular/core';

@Component({
  selector: 'sky-demo-page-fixture',
  templateUrl: './demo-page.component.fixture.html',
  standalone: false,
})
export class DemoPageFixtureComponent {
  public additionalPaths = false;
  public pageTitle = 'Sample docs';
}

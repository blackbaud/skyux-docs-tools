import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleInfoFixtureComponent } from './fixtures/module-info-fixture.component';
import { ModuleInfoFixturesModule } from './fixtures/module-info-fixtures.module';

import { expect } from '@skyux-sdk/testing';
import { By } from '@angular/platform-browser';
import { SkyDocsToolsOptions } from '../shared/docs-tools-options';

describe('Module info component', () => {
  function validateExternalLink(
    fixture: ComponentFixture<ModuleInfoFixtureComponent>,
    index: number,
    expectedText: string,
    expectedUrl: string,
  ) {
    const linkEl = fixture.debugElement.queryAll(
      By.css('.sky-docs-module-info-external-link'),
    )[index].nativeElement;

    expect(linkEl).toHaveText(expectedText);
    expect(linkEl.href).toBe(expectedUrl);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModuleInfoFixturesModule],
    });
  });

  it('should display the module name', () => {
    const fixture = TestBed.createComponent(ModuleInfoFixtureComponent);

    fixture.componentInstance.moduleName = 'Module name';
    fixture.detectChanges();

    const moduleNameEl = fixture.debugElement.query(
      By.css('.sky-docs-module-info-module-name'),
    ).nativeElement;

    expect(moduleNameEl).toHaveText('Module name');
  });

  it('should display the NPM link with the provided package name', () => {
    const fixture = TestBed.createComponent(ModuleInfoFixtureComponent);

    fixture.componentInstance.packageName = '@example/repo';
    fixture.detectChanges();

    validateExternalLink(
      fixture,
      0,
      'View in NPM',
      'https://npmjs.org/package/@example/repo',
    );
  });

  it('should display the repo link with the provided URL', () => {
    const fixture = TestBed.createComponent(ModuleInfoFixtureComponent);

    fixture.componentInstance.packageName = '@example/repo';
    fixture.componentInstance.gitRepoUrl = 'https://example.com/repo-url/';
    fixture.detectChanges();

    validateExternalLink(
      fixture,
      1,
      'View in GitHub',
      'https://example.com/repo-url/',
    );
  });

  it('should fall back to options properties', () => {
    TestBed.overrideComponent(ModuleInfoFixtureComponent, {
      add: {
        providers: [
          {
            provide: SkyDocsToolsOptions,
            useFactory: () => {
              const options = new SkyDocsToolsOptions();
              options.gitRepoUrl = 'https://example.com/repo-url-from-options/';
              options.packageName = '@example/repo-from-options';

              return options;
            },
          },
        ],
      },
    });

    const fixture = TestBed.createComponent(ModuleInfoFixtureComponent);
    fixture.detectChanges();

    validateExternalLink(
      fixture,
      0,
      'View in NPM',
      'https://npmjs.org/package/@example/repo-from-options',
    );

    validateExternalLink(
      fixture,
      1,
      'View in GitHub',
      'https://example.com/repo-url-from-options/',
    );
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMediaQueryService } from '@skyux/core';

import { MockSkyMediaQueryService } from '@skyux/core/testing';

import { expect } from '@skyux-sdk/testing';

import { DirectiveDefinitionFixtureComponent } from './fixtures/directive-definition.component.fixture';

import { TypeDefinitionsFixturesModule } from './fixtures/type-definitions.module.fixture';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

describe('Directive definition component', function () {
  let fixture: ComponentFixture<DirectiveDefinitionFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypeDefinitionsFixturesModule],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: {
            anchorIds: {
              FooUser: 'foo-user',
            },
            typeDefinitions: [
              {
                name: 'FooUser',
              },
            ],
          },
        },
      ],
    });

    fixture = TestBed.createComponent(DirectiveDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const directiveDefinitionRef =
      fixture.componentInstance.directiveDefinitionRef;
    expect(directiveDefinitionRef.config).toBeUndefined();
  });

  it('should display the selector', () => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'FooComponent',
      selector: 'app-foo',
      hasPreviewFeatures: false,
    };

    fixture.detectChanges();

    let selectorElement = fixture.nativeElement.querySelector(
      '.sky-docs-directive-selector',
    );

    expect(selectorElement.innerText).toEqual('app-foo');
  });

  it('should order Input properties first and then Output properties', () => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'FooComponent',
      selector: 'app-foo',
      hasPreviewFeatures: false,
      inputProperties: [
        {
          name: 'config',
          decorator: {
            name: 'Input',
          },
          isOptional: true,
          isPreview: false,
          type: {
            type: 'reference',
            name: 'Config',
          },
        },
      ],
      eventProperties: [
        {
          name: 'click',
          decorator: {
            name: 'Output',
          },
          isOptional: true,
          isPreview: false,
          type: {
            type: 'reference',
            name: 'EventEmitter',
            typeArguments: [
              {
                type: 'intrinsic',
                name: 'string',
              },
            ],
          },
        },
      ],
    };

    fixture.detectChanges();

    const rowElements = fixture.nativeElement.querySelectorAll(
      '.sky-docs-property-definitions-table-cell-name',
    );

    expect(rowElements.item(0).innerText.replace(/\r?\n|\r/g, '')).toEqual(
      'config?: Config',
    );
    expect(rowElements.item(1).innerText.replace(/\r?\n|\r/g, '')).toEqual(
      'click: EventEmitter<string>',
    );
  });

  it('should display Output properties if Inputs do not exist', () => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'FooComponent',
      selector: 'app-foo',
      hasPreviewFeatures: false,
      eventProperties: [
        {
          name: 'click',
          decorator: {
            name: 'Output',
          },
          isOptional: false,
          isPreview: false,
          type: {},
        },
      ],
    };

    fixture.detectChanges();

    const rowElements = fixture.nativeElement.querySelectorAll(
      '.sky-docs-property-definitions-table-cell-name',
    );

    expect(rowElements.item(0).innerText).toBe('click: any');
  });

  it('should add links to types within description', () => {
    fixture.componentInstance.config = {
      anchorId: 'component-foocomponent',
      name: 'FooComponent',
      description: 'This description has a [[FooUser]].',
      hasPreviewFeatures: false,
      selector: 'app-foo',
    };

    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-directive-definition-description',
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
    );
  });
});

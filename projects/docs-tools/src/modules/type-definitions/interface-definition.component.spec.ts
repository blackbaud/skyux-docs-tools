import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { InterfaceDefinitionFixtureComponent } from './fixtures/interface-definition.component.fixture';

import { TypeDefinitionsFixturesModule } from './fixtures/type-definitions.module.fixture';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

describe('Interface definition component', function () {
  let fixture: ComponentFixture<InterfaceDefinitionFixtureComponent>;

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

    fixture = TestBed.createComponent(InterfaceDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const interfaceDefinitionRef =
      fixture.componentInstance.interfaceDefinitionRef;
    expect(interfaceDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a FooUser.',
      hasPreviewFeatures: false,
      properties: [
        {
          isOptional: true,
          isPreview: false,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-interface-definition-description',
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
    );
  }));

  it('should add links to types within property descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: '',
      hasPreviewFeatures: false,
      properties: [
        {
          description: 'This description has a FooUser.',
          isOptional: true,
          isPreview: false,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description',
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
    );
  }));

  it('should display call signature types', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a FooUser.',
      hasPreviewFeatures: false,
      properties: [
        {
          isOptional: true,
          isPreview: false,
          name: 'foo',
          type: {
            callSignature: {
              returnType: {
                type: 'array',
                name: 'string',
              },
              parameters: [
                {
                  isOptional: false,
                  name: 'userId',
                  type: {
                    type: 'intrinsic',
                    name: 'number',
                  },
                },
              ],
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const nameElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name:first-child',
    );

    expect(nameElement.textContent).toEqual(
      'foo?: (userId: number) => string[]',
    );
  }));
});

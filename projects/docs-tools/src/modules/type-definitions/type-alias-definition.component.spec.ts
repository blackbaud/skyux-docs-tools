import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { TypeAliasDefinitionFixtureComponent } from './fixtures/type-alias-definition.component.fixture';

import { TypeDefinitionsFixturesModule } from './fixtures/type-definitions.module.fixture';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

function getPreviewWarning(
  fixture: ComponentFixture<TypeAliasDefinitionFixtureComponent>,
): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '.sky-docs-type-alias-definition .sky-docs-type-alias-preview-warning',
  );
}

describe('Type alias definition component', function () {
  let fixture: ComponentFixture<TypeAliasDefinitionFixtureComponent>;

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

    fixture = TestBed.createComponent(TypeAliasDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const typeAliasDefinitionRef =
      fixture.componentInstance.typeAliasDefinitionRef;
    expect(typeAliasDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a FooUser.',
      isPreview: false,
      type: {
        callSignature: {
          returnType: {
            type: 'reference',
            name: 'FooUser',
          },
        },
      },
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-type-alias-definition-description',
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
    );
  }));

  it('should mark a method as preview', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a FooUser.',
      isPreview: true,
      type: {
        callSignature: {
          returnType: {
            type: 'reference',
            name: 'FooUser',
          },
        },
      },
    };

    fixture.detectChanges();
    tick();

    const previewWarning = getPreviewWarning(fixture);

    expect(previewWarning).not.toBeNull();
  }));

  it('should not mark a method as preview when not in preview', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a FooUser.',
      isPreview: false,
      type: {
        callSignature: {
          returnType: {
            type: 'reference',
            name: 'FooUser',
          },
        },
      },
    };

    fixture.detectChanges();
    tick();

    const previewWarning = getPreviewWarning(fixture);

    expect(previewWarning).toBeNull();
  }));
});

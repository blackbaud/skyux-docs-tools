import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { MethodDefinitionsFixtureComponent } from './fixtures/method-definitions.component.fixture';

import { TypeDefinitionsFixturesModule } from './fixtures/type-definitions.module.fixture';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

function getPreviewWarnings(
  fixture: ComponentFixture<MethodDefinitionsFixtureComponent>
): NodeListOf<HTMLElement> {
  return (fixture.nativeElement as HTMLElement).querySelectorAll(
    '.sky-docs-standard-method-definitions .sky-docs-method-definition-preview-warning'
  );
}

describe('Method definitions component', function () {
  let fixture: ComponentFixture<MethodDefinitionsFixtureComponent>;

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

    fixture = TestBed.createComponent(MethodDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const methodDefinitionsRef = fixture.componentInstance.methodDefinitionsRef;
    expect(methodDefinitionsRef.config).toEqual({});
  });

  it('should denote static methods', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
          description: 'This description has a FooUser.',
          isStatic: true,
          isPreview: false,
          type: {
            callSignature: {
              returnType: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const staticTable = fixture.nativeElement.querySelector(
      '.sky-docs-static-method-definitions'
    );
    const standardTable = fixture.nativeElement.querySelector(
      '.sky-docs-standard-method-definitions'
    );

    expect(staticTable).not.toBeNull();
    expect(standardTable).toBeNull();

    const methodElement = staticTable.querySelector('.sky-docs-code-block');

    expect(methodElement.innerText).toContain('public static ');
  }));

  it('should mark a method as preview', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
          description: 'This description has a FooUser.',
          isStatic: false,
          isPreview: true,
          type: {
            callSignature: {
              returnType: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const previewWarnings = getPreviewWarnings(fixture);

    expect(previewWarnings.length).toBe(1);
  }));

  it('should not mark a method as preview when not in preview', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
          description: 'This description has a FooUser.',
          isStatic: false,
          isPreview: false,
          type: {
            callSignature: {
              returnType: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const previewWarnings = getPreviewWarnings(fixture);

    expect(previewWarnings.length).toBe(0);
  }));

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
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
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-method-definition-description'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types within deprecation warning', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
          deprecationWarning: 'This description has a FooUser.',
          isPreview: false,
          type: {
            callSignature: {
              returnType: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-method-definition-deprecation-warning'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should handle no methods being given', fakeAsync(() => {
    fixture.componentInstance.config = {};

    fixture.detectChanges();
    tick();

    expect(
      fixture.nativeElement.querySelector('.sky-docs-method-definitions')
    ).toBeNull();
  }));
});

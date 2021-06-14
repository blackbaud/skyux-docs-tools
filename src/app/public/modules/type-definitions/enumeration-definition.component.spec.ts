import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  EnumerationDefinitionFixtureComponent
} from './fixtures/enumeration-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Enumeration definition component', function () {

  let fixture: ComponentFixture<EnumerationDefinitionFixtureComponent>;
  let mockMediaQueryService: MockSkyMediaQueryService;

  beforeEach(() => {
    mockMediaQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      imports: [
        TypeDefinitionsFixturesModule
      ],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: {
            anchorIds: {
              'FooUser': 'foo-user'
            },
            typeDefinitions: [
              {
                name: 'FooUser'
              }
            ]
          }
        },
        {
          provide: SkyMediaQueryService,
          useValue: mockMediaQueryService
        }
      ]
    });

    fixture = TestBed.createComponent(EnumerationDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const enumerationDefinitionRef = fixture.componentInstance.enumerationDefinitionRef;
    expect(enumerationDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a FooUser.',
      members: [
        {
          name: 'Bar'
        }
      ]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-enumeration-definition-description'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should parse markdown within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: 'This description has a `Date`.',
      members: [
        {
          name: 'Bar'
        }
      ]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-enumeration-definition-description'
    );

    expect(element.innerHTML).toContain(
      '<code>Date</code>'
    );
  }));

  it('should add links to types within property descriptions', fakeAsync(() => {
    fixture.componentInstance.config = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      description: '',
      members: [
        {
          description: 'This description has a FooUser.',
          name: 'Bar'
        }
      ]
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

});

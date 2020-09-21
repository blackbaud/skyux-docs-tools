import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ClassDefinitionFixtureComponent
} from './fixtures/class-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Class definition component', function () {

  let fixture: ComponentFixture<ClassDefinitionFixtureComponent>;

  beforeEach(() => {
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
        }
      ]
    });

    fixture = TestBed.createComponent(ClassDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const classDefinitionRef = fixture.componentInstance.classDefinitionRef;
    expect(classDefinitionRef.config).toBeUndefined();
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooService',
      comment: {
        shortText: 'This description has a FooUser.'
      }
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-class-definition-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should separate properties from methods', () => {
    fixture.componentInstance.config = {
      name: 'FooClass',
      children: [
        {
          name: 'foo',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        },
        {
          name: 'getFoo',
          kindString: 'Method',
          signatures: [{
            name: 'getFoo',
            kindString: 'Call signature',
            type: {
              type: 'intrinsic',
              name: 'string'
            }
          }]
        },
        {
          name: 'ngOnDestroy',
          kindString: 'Method',
          signatures: [{
            name: 'ngOnDestroy',
            kindString: 'Call signature',
            type: {
              type: 'intrinsic',
              name: 'void'
            }
          }]
        }
      ]
    };

    fixture.detectChanges();

    const classDefinitionComponent = fixture.componentInstance.classDefinitionRef;
    expect(classDefinitionComponent.properties.length).toEqual(1);
    expect(classDefinitionComponent.properties[0].name).toEqual('foo');
    expect(classDefinitionComponent.methods.length).toEqual(1, 'Angular ngOnDestroy methods should be removed!');
    expect(classDefinitionComponent.methods[0].name).toEqual('getFoo');
  });

});

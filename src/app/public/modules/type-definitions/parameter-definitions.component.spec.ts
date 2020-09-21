import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ParameterDefinitionsFixtureComponent
} from './fixtures/parameter-definitions.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  TypeDocEntryChild
} from './typedoc-types';

describe('Parameter definitions component', function () {

  let fixture: ComponentFixture<ParameterDefinitionsFixtureComponent>;
  let mockConfig: TypeDocEntryChild;

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

    mockConfig = {
      name: 'getFooById',
      kindString: 'Method',
      signatures: [{
        name: 'getFooById',
        kindString: 'Call signature',
        comment: {
          shortText: 'Returns a FooUser by ID.'
        },
        parameters: [
          {
            name: 'id',
            comment: {
              text: 'The numeric ID of a FooUser.'
            },
            type: {
              type: 'intrinsic',
              name: 'number'
            },
            defaultValue: 'new FooUser()'
          }
        ],
        type: {
          type: 'reference',
          name: 'FooUser'
        }
      }]
    };

    fixture = TestBed.createComponent(ParameterDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const parameterDefinitionsRef = fixture.componentInstance.parameterDefinitionsRef;
    expect(parameterDefinitionsRef.config).toBeUndefined();
  });

  it('should display default value', () => {
    fixture.componentInstance.config = mockConfig;

    fixture.detectChanges();

    const optionalElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-label-optional'
    );

    expect(optionalElement.innerText).toContain(
      'Optional. Default is new FooUser().'
    );
  });

  it('should add links around parameter types', () => {
    mockConfig.signatures[0].parameters = [
      {
        name: 'user',
        type: {
          type: 'reference',
          name: 'FooUser'
        }
      }
    ];

    fixture.componentInstance.config = mockConfig;

    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-header'
    );

    expect(nameElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  });

  it('should add links around default value', () => {
    fixture.componentInstance.config = mockConfig;

    fixture.detectChanges();

    const optionalElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-label-optional'
    );

    expect(optionalElement.innerHTML).toContain(
      'new <a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>()'
    );
  });

  // it('should add links to types within parameter descriptions', fakeAsync(() => {
  //   fixture.componentInstance.config = {
  //     name: 'getFooById',
  //     kindString: 'Method',
  //     signatures: [{
  //       name: 'getFooById',
  //       kindString: 'Call signature',
  //       comment: {
  //         shortText: 'Returns a FooUser by ID.'
  //       },
  //       parameters: [
  //         {
  //           name: 'id',
  //           comment: {
  //             text: 'The numeric ID of a FooUser.'
  //           },
  //           type: {
  //             type: 'intrinsic',
  //             name: 'number'
  //           }
  //         }
  //       ],
  //       type: {
  //         type: 'reference',
  //         name: 'FooUser'
  //       }
  //     }]
  //   };

  //   fixture.detectChanges();
  //   tick();

  //   const descriptionElement = fixture.nativeElement.querySelector(
  //     '.sky-docs-parameter-definition-description'
  //   );

  //   expect(descriptionElement.innerHTML).toContain(
  //     '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
  //   );
  // }));

  it('should format parameters with call signature types', () => {
    mockConfig.signatures[0].parameters = [
      {
        name: 'foobar',
        type: {
          type: 'reflection',
          declaration: {
            signatures: [
              {
                name: '__call',
                kindString: 'Call signature',
                parameters: [
                  {
                    name: 'users',
                    type: {
                      type: 'array',
                      elementType: {
                        type: 'reference',
                        name: 'FooUser'
                      }
                    }
                  },
                  {
                    name: 'search',
                    type: {
                      type: 'reflection',
                      declaration: {
                        signatures: [{
                          name: '__call',
                          kindString: 'Call signature',
                          parameters: [],
                          type: {
                            type: 'reference',
                            name: 'FooUser'
                          }
                        }]
                      }
                    }
                  }
                ],
                type: {
                  type: 'intrinsic',
                  name: 'void'
                }
              }
            ]
          }
        }
      }
    ];

    fixture.componentInstance.config = mockConfig;

    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-header'
    );

    expect(nameElement.textContent).toEqual(
      'foobar?: (users?: FooUser[], search?: () => FooUser) => void'
    );
  });

});

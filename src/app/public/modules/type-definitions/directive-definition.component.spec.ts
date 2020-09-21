import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DirectiveDefinitionFixtureComponent
} from './fixtures/directive-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Directive definition component', function () {

  let fixture: ComponentFixture<DirectiveDefinitionFixtureComponent>;

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

    fixture = TestBed.createComponent(DirectiveDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const directiveDefinitionRef = fixture.componentInstance.directiveDefinitionRef;
    expect(directiveDefinitionRef.config).toBeUndefined();
  });

  it('should display the selector', () => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      decorators: [{
        name: 'Component',
        type: {},
        arguments: {
          obj: 'selector: \'app-foo\''
        }
      }]
    };

    fixture.detectChanges();

    let selectorElement = fixture.nativeElement.querySelector('.sky-docs-directive-selector');

    expect(selectorElement.innerText).toEqual('app-foo');

    // Use backticks for the selector name.
    fixture.componentInstance.config = {
      name: 'FooComponent',
      decorators: [{
        name: 'Component',
        type: {},
        arguments: {
          obj: 'selector: `app-foo-backticks`'
        }
      }]
    };

    fixture.detectChanges();

    selectorElement = fixture.nativeElement.querySelector('.sky-docs-directive-selector');

    expect(selectorElement.innerText).toEqual('app-foo-backticks');
  });

  it('should order Input properties first and then Output properties', () => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      decorators: [{
        name: 'Component',
        type: {},
        arguments: {
          obj: 'selector: \'app-foo\''
        }
      }],
      children: [
        {
          name: 'click',
          kindString: 'Property',
          decorators: [{
            name: 'Output',
            type: {
              type: 'reference',
              name: 'Output'
            }
          }],
          type: {
            type: 'reference',
            typeArguments: [{
              type: 'intrinsic',
              name: 'string'
            }],
            name: 'EventEmitter'
          }
        },
        {
          name: 'complexConfig',
          kindString: 'Property',
          decorators: [{
            arguments: {
              bindingPropertyName: '\'config\''
            },
            name: 'Input',
            type: {
              type: 'reference',
              name: 'Input'
            }
          }],
          type: {
            type: 'reference',
            typeArguments: [{
              type: 'unknown',
              name: 'U'
            }],
            name: 'Config'
          }
        }
      ]
    };

    fixture.detectChanges();

    const rowElements = fixture.nativeElement.querySelectorAll('.sky-docs-property-definitions-table-cell-name');

    expect(rowElements.item(0).innerText).toEqual('@Input()\nconfig?: Config<U>');
    expect(rowElements.item(1).innerText).toEqual('@Output()\nclick?: EventEmitter<string>');
  });

  it('should display Output properties if Inputs do not exist', () => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      decorators: [{
        name: 'Component',
        type: {},
        arguments: {
          obj: 'selector: \'app-foo\''
        }
      }],
      children: [
        {
          name: 'click',
          kindString: 'Property',
          decorators: [{
            name: 'Output',
            type: {
              type: 'reference',
              name: 'Output'
            }
          }],
          type: {
            type: 'reference',
            typeArguments: [{
              type: 'intrinsic',
              name: 'string'
            }],
            name: 'EventEmitter'
          }
        }
      ]
    };

    fixture.detectChanges();

    const rowElements = fixture.nativeElement.querySelectorAll('.sky-docs-property-definitions-table-cell-name');

    expect(rowElements.item(0).innerText).toContain('@Output()');
  });

  it('should add links to types within description', () => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      comment: {
        shortText: 'This description has a [[FooUser]].'
      },
      decorators: [{
        name: 'Component',
        type: {},
        arguments: {
          obj: 'selector: \'app-foo\''
        }
      }]
    };

    fixture.detectChanges();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-directive-definition-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  });

});

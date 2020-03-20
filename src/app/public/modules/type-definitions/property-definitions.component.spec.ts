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
  PropertyDefinitionsFixtureComponent
} from './fixtures/property-definitions.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Property definitions component', function () {

  let fixture: ComponentFixture<PropertyDefinitionsFixtureComponent>;

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

    fixture = TestBed.createComponent(PropertyDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const propertyDefinitionRef = fixture.componentInstance.propertyDefinitionRef;
    expect(propertyDefinitionRef.defaultValue).toBeUndefined();
    expect(propertyDefinitionRef.deprecationWarning).toBeUndefined();
    expect(propertyDefinitionRef.isOptional).toEqual(false);
    expect(propertyDefinitionRef.propertyDecorator).toBeUndefined();
    expect(propertyDefinitionRef.propertyName).toBeUndefined();
    expect(propertyDefinitionRef.propertyType).toBeUndefined();
    expect(propertyDefinitionRef.templateRef).toBeDefined();
  });

  it('should display the property\'s signature', fakeAsync(() => {
    fixture.componentInstance.defaultValue = 'string';
    fixture.componentInstance.isOptional = true;
    fixture.componentInstance.propertyDecorator = 'Input';
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';

    fixture.detectChanges();
    tick();

    const signatureElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name'
    );

    expect(signatureElement.textContent).toEqual('@Input()foobar: number');
  }));

  it('should display deprecation messages', fakeAsync(() => {
    fixture.componentInstance.deprecationWarning = 'Do not use this feature.';
    fixture.componentInstance.description = 'This is the description.';
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description .sky-text-warning'
    );

    expect(descriptionElement.innerText).toContain(
      'Deprecated. Do not use this feature.'
    );
  }));

  it('should add links within deprecation messages', fakeAsync(() => {
    fixture.componentInstance.deprecationWarning = 'Use [[FooUser]] instead.';
    fixture.componentInstance.description = 'This is the description.';
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description .sky-text-warning'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a href="#foo-user" class="sky-docs-anchor-link">FooUser</a>'
    );
  }));

});

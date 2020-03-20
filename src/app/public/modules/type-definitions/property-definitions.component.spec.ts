import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  PropertyDefinitionsFixtureComponent
} from './fixtures/property-definitions.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

describe('Property definitions component', function () {

  let fixture: ComponentFixture<PropertyDefinitionsFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TypeDefinitionsFixturesModule
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

});

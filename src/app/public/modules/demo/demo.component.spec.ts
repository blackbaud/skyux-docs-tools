import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAuthTokenProvider
} from '@skyux/http';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DemoFixturesModule
} from './fixtures/demo-fixtures.module';

import {
  DemoFixtureComponent
} from './fixtures/demo.component.fixture';

import {
  DemoAuthTokenMockProvider
} from './fixtures/demo-auth-token-mock-provider';

describe('Demo component', () => {

  let fixture: ComponentFixture<DemoFixtureComponent>;

  function showControlPanel(): void {
    const headingButton = fixture.nativeElement.querySelector('[data-test-selector="sky-docs-demo-heading-button"]');
    headingButton.click();
    fixture.detectChanges();
  }

  function resetControlPanel(): void {
    const resetButton = fixture.nativeElement.querySelector('[data-test-selector="sky-docs-demo-control-panel-reset-button"]');
    resetButton.click();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DemoFixturesModule
      ]
    });

    fixture = TestBed.createComponent(DemoFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const demoComponentRef = fixture.componentInstance.demoComponentRef;
    expect(demoComponentRef.alignContents).toEqual('left');
    expect(demoComponentRef.heading).toBeUndefined();
  });

  it('should align contents left or center', () => {
    fixture.componentInstance.alignContents = 'center';
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('.sky-docs-demo-viewport');
    expect(viewport).toHaveCssClass('sky-docs-demo-viewport-align-center');
  });

  it('should allow for custom headings', () => {
    fixture.detectChanges();

    const headingElement = fixture.nativeElement.querySelector('[data-test-selector="sky-docs-demo-heading-text"]');

    fixture.componentInstance.heading = undefined;
    fixture.detectChanges();

    expect(headingElement).toHaveText('Demo');

    fixture.componentInstance.heading = 'Foobar';
    fixture.detectChanges();

    expect(headingElement).toHaveText('Foobar');
  });

  describe('control panel component', () => {
    it('should expose a `reset` emitter', () => {
      const spy = spyOn(fixture.componentInstance, 'onDemoReset').and.callThrough();
      fixture.detectChanges();

      showControlPanel();
      resetControlPanel();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe events when checkboxes/radios change', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const demoControlPanelComponentRef = fixture.componentInstance.demoControlPanelComponentRef;
      const unsubscribeSpy = spyOn(demoControlPanelComponentRef['eventListeners'], 'unsubscribe').and.callThrough();

      fixture.componentInstance.changeFormControls();
      fixture.detectChanges();
      tick();

      expect(unsubscribeSpy).toHaveBeenCalled();
    }));

    it('should emit value changes for controls', fakeAsync(() => {
      const selectionSpy = spyOn(fixture.componentInstance, 'onDemoSelectionChange').and.callThrough();

      fixture.detectChanges();
      tick();

      showControlPanel();

      fixture.detectChanges();
      tick();

      // It should emit on load with the initial values.
      expect(selectionSpy.calls.allArgs()).toEqual([
        [{ backgroundColor: '#f00' }],
        [{ user: { name: 'John' } }],
        [{ showIcon: true }]
      ]);

      selectionSpy.calls.reset();

      // Click the "Green" radio.
      fixture.nativeElement.querySelector('input[value="#0f0"]').click();

      // Click the "Jane" radio input.
      fixture.nativeElement.querySelectorAll('input[name="user"]').item(1).click();

      // Click the "Show icon" checkbox.
      fixture.nativeElement.querySelector('input[type="checkbox"]').click();

      fixture.detectChanges();
      tick();

      expect(selectionSpy.calls.allArgs()).toEqual([
        [{ backgroundColor: '#0f0' }],
        [{ user: { name: 'Jane' } }],
        [{ showIcon: false }]
      ]);

      selectionSpy.calls.reset();

      resetControlPanel();

      fixture.detectChanges();
      tick();

      // Resetting the controls should emit their original values.
      expect(selectionSpy.calls.allArgs()).toEqual([
        [{ showIcon: true }],
        [{ backgroundColor: '#f00' }],
        [{ user: { name: 'John' } }]
      ]);
    }));

    it('should hide the theme control panel when theming is disabled or a Blackbaud employee is not signed in', () => {
      function getThemeEl(): DebugElement {
        return fixture.debugElement.query(
          By.css('sky-docs-demo-control-panel-theme')
        );
      }

      fixture.detectChanges();

      showControlPanel();

      fixture.detectChanges();

      expect(getThemeEl()).not.toExist();

      // The mock auth token provider should return a JWT that indicates the user is not a Blackbaud employee, so the
      // picker should still not be rendered.
      fixture.componentInstance.supportsTheming = true;

      fixture.detectChanges();

      expect(getThemeEl()).not.toExist();
    });

    it('should show the theme control panel when theming is enabled and a Blackbaud employee is signed in', fakeAsync(() => {
      function getThemeEl(): DebugElement {
        return fixture.debugElement.query(
          By.css('sky-docs-demo-control-panel-theme')
        );
      }

      const mockAuthProvider = TestBed.get(SkyAuthTokenProvider) as DemoAuthTokenMockProvider;

      mockAuthProvider.testToken = {
        '1bb.perms': [1]
      };

      fixture.detectChanges();

      showControlPanel();

      fixture.detectChanges();

      expect(getThemeEl()).not.toExist();

      fixture.componentInstance.supportsTheming = true;

      fixture.detectChanges();

      // Need to call tick() and detectChanges() to flush the auth token mock's Promise and apply the result
      // to the view.
      tick();
      fixture.detectChanges();

      expect(getThemeEl()).toExist();
    }));
  });
});

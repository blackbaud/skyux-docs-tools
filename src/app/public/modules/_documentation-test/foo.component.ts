import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import {
  FooEnum
} from './foo-enum';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for FooComponent.
 * @example
 * ```
 * <app-foo [baz]="true"></app-foo>
 * ```
 */
@Component({
  selector: 'app-foo',
  template: ''
})
export class FooComponent<U extends FooUser> implements OnInit {

  /**
   * @required
   */
  @Input()
  public alphabeticallyFirst: boolean;

  /**
   * This is the description for foo input. You must provide [[FooEnum]] values.
   */
  @Input()
  public foo: FooEnum;

  @Input()
  public user: U;

  /**
   * @default 'foobar'
   */
  @Input()
  public sample: string;

  /**
   * This is the description for baz input.
   * @example
   * ```
   * <app-foo [baz]="true"></app-foo>
   * ```
   */
  @Input()
  public baz: boolean = false;

  /**
   * This is the description for bar input. You must provide `FooEnum` values. If you provide FooEnum.Baz amazing things will happen.
   * @defaultValue FooEnum.Foo
   */
  @Input()
  public set bar(value: string) {
    this._bar = value;
  }

  public get bar(): string {
    return this._bar || 'bar';
  }

  /**
   * Use the latest and greatest features for FooPipe!
   * @deprecated This is no longer needed; all new features are available now. Set the `foobar` property on the [[FooPipe]] instead.
   */
  @Input()
  public experimental: boolean = false;

  /**
   * @param searchTerm The keywords used to search.
   * @param debounceTime The number of milliseconds to wait between each keypress.
   * @required
   */
  @Input()
  public searchFunction: (searchTerm: string, debounceTime?: number) => any[];

  /**
   * This is the description for the click event.
   * @example
   * ```
   * <app-foo (click)="onClick($event)"></app-foo>
   * ```
   */
  @Output()
  public click = new EventEmitter<FooUser>();

  /**
   * This property doesn't include a deprecation message.
   * @deprecated
   */
  @Output()
  public newUser = new EventEmitter<U>();

  @Output()
  public rows = new EventEmitter<any[]>();

  @Output()
  public stream = new EventEmitter<Array<string> | Observable<Array<string>>>();

  /**
   * @internal
   */
  @Input()
  public internalConfig: any;

  /**
   * @required
   */
  @Input()
  public requiredProperty: boolean = false;

  /**
   * Fires when a user is selected.
   */
  @Output()
  public get change(): Observable<FooUser> {
    return of({
      firstName: 'Foo',
      lastName: 'Bar'
    });
  }

  /* tslint:disable-next-line:no-input-rename */
  @Input('foobarBinding')
  public foobarProperty: string;

  public propertyShouldNotBeDocumented: string;

  private _bar: string;

  public ngOnInit(): void { }
}

import {
  EventEmitter
} from '@angular/core';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for FooClass.
 */
export class FooClass {

  public get foo(): number {
    return this._foo || 10;
  }

  /**
   * The foo of the FooClass.
   * @default 10
   */
  public set foo(value: number) {
    this._foo = value;
  }

  /**
   * This is the description for `publicProperty`.
   */
  public publicProperty: string = 'foobar';

  public unionType: FooUser | string;

  public unionTypeEventEmitter: EventEmitter<FooUser | string>;

  private _foo: number;

  /**
   * This is the description for `getValue()`.
   */
  public getValue(): string {
    return 'Hello, World.';
  }

  public getEmail(locale: string = 'en-US'): string {
    return 'email@domain.com';
  }

}

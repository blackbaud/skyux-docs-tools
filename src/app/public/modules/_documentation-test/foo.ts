import {
  FooUser
} from './foo-user';

/**
 * This is the description for Foo interface.
 */
export interface Foo<T, U extends FooUser> {

  user: FooUser;

  /**
   * This is the description for bar.
   */
  bar: T;

  /**
   * Gets a user from the database.
   * @param id The unique identifier.
   * @param locale The locale of the user.
   */
  getUser: (id: string, locale?: string) => FooUser;

  /**
   * This is the description for baz.
   */
  baz?: U;

  /**
   * Allow any other properties.
   */
  [_: string]: any;
}

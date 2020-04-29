import {
  BehaviorSubject
} from 'rxjs';

export class RestrictedViewAuthMockService {

  public isAuthenticated = new BehaviorSubject<boolean>(false);

}

import { Injectable } from '@angular/core';

import { TypeDocEntry, TypeDocModule } from './typedoc-types';

@Injectable()
export class SkyDocsTypeDefinitionsProvider {
  public readonly anchorIds: { [_: string]: string };

  public readonly typeDefinitions: Array<TypeDocEntry | TypeDocModule>;
}

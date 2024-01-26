import { Injectable } from '@angular/core';
import { SkySourceCodeDependencies } from './source-code-dependencies';

@Injectable({
  providedIn: 'any',
})
export class SkyDocsSourceCodeProvider {
  public readonly sourceCode: any[];
  public readonly dependencies: {
    [examplePath: string]: SkySourceCodeDependencies;
  } = {};
}

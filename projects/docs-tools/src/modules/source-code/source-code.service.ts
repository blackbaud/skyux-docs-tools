import { Injectable } from '@angular/core';

import { SkyDocsSourceCodeFile } from './source-code-file';

import { SkyDocsSourceCodeProvider } from './source-code-provider';
import { SkySourceCodeDependencies } from './source-code-dependencies';

@Injectable({
  providedIn: 'any',
})
export class SkyDocsSourceCodeService {
  constructor(private sourceCodeProvider: SkyDocsSourceCodeProvider) {}

  public getSourceCodeDependencies(path: string): SkySourceCodeDependencies {
    return this.sourceCodeProvider.dependencies[path.replace(/\/$/, '')] || {};
  }

  public getSourceCode(path: string): SkyDocsSourceCodeFile[] {
    const sourceCode = this.sourceCodeProvider.sourceCode;
    if (!sourceCode || !sourceCode.length) {
      return [];
    }

    return sourceCode.filter((file) => file.filePath.indexOf(path) === 0);
  }
}

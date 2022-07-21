import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
} from '@angular/core';

import { SkyDocsToolsOptions } from '../shared/docs-tools-options';

type ExternalLink = { label: string; url: string };

@Component({
  selector: 'sky-docs-module-info',
  templateUrl: './module-info.component.html',
  styleUrls: ['./module-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsModuleInfoComponent {
  @Input()
  public set gitRepoUrl(value: string) {
    this.#_gitRepoUrl = value || this.#options?.gitRepoUrl;
    this.#updateExternalLinks();
  }

  public get gitRepoUrl() {
    return this.#_gitRepoUrl;
  }

  @Input()
  public moduleName: string;

  @Input()
  public set packageName(value: string) {
    this.#_packageName = value || this.#options?.packageName;
    this.#updateInstallationCommand();
    this.#updateExternalLinks();
  }

  public get packageName() {
    return this.#_packageName;
  }

  @Input()
  public set packageUrl(value: string) {
    this.#_packageUrl = value;
    this.#updateExternalLinks();
  }

  public get packageUrl() {
    return this.#_packageUrl;
  }

  public externalLinks: ExternalLink[];

  public installationCommand: string;

  #options: SkyDocsToolsOptions | undefined;

  #_gitRepoUrl: string;
  #_packageName: string;
  #_packageUrl: string;

  constructor(@Optional() options?: SkyDocsToolsOptions) {
    if (options) {
      this.#options = options;
      this.gitRepoUrl = options.gitRepoUrl;
      this.packageName = options.packageName;
    }
  }

  #updateExternalLinks(): void {
    const externalLinks: ExternalLink[] = [];

    if (this.packageName) {
      externalLinks.push({
        url: this.packageUrl || `https://npmjs.org/package/${this.packageName}`,
        label: 'View in NPM',
      });
    }

    if (this.gitRepoUrl) {
      externalLinks.push({
        url: this.gitRepoUrl,
        label: 'View in GitHub',
      });
    }

    this.externalLinks = externalLinks;
  }

  #updateInstallationCommand(): void {
    this.installationCommand = this.packageName
      ? `npm install --save-exact ${this.packageName}`
      : '';
  }
}

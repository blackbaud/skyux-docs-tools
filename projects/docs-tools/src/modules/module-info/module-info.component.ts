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
  standalone: false,
})
export class SkyDocsModuleInfoComponent {
  @Input()
  public set gitRepoUrl(value: string | undefined) {
    this.gitRepoUrlOrDefault = value || this.#options?.gitRepoUrl;
    this.#updateExternalLinks();
  }

  @Input()
  public moduleName: string | undefined;

  @Input()
  public set packageName(value: string | undefined) {
    this.packageNameOrDefault = value || this.#options?.packageName;
    this.#updateInstallationCommand();
    this.#updateExternalLinks();
  }

  @Input()
  public set packageUrl(value: string | undefined) {
    this.#packageUrl = value;
    this.#updateExternalLinks();
  }

  public gitRepoUrlOrDefault: string | undefined;

  public packageNameOrDefault: string | undefined;

  public externalLinks: ExternalLink[] | undefined;

  public installationCommand: string | undefined;

  #options: SkyDocsToolsOptions | undefined;

  #packageUrl: string | undefined;

  constructor(@Optional() options?: SkyDocsToolsOptions) {
    if (options) {
      this.#options = options;
      this.gitRepoUrl = options.gitRepoUrl;
      this.packageName = options.packageName;
    }
  }

  #updateExternalLinks(): void {
    const externalLinks: ExternalLink[] = [];

    if (this.packageNameOrDefault) {
      externalLinks.push({
        url:
          this.#packageUrl ||
          `https://npmjs.org/package/${this.packageNameOrDefault}`,
        label: 'View in NPM',
      });
    }

    if (this.gitRepoUrlOrDefault) {
      externalLinks.push({
        url: this.gitRepoUrlOrDefault,
        label: 'View in GitHub',
      });
    }

    this.externalLinks = externalLinks;
  }

  #updateInstallationCommand(): void {
    this.installationCommand = this.packageNameOrDefault
      ? `npm install --save-exact ${this.packageNameOrDefault}`
      : '';
  }
}

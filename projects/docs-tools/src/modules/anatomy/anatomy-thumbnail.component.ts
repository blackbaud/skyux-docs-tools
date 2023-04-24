import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sky-docs-anatomy-thumbnail',
  templateUrl: './anatomy-thumbnail.component.html',
  styleUrls: ['./anatomy-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsAnatomyThumbnailComponent {
  @Input()
  public caption: string;

  @Input()
  public captionType: string;

  @Input()
  public imageAlt: string;

  @Input()
  public imageSource: string;

  @Input()
  public videoSource: string;

  @Input()
  public showBorder: boolean = false;
}

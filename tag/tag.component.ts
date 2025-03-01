import {
  Component,
  NgModule,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponentModule } from '../icon/icon.component';
import { CheckboxComponentModule } from '../checkbox/checkbox.component';
import { activityIcon, xCloseIcon } from '@kleos/icons/ui/General';
import { IconRegistry } from '@kleos/icons/util';
import { AvatarComponentModule } from '../avatar/avatar.component';
@Component({
  selector: 'k-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    'size',
    'closable',
    'value',
    'clickable',
    'iconName',
    'iconCategory',
    'avatarUrl',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  size: 'sm' | 'md' | 'lg' = 'md';
  closable = false;
  value?: number;
  clickable = false;
  iconName = 'activity';
  iconCategory = 'general';
  avatarUrl = '';

  @Output() closeTag: EventEmitter<void> = new EventEmitter<void>();
  @Output() checkTag: EventEmitter<void> = new EventEmitter<void>();
  constructor(private registry: IconRegistry) {
    registry.registerIcons([xCloseIcon, activityIcon])
  }

  onCloseClick(): void {
    this.closeTag.emit();
  }

  onChecked(): void {
    this.checkTag.emit();
  }
}

@NgModule({
  imports: [
    CommonModule,
    AvatarComponentModule,
    IconComponentModule,
    CheckboxComponentModule,
  ],
  declarations: [TagComponent],
  exports: [TagComponent, AvatarComponentModule]
})
export class TagComponentModule {}

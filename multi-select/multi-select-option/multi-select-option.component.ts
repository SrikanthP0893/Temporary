import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, Input } from '@angular/core';
import { MultiSelectOption } from '../models/multi-select.model';
import { MultiSelectComponent } from '../multi-select.component';
import { MultiSelectService } from '../multi-select.service';

@Component({
  selector: 'k-multi-select-option',
  template: `
    <div class="k-option-container">
      <div class="k-option-content">
        <k-avatar [size]="'sm'" [imageUrl]="multiSelectOption.image"></k-avatar>
        <span class="title">{{ multiSelectOption.value }}</span>
        <span class="sub-title">{{ multiSelectOption.shortValue }}</span>
      </div>
      <k-icon *ngIf="showIcon" name="check" category="general"></k-icon>
    </div>
  `,
  styleUrls: ['./multi-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectOptionComponent {
  @Input() multiSelectOption!: MultiSelectOption;
  @Input()
  public value!: string;

  @Input()
  public label!: string;

  showIcon!: boolean;

  @HostBinding('class.selected')
  public get selected(): boolean {
    if (
      this.select.selectedOptions.findIndex(
        (comp) => comp.multiSelectOption._id === this.multiSelectOption._id
      ) > -1
    ) {
      this.multiSelectOption.isSelected = true;
      this.showIcon = true;
      return true;
    }
    this.multiSelectOption.isSelected = false;
    this.showIcon = false;
    return false;
  }

  @HostBinding('class.active')
  public active = false;

  private select: MultiSelectComponent;

  constructor(private multiselectSvc: MultiSelectService, private cdref : ChangeDetectorRef) {
    this.select = this.multiselectSvc.getSelect();
  }

  public getLabel(): string {
    return this.value;
  }

  public setActiveStyles(): void {
    this.active = true;
    this.cdref.markForCheck();
  }

  public setInactiveStyles(): void {
    this.active = false;
    this.cdref.markForCheck();
  }

  @HostListener('click', ['$event'])
  public onClick(event: UIEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.select.selectOption(this);
    this.cdref.markForCheck();
  }
}

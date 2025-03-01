import {
  Component,
  OnInit,
  NgModule,
  Input,
  Output,
  ViewChild,
  ElementRef,
  QueryList,
  Optional,
  Self,
  HostListener,
  EventEmitter,
  ViewEncapsulation,
  AfterViewInit,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponentModule } from '../icon/icon.component';
import { CdkPortal, DomPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { MultiSelectService } from './multi-select.service';
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option.component';
import { IconRegistry } from '@kleos/icons/util';
import { checkIcon, searchLgIcon, xCloseIcon } from '@kleos/icons/ui/General';
import { TagComponentModule } from '../tag/tag.component';
import { MultiSelectOption } from './models/multi-select.model';
import { FilterPipe } from './pipes/filter.pipe';
@Component({
  selector: 'k-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['isSearchIconEnable'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements OnInit, AfterViewInit {
  @Input()
  public label!: string;

  @Input()
  public multiSelectOptions!: MultiSelectOption[];

  @Input()
  public selected!: string;

  @Input()
  public selectedValue!: string;

  @Input()
  public placeholder!: string;

  @Input()
  public required = false;

  @Input()
  public disabled = false;

  @Input()
  overlayPanelClass = '';

  isSearchIconEnable = false;

  @Output() selectedOptionChange: EventEmitter<MultiSelectOption[]> =
    new EventEmitter<MultiSelectOption[]>();

  @ViewChild('input')
  public input!: ElementRef;

  @ViewChild('multiselectRef', { static: false })
  public multiselectRef!: ElementRef;

  @ViewChildren(MultiSelectOptionComponent)
  public options!: QueryList<MultiSelectOptionComponent>;

  @ViewChild(CdkPortal)
  public multiSelectOptionsContainer!: CdkPortal;

  public selectedOptions: MultiSelectOptionComponent[] = [];

  protected overlayRef!: OverlayRef;

  public displayText!: string;
  dropdownInptTxt!: FormControl;

  private keyManager!: ActiveDescendantKeyManager<MultiSelectOptionComponent>;

  displayingMultiSelectOptions: MultiSelectOption[] = [];

  host!: DomPortalOutlet;

  showing!: boolean;

  selectedTags: MultiSelectOption[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onChangeFn = (_: unknown) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouchedFn = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private elemRef: ElementRef,
    private multiSelectSvc: MultiSelectService,
    private overlay: Overlay,
    private registry: IconRegistry
  ) {
    registry.registerIcons([searchLgIcon, xCloseIcon, checkIcon])
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
    this.multiSelectSvc.register(this);
  }

  getBaseName(): string {
    return 'k-multi-select';
  }

  ngOnInit(): void {
    this.dropdownInptTxt = new FormControl('');
    this.dropdownInptTxt.valueChanges.subscribe((res) => {
      if (!!res && res.length > 1) {
        this.displayingMultiSelectOptions = [
          ...this.multiSelectOptions
            .filter(
              (option) =>
                option.value.toLowerCase().includes(res.toLowerCase()) ||
                option.shortValue.toLowerCase().includes(res.toLowerCase())
            )
            .sort((a, b) =>
              a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1
            ),
        ];
      } else {
        this.displayingMultiSelectOptions = [
          ...this.multiSelectOptions.sort((a, b) =>
            a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1
          ),
        ];
      }
      if (!this.showing) {
        this.showDropdown();
      }
    });
  }

  public ngAfterViewInit(): void  {
    setTimeout(() => {
      this.selectedOptions = <MultiSelectOptionComponent[]>(
        this.options
          .toArray()
          .filter((option) => option.multiSelectOption.isSelected)
      );
      this.selectedTags = this.selectedOptions.map(
        (comp) => comp.multiSelectOption
      );
      this.selectedOptionChange.emit(this.selectedTags);
      this.keyManager = new ActiveDescendantKeyManager(this.options)
        .withHorizontalOrientation('ltr')
        .withVerticalOrientation()
        .withWrap()
        .withTypeAhead();
    });
  }

  public showDropdown() {
    this.show();

    if (!this.options.length) {
      return;
    }

    this.selected
      ? this.keyManager.setActiveItem(this.selectedOptions[0])
      : this.keyManager.setFirstItemActive();
  }

  onInputFocus(): void {
    this.displayingMultiSelectOptions = [
      ...this.multiSelectOptions.sort((a, b) =>
        a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1
      ),
    ];
    if (!this.showing) {
      this.showDropdown();
    }
  }

  protected setOverlayConfig() {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: this.overlayPanelClass,
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.multiselectRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
    });
    this.overlayRef.attach(this.multiSelectOptionsContainer);
    this.overlayRef.backdropClick().subscribe(() => this.hide());
  }

  onRemoveSelectedItem(removedTag: MultiSelectOption): void {
    const removedTagIndex = this.selectedTags.findIndex(
      (tag) => tag._id === removedTag._id
    );
    const removedItem = this.selectedTags.splice(removedTagIndex, 1)[0];
    const selectOptIndex = this.selectedOptions.findIndex(
      (o) => o.multiSelectOption._id === removedItem._id
    );
    this.selectedOptions.splice(selectOptIndex, 1);
    this.dropdownInptTxt.setValue(null);
    this.hideDropdown();
    this.onChange();
  }

  private syncWidth() {
    if (!this.overlayRef) {
      return;
    }

    const refRect =
      this.multiselectRef['nativeElement'].getBoundingClientRect();
    this.overlayRef.updateSize({ width: refRect.width });
  }

  public show() {
    this.setOverlayConfig();
    this.syncWidth();
    this.showing = true;
  }

  public hide() {
    this.overlayRef.detach();
    this.showing = false;
  }

  @HostListener('window:resize')
  public onWinResize() {
    this.syncWidth();
  }

  public hideDropdown() {
    this.hide();
  }

  public onKeyDown(event: KeyboardEvent) {
    if ('Backspace' === event.key) {
      if(!this.dropdownInptTxt.value && this.selectedTags.length) {
        this.onRemoveSelectedItem([...this.selectedTags].splice(-1)[0]);
      }
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      this.selectedOptions.push(
        <MultiSelectOptionComponent>this.keyManager.activeItem
      );
      this.selected = this.selectedOptions[0].multiSelectOption._id;
      this.selectOption(<MultiSelectOptionComponent>this.keyManager.activeItem);
      this.hideDropdown();
      this.onChange();
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      this.showing && this.hideDropdown();
    } else if (
      [
        'ArrowUp',
        'Up',
        'ArrowDown',
        'Down',
        'ArrowRight',
        'Right',
        'ArrowLeft',
        'Left',
      ].indexOf(event.key) > -1
    ) {
      this.keyManager.onKeydown(event);
    } else if (
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Tab'
    ) {
      this.showing && event.preventDefault();
    }
  }

  public selectOption(option: MultiSelectOptionComponent) {
    if (!option.multiSelectOption.isSelected) {
      this.keyManager.setActiveItem(option);
      this.setSelectedOption(option.multiSelectOption._id);
      this.selected = option.multiSelectOption._id;
      this.selectedOptions.push(option);
      this.selectedTags.push(option.multiSelectOption);
      this.dropdownInptTxt.setValue(null);
      this.hideDropdown();
      this.onChange();
    } else {
      this.onRemoveSelectedItem(option.multiSelectOption);
    }
  }

  setSelectedOption(id: string): void {
    const index = this.multiSelectOptions.findIndex((op) => op._id === id);
    this.multiSelectOptions[index].isSelected = true;
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.dropdownInptTxt.disable();
    } else {
      this.dropdownInptTxt.enable();
    }
  }

  public writeValue(obj: any): void {
    this.selected = obj;
  }

  public onTouched() {
    this.onTouchedFn();
  }

  public onChange() {
    this.onChangeFn(this.selectedTags);
    this.selectedOptionChange.emit(this.selectedTags);
  }
}

@NgModule({
  imports: [
    CommonModule,
    IconComponentModule,
    OverlayModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    TagComponentModule
  ],
  declarations: [MultiSelectComponent, MultiSelectOptionComponent, FilterPipe],
  exports: [MultiSelectComponent, MultiSelectOptionComponent],
})
export class MultiSelectComponentModule {}

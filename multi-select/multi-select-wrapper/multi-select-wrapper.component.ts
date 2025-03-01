import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
} from '@angular/forms';
import { MultiSelectComponentModule } from '../multi-select.component';
import { DropdownList } from '../../list/dropdown-list';
import { MultiSelectOption } from '../models/multi-select.model';
import { MultiSelectService } from '../multi-select.service';

@Component({
  selector: 'k-multi-select-wrapper',
  template: `
    <k-multi-select [isSearchIconEnable]="isSearchIconEnable" [multiSelectOptions]="dropdownOptions">
    </k-multi-select>
  `,
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ["isSearchIconEnable"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectWrapperComponent {
  public dropdownOptions: MultiSelectOption[] = DropdownList;
  public selectedDestination!: string;
  formGrp!: FormGroup;
  isSearchIconEnable!: boolean
}

@NgModule({
  imports: [CommonModule, MultiSelectComponentModule],
  declarations: [MultiSelectWrapperComponent],
  exports: [MultiSelectWrapperComponent],
  providers: [MultiSelectService]
})
export class MultiSelectWrapperComponentModule {}

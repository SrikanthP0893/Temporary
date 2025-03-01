import { Injectable } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';

@Injectable()
export class MultiSelectService {

    private select!: MultiSelectComponent;

    public register(select: MultiSelectComponent) {
        this.select = select;
    }

    public getSelect(): MultiSelectComponent {
        return this.select;
    }
}
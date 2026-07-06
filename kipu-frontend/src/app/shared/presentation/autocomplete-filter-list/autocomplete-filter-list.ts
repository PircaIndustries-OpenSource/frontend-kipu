import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import {MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
@Component({
  selector: 'app-autocomplete-filter-list',
  imports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatInputModule,
  ],
  templateUrl: './autocomplete-filter-list.html',
  styleUrl: './autocomplete-filter-list.css',
})
export class AutocompleteFilterList {
  resetSignal = input<number>(0);
  listOptions = input.required<string[]>();
  label = input<string>();
  placeholder = input.required<string>();
  optionSelected = output<string>();
  controlFilter = new FormControl('');
  optionsFilter: Observable<string[]> = this.controlFilter.valueChanges.pipe(
    startWith(''),
    map((value) => {
      const val = value || '';
      if (!val) {
        this.optionSelected.emit('');
      }
      return this._filter(val);
    }),
  );
  inputElement = viewChild<ElementRef<HTMLInputElement>>('autoInput');
  autoTrigger = viewChild(MatAutocompleteTrigger);
  disabled = input<boolean>();
  constructor() {
    effect(() => {
      this.resetSignal();
      this.controlFilter.reset();
    });
    effect(() => {
      if (this.disabled()) {
        this.controlFilter.disable({ emitEvent: false });
      } else {
        this.controlFilter.enable({ emitEvent: false });
      }
    });
  }
  private _filter(text: string): string[] {
    const textLower = text.toLowerCase();
    return this.listOptions().filter((option) =>
      option.toLowerCase().includes(textLower),
    );
  }
  onFocus() {
    if (!this.disabled()) {
      const trigger = this.autoTrigger();
      if (trigger && !trigger.panelOpen) {
        trigger.openPanel();
      }
    }
  }
  selectOption(option: string) {
    this.optionSelected.emit(option);
  }
}

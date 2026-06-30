import {
  Component,
  effect,
  EventEmitter,
  input,
  OnInit,
  output,
} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatFormField, MatInput} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
@Component({
  selector: 'app-autocomplete-filter-list',
  imports: [
    MatAutocompleteModule,
    MatFormField,
    ReactiveFormsModule,
    AsyncPipe,
    MatInput,
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
      if (!value) {
        this.optionSelected.emit('');
      }
      return this._filter(value || '');
    }),
  );
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
  selectOption(option: string) {
    this.optionSelected.emit(option);
    console.log('Select Option emit: ', option);
  }
}

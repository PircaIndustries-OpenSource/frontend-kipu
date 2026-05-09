export class ConcreteEntity {
  #id: string;
  #name: string;
  #state: string;
  #location: string;
  #temperature: number;
  #humidity: number;
  #limit: number;
  #unit: string;

  constructor() {
    this.#id = '';
    this.#name = '';
    this.#state = '';
    this.#location = '';
    this.#temperature = 0;
    this.#humidity = 0;
    this.#limit = 0;
    this.#unit = '';
  }

  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  get state(): string {
    return this.#state;
  }

  set state(value: string) {
    this.#state = value;
  }

  get location(): string {
    return this.#location;
  }

  set location(value: string) {
    this.#location = value;
  }

  get temperature(): number {
    return this.#temperature;
  }

  set temperature(value: number) {
    this.#temperature = value;
  }

  get humidity(): number {
    return this.#humidity;
  }

  set humidity(value: number) {
    this.#humidity = value;
  }

  get limit(): number {
    return this.#limit;
  }

  set limit(value: number) {
    this.#limit = value;
  }

  get unit(): string {
    return this.#unit;
  }

  set unit(value: string) {
    this.#unit = value;
  }
}

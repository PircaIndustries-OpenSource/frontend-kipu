export class HopperEntity {
  #id: string;
  #projectId: string;
  #unit: string;
  #state: string;
  #lastLecture: number;
  #limit: number;

  constructor() {
    this.#id = '';
    this.#projectId = '';
    this.#unit = '';
    this.#state = '';
    this.#limit = 0;
    this.#lastLecture = 0;
  }

  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  get projectId(): string {
    return this.#projectId;
  }

  set projectId(value: string) {
    this.#projectId = value;
  }

  get unit(): string {
    return this.#unit;
  }

  set unit(value: string) {
    this.#unit = value;
  }

  get state(): string {
    return this.#state;
  }

  set state(value: string) {
    this.#state = value;
  }

  get lastLecture(): number {
    return this.#lastLecture;
  }

  set lastLecture(value: number) {
    this.#lastLecture = value;
  }

  get limit(): number {
    return this.#limit;
  }

  set limit(value: number) {
    this.#limit = value;
  }
}

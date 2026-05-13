export class SeismicEntity {
  #id: string;
  #projectId: string;
  #sensorId: string;
  #unit: string;
  #name: string;
  #location: string;
  #state: string;
  #lastLecture: number;
  #limit: number;
  #timeLecture: string;

  constructor() {
    this.#id = '';
    this.#projectId = '';
    this.#sensorId = '';
    this.#name = '';
    this.#unit = '';
    this.#location = '';
    this.#state = '';
    this.#lastLecture = 0;
    this.#limit = 0;
    this.#timeLecture = '';
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

  get sensorId(): string {
    return this.#sensorId;
  }

  set sensorId(value: string) {
    this.#sensorId = value;
  }

  get unit(): string {
    return this.#unit;
  }

  set unit(value: string) {
    this.#unit = value;
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  get location(): string {
    return this.#location;
  }

  set location(value: string) {
    this.#location = value;
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

  get timeLecture(): string {
    return this.#timeLecture;
  }

  set timeLecture(value: string) {
    this.#timeLecture = value;
  }
}

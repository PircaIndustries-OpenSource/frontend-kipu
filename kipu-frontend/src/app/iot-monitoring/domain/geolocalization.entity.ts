export class GeolocalizationEntity {
  #id: string;
  #name: string;
  #projectId: string;
  #longitude: number;
  #latitude: number;
  #state: string;

  constructor(
    id: string,
    name: string,
    projectId: string,
    longitude: number,
    latitude: number,
  ) {
    this.#id = id;
    this.#name = name;
    this.#projectId = projectId;
    this.#longitude = longitude;
    this.#latitude = latitude;
    this.#state = '';
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

  get projectId(): string {
    return this.#projectId;
  }

  set projectId(value: string) {
    this.#projectId = value;
  }

  get longitude(): number {
    return this.#longitude;
  }

  set longitude(value: number) {
    this.#longitude = value;
  }

  get latitude(): number {
    return this.#latitude;
  }

  set latitude(value: number) {
    this.#latitude = value;
  }

  get state(): string {
    return this.#state;
  }

  set state(value: string) {
    this.#state = value;
  }
}

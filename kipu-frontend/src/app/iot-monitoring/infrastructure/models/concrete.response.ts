export type ConcreteResponse = ConcreteResource[];
export interface ConcreteResource {
  id: string;
  projectId: string;
  sensorId: string;
  state: number | string;
  location: string;
  temperature?: number | string;
  temperatureReading?: number;
  temperatureUnit?: string;
  humidity?: number;
  humidityPercentage?: number;
  limit: number;
  temperatureLimit?: number;
  unit?: string;
}

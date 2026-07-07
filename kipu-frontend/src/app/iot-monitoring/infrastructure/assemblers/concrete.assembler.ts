import { ConcreteResource, ConcreteResponse } from '../models/concrete.response';
import { ConcreteEntity } from '../../domain/concrete.entity';

export class ConcreteAssembler {
  static toEntityFromResource(resource: ConcreteResource): ConcreteEntity {
    const sensor = new ConcreteEntity();
    sensor.id = String(resource.id);
    sensor.projectId = resource.projectId || '';
    sensor.sensorId = resource.sensorId || '';
    sensor.location = resource.location || '';
    sensor.limit = resource.temperatureLimit || resource.limit || 0;
    sensor.humidity = resource.humidityPercentage || resource.humidity || 0;

    if (typeof resource.temperature === 'string') {
      const parts = resource.temperature.split(' ');
      sensor.temperature = parseFloat(parts[0]) || 0;
      sensor.unit = parts[1] || 'CELSIUS';
    } else {
      sensor.temperature = resource.temperature || resource.temperatureReading || 0;
      sensor.unit = resource.temperatureUnit || resource.unit || 'CELSIUS';
    }

    if (typeof resource.state === 'number') {
      const states: Record<number, string> = { 0: 'OFFLINE', 1: 'ONLINE', 2: 'OFFLINE' };
      sensor.state = states[resource.state] || 'OFFLINE';
    } else {
      sensor.state = resource.state === 'IN_PROGRESS' ? 'ONLINE' : 'OFFLINE';
    }

    return sensor;
  }

  static toEntitiesFromResponse(response: ConcreteResponse): ConcreteEntity[] {
    return response.map((r) => this.toEntityFromResource(r));
  }

  static toResourceFromEntity(entity: ConcreteEntity): any {
    const states: Record<string, number> = { ONLINE: 1, OFFLINE: 0 };
    return {
      projectId: entity.projectId || '',
      sensorId: entity.sensorId || '',
      state: states[entity.state] ?? 0,
      location: entity.location || '',
      temperatureReading: Number(entity.temperature) || 0,
      temperatureUnit: entity.unit || 'CELSIUS',
      humidityPercentage: Math.round(entity.humidity) || 0,
      temperatureLimit: Number(entity.limit) || 0,
    };
  }
}

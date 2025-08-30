interface RegisterableInstance {
  constructor: {
    name: string;
  };
}

interface Constructor {
  name: string;
  new (...args: any[]): any;
}

export class ServiceRegistry {
  private readonly services: Map<string, any> = new Map();

  register(name: string, service: any) {
    this.services.set(name, service);
  }

  get<T>(name: string) {
    const service = this.services.get(name) as T | undefined;
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service as T;
  }

  registerInstance<T extends RegisterableInstance>(instance: T) {
    this.register(instance.constructor.name, instance);
  }

  registerMultipleInstances<T extends RegisterableInstance[]>(...instances: T) {
    instances.forEach(i => this.registerInstance(i));
  }

  getInstance<T extends Constructor>(ctor: T) {
    return this.get<InstanceType<T>>(ctor.name);
  }
}

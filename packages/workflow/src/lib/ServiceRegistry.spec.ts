import { ServiceRegistry } from './ServiceRegistry';

const registry = new ServiceRegistry();

describe('register / get by name', () => {
  it('should register and get by name', () => {
    registry.register('test', 'test');
    expect(registry.get('test')).toBe('test');
  });
});

describe('register / get instance by constructor', () => {
  class Service {
    constructor() {
      registry.registerInstance(this);
    }
  }

  it('should register and get instance by constructor', () => {
    const service = new Service();
    expect(registry.getInstance(Service)).toBe(service);
    expect(registry.get(Service.name)).toBe(service);
  });

  it('should work for subclass', () => {
    class SubService extends Service {
      constructor() {
        super();
      }
    }
    const service = new SubService();
    expect(registry.getInstance(SubService)).toBe(service);
    expect(registry.get(SubService.name)).toBe(service);
  });

  it('should work when registered outside of constructor', () => {
    class Service {}
    const service = new Service();
    registry.registerInstance(service);
    expect(registry.getInstance(Service)).toBe(service);
    expect(registry.get(Service.name)).toBe(service);
  });
});

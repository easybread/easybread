import { ServiceRegistry } from './ServiceRegistry';

let registry: ServiceRegistry;

beforeEach(() => {
  registry = new ServiceRegistry();
});

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

describe('abstract class binding', () => {
  abstract class AbstractService {
    abstract doSomething(): string;
  }

  class ConcreteService extends AbstractService {
    doSomething() {
      return 'concrete';
    }
  }

  it('should bind and retrieve by abstract class', () => {
    const concrete = new ConcreteService();
    registry.bindInstance(AbstractService, concrete);

    const retrieved = registry.getInstance(AbstractService);
    expect(retrieved).toBe(concrete);
    expect(retrieved.doSomething()).toBe('concrete');
  });

  it('should allow binding classes without instances', () => {
    registry.bind(AbstractService, ConcreteService);

    const concrete = new ConcreteService();
    registry.registerInstance(concrete);

    const retrieved = registry.getInstance(AbstractService);
    expect(retrieved).toBe(concrete);
  });

  it('should still retrieve concrete class directly', () => {
    const concrete = new ConcreteService();
    registry.bindInstance(AbstractService, concrete);

    // Can get by abstract
    expect(registry.getInstance(AbstractService)).toBe(concrete);
    // Can also get by concrete
    expect(registry.getInstance(ConcreteService)).toBe(concrete);
  });
});

describe('multiple abstract classes', () => {
  abstract class Repository {
    abstract find(id: string): any;
  }

  abstract class Cache {
    abstract get(key: string): any;
  }

  class UserRepository extends Repository {
    find(id: string) {
      return { id, type: 'user' };
    }
  }

  class MemoryCache extends Cache {
    private data = new Map();
    get(key: string) {
      return this.data.get(key);
    }
  }

  it('should handle multiple abstract bindings', () => {
    const userRepo = new UserRepository();
    const cache = new MemoryCache();

    registry.bindInstance(Repository, userRepo);
    registry.bindInstance(Cache, cache);

    expect(registry.getInstance(Repository)).toBe(userRepo);
    expect(registry.getInstance(Cache)).toBe(cache);
  });
});

describe('rebinding', () => {
  abstract class Database {
    abstract connect(): void;
  }

  class PostgresDB extends Database {
    connect() {
      /* postgres */
    }
  }

  class MySQLDB extends Database {
    connect() {
      /* mysql */
    }
  }

  it('should allow rebinding to different implementation', () => {
    const postgres = new PostgresDB();
    registry.bindInstance(Database, postgres);
    expect(registry.getInstance(Database)).toBe(postgres);

    // Rebind to MySQL
    const mysql = new MySQLDB();
    registry.bindInstance(Database, mysql);
    expect(registry.getInstance(Database)).toBe(mysql);
  });
});

describe('has() method', () => {
  abstract class Service {
    abstract run(): void;
  }

  class ConcreteService extends Service {
    run() {
      console.log('run');
    }
  }

  it('should check if service exists through binding', () => {
    expect(registry.has(Service)).toBe(false);

    const concrete = new ConcreteService();
    registry.bindInstance(Service, concrete);

    expect(registry.has(Service)).toBe(true);
    expect(registry.has(ConcreteService)).toBe(true);
  });
});

describe('WorkflowRuntime integration', () => {
  // Simulating your actual use case
  abstract class StoreAdapter {
    abstract read(key: string): Promise<any>;
  }

  class InMemoryStoreAdapter extends StoreAdapter {
    private store = new Map();
    async read(key: string) {
      return this.store.get(key);
    }
  }

  class DataStore {
    constructor(private adapter: StoreAdapter) {}

    getAdapter() {
      return this.adapter;
    }
  }

  it('should work with WorkflowRuntime pattern', () => {
    const inMemStoreAdapter = new InMemoryStoreAdapter();

    // Register the concrete adapter bound to abstract
    registry.bindInstance(StoreAdapter, inMemStoreAdapter);

    // DataStore can be created with the adapter
    const dataStore = new DataStore(inMemStoreAdapter);
    registry.registerInstance(dataStore);

    // Both can be retrieved
    expect(registry.getInstance(StoreAdapter)).toBe(inMemStoreAdapter);
    expect(registry.getInstance(DataStore)).toBe(dataStore);
    expect(registry.getInstance(DataStore).getAdapter()).toBe(
      inMemStoreAdapter,
    );
  });
});

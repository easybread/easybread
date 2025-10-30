interface RegisterableInstance {
  constructor: {
    name: string;
  };
}

interface Constructor<T> {
  name: string;
  new (...args: any[]): T;
}

// Type for abstract classes
interface AbstractConstructor<T = any> {
  name: string;
  prototype: T;
}

// Union type that accepts both concrete and abstract constructors
type AnyConstructor<T = any> = Constructor<T> | AbstractConstructor<T>;

export class ServiceRegistry {
  private readonly services: Map<string, any> = new Map();
  private readonly bindings: Map<string, string> = new Map();

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

  /**
   * Bind an abstract class or interface token to a concrete implementation
   */
  bind<TAbstract, TConcrete>(
    abstractCtor: AbstractConstructor<TAbstract>,
    concreteCtor: Constructor<TConcrete>,
  ): this {
    this.bindings.set(abstractCtor.name, concreteCtor.name);

    return this;
  }

  /**
   * Register a concrete instance and bind it to an abstract class
   */
  bindInstance<TAbstract, TInstance extends RegisterableInstance>(
    abstractCtor: AbstractConstructor<TAbstract>,
    instance: TInstance,
  ): this {
    // Register the instance by its concrete constructor name
    this.registerInstance(instance);
    // Create a binding from abstract to concrete
    this.bindings.set(abstractCtor.name, instance.constructor.name);
    return this;
  }

  /**
   * Get instance by constructor, checking bindings for abstract classes
   * Overloaded to handle both concrete and abstract constructors
   */
  getInstance<T>(ctor: Constructor<T>): T;
  getInstance<T>(ctor: AbstractConstructor<T>): T;
  getInstance<T>(ctor: AnyConstructor<T>): T {
    // Check if there's a binding for this constructor (abstract -> concrete)
    const boundCtor = this.bindings.get(ctor.name);
    const targetCtorName = boundCtor || ctor.name;

    return this.get<T>(targetCtorName);
  }

  /**
   * Check if a service is registered (either directly or through binding)
   */
  has(ctor: AnyConstructor): boolean {
    const boundCtor = this.bindings.get(ctor.name);
    const targetCtor = boundCtor || ctor.name;
    return this.services.has(targetCtor);
  }

  /**
   * Clear all services and bindings
   */
  clear() {
    this.services.clear();
    this.bindings.clear();
  }
}

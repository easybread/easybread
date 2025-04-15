export type Simplify<T> = T extends any ? { [K in keyof T]: T[K] } & {} : never;

export type SimplifyDeep<T> = T extends any
  ? {
      [K in keyof T]: T[K] extends object ? SimplifyDeep<T[K]> : T[K];
    } & {}
  : never;

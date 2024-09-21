export type ValueOf<T extends object> = Required<T>[keyof T];

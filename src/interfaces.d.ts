export interface Action {
  (resolve: Function): void;
}

export interface Predicate {
  (...args: any[]): boolean;
}

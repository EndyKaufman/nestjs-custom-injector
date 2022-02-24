export const ANIMAL_PROVIDER = Symbol('ANIMAL_PROVIDER');

export interface AnimalProviderInteface {
  type: string;
  say(): string;
}

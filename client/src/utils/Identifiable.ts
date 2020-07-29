
export default interface Identifiable<T = number> {
  readonly id: T;
};

let numericId = 0;
export function id() {
  return numericId++;
}
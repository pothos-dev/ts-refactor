export type Foo = { bar: string }

export interface Bar {}

export function createFoo() {
  return { bar: 'baz' }
}

export const foo = createFoo()

export default foo

const foo2 = createFoo()
const foo3 = createFoo()
export { foo2, foo3 }

export class FooClass {}

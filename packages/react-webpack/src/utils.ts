// import { add as _add } from 'lodash-es'

// Utils类
// class Utils {
//   name: string
//   constructor() {
//     this.name = 'utils'
//   }
//   add = _add
// }

// export function add(a: number, b: number) {
//   const utils = new Utils()
//   return utils.add(a, b)
// }

// eslint-disable-next-line @typescript-eslint/ban-types
export function curry(func: Function) {
  return function curried(this: unknown, ...args: unknown[]) {
    if (args.length >= func.length) {
      return func.apply(this, args)
    } else {
      return function (this: unknown, ...args2: unknown[]) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

function sum(a: number, b: number, c: number) {
  return a + b + c
}

export const curriedSum = curry(sum)

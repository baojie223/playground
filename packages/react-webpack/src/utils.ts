import { add as _add } from 'lodash-es'

// Utils类
class Utils {
  name: string
  constructor() {
    this.name = 'utils'
  }
  add = _add
}

export function add(a: number, b: number) {
  const utils = new Utils()
  return utils.add(a, b)
}

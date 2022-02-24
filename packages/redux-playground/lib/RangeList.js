class RangeList {
  #rangeList = []
  /**
   * Adds a range to the list
   * @param {Range} range - Array of two integers that specify beginning and end of range.
   */

  add(range) {
    if (!this.#isValidRange(range)) {
      return
    }

    this.#rangeList = this.#add(this.#rangeList, range)
  }
  /**
   * Removes a range from the list
   * @param {Range} range - Array of two integers that specify beginning and end of range.
   */

  remove(range) {
    if (!this.#isValidRange(range)) {
      return
    }

    this.#rangeList = this.#remove(this.#rangeList, range)
  }
  /**
   * Prints out the list of ranges in the range list
   */

  print() {
    const res = this.#rangeList
      .reduce((result, range) => `${result} [${range[0]}, ${range[1]})`, '')
      .trim()
    console.log(res)
  }
  /**
   * Validates input - because this class may be used in a .js file, so we should validate the input
   * @param {unknown} x - The input waiting for validating.
   * @returns {boolean}
   */

  #isValidRange(x) {
    if (
      !(
        Array.isArray(x) &&
        x.length === 2 &&
        typeof x[0] === 'number' &&
        typeof x[1] === 'number'
      )
    ) {
      throw new TypeError(
        '[RangeList: add]: method input is not a valid range!'
      )
    }

    return x[0] < x[1]
  }
  /**
   * Abstracts a generic algorithm of add
   */

  #add(ranges, newRange) {
    const n = ranges.length
    const res = []
    let i = 0 // push ranges smaller than newRange into result

    while (i < n && ranges[i][1] < newRange[0]) {
      res.push(ranges[i])
      i++
    } // merge covered ranges, and then set the newRange the merged range

    while (i < n && ranges[i][0] <= newRange[1]) {
      newRange[0] = Math.min(newRange[0], ranges[i][0])
      newRange[1] = Math.max(newRange[1], ranges[i][1])
      i++
    }

    res.push(newRange) // push ranges bigger than newRange into result

    while (i < n) {
      res.push(ranges[i])
      i++
    }

    return res
  }
  /**
   * Abstracts a generic algorithm of remove
   */

  #remove(ranges, removedRange) {
    const res = []

    for (let range of ranges) {
      // push left and right range of removedRange into result
      if (range[1] <= removedRange[0] || range[0] >= removedRange[1]) {
        res.push(range)
      } else {
        // remove removedRange
        if (range[0] < removedRange[0]) {
          res.push([range[0], removedRange[0]])
        }

        if (range[1] > removedRange[1]) {
          res.push([removedRange[1], range[1]])
        }
      }
    }

    return res
  }
}

export default RangeList

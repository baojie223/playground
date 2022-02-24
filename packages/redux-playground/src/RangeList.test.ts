import RangeList, { Range } from './RangeList'

test('RangeList examples', () => {
  console.log = jest.fn()

  const rl = new RangeList()

  // Test invalid input
  expect(() => rl.add(null as any)).toThrowError(
    '[RangeList: add]: method input is not a valid range!'
  )
  expect(() => rl.add(['a', 'b'] as any)).toThrowError(
    '[RangeList: add]: method input is not a valid range!'
  )

  // Test valid input
  testRangeList([1, 5], 'add', '[1, 5)')
  testRangeList([10, 20], 'add', '[1, 5) [10, 20)')
  testRangeList([20, 20], 'add', '[1, 5) [10, 20)')
  testRangeList([20, 21], 'add', '[1, 5) [10, 21)')
  testRangeList([2, 4], 'add', '[1, 5) [10, 21)')
  testRangeList([3, 8], 'add', '[1, 8) [10, 21)')
  testRangeList([10, 10], 'remove', '[1, 8) [10, 21)')
  testRangeList([10, 11], 'remove', '[1, 8) [11, 21)')
  testRangeList([15, 17], 'remove', '[1, 8) [11, 15) [17, 21)')
  testRangeList([3, 19], 'remove', '[1, 3) [19, 21)')

  // Simplify test logic
  function testRangeList(range: Range, type: 'add' | 'remove', result: string) {
    rl[type](range)
    rl.print()
    expect(console.log).toHaveBeenCalledWith(result)
  }
})

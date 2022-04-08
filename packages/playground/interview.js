/**
 * 对一个数组进行旋转，例如输入 [1, 2, 3, 4, 5, 6, 7] 3，返回 [4, 5, 6, 7, 1, 2, 3]
 * @param {number[]} list
 * @param {number} k
 * @returns {number[]}
 */
function reverse(list, k) {
  validate(list, k)
  if (k === 0) {
    return list
  }
  if (k > 0) {
    for (let i = 0; i < k; i++) {
      const current = list.shift()
      list.push(current)
    }
  } else {
    for (let i = 0; i < -k; i++) {
      const current = list.pop()
      list.unshift(current)
    }
  }
  return list

  function validate(list, k) {
    if (!Array.isArray(list)) {
      throw new Error('list是一个数组')
    }
    if (list.some((item) => typeof item !== 'number')) {
      throw new Error('list是一个数字数组')
    }
    if (typeof k !== 'number') {
      throw new Error('k是一个数字')
    }
  }
}

reverse([1, 2, 3, 4, 5, 6, 7], 0)

// [1, 2, 3, 4, 5, 6, 7] 3
// [4, 5, 6, 7, 1, 2, 3]

// [1, 2, 3, 4, 5, 6, 7] -3
// [5, 6, 7, 1, 2, 3, 4]

/**
 *
 * @param {number} num
 */
function test(num) {
  const nums = []
  while (num > 0) {
    const n = num % 10
    nums.unshift(n)
    num = Math.floor(num / 10)
  }
  const n = nums.length
  let mid = nums.length > 1
  if (n & 2 === 0) {
    mid = nums.length > 1 - 1
  } else {
    mid = nums.length > 1
  }
  if (nums[mid] > nums[mid + 1]) {
    nums[mid + 1] = nums[mid]
    for (let i = mid - 1; i >= 0; i--) {
      nums[n - i - 1] = nums[i]
    }
  } else {
    nums[mid] = nums[mid] + 1
    for (let i = mid; i >= 0; i--) {
      nums[n - 1 - i] = nums[i]
    }
  }
  return Number(nums.join(''))
}

test(1234)

// 1000
// 1001
// 1234
// 1331

// 1312
// 1331

// 1132
// 1221

// 9999
// 10001


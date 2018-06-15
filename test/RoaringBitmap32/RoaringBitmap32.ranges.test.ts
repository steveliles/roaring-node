import RoaringBitmap32 from '../../RoaringBitmap32'

describe('RoaringBitmap32 ranges', () => {
  describe('hasRange', () => {
    it('returns false for invalid values', () => {
      const bitmap = new RoaringBitmap32([1, 2, 3, 4, 5])
      expect(bitmap.hasRange(undefined as any, 6)).toBe(false)
      expect(bitmap.hasRange(null as any, 6)).toBe(false)
      expect(bitmap.hasRange('0' as any, 6)).toBe(false)
      expect(bitmap.hasRange(0, [8] as any)).toBe(false)
      expect(bitmap.hasRange(NaN, 4)).toBe(false)
      expect(bitmap.hasRange(4, 4)).toBe(false)
      expect(bitmap.hasRange(-2, -4)).toBe(false)
      expect(bitmap.hasRange(-4, -2)).toBe(false)
      expect(bitmap.hasRange(4, 2)).toBe(false)
      expect(bitmap.hasRange(4, -2)).toBe(false)
    })

    it('returns false for an empty bitmap', () => {
      const bitmap = new RoaringBitmap32()
      expect(bitmap.hasRange(0, 3)).toBe(false)
      expect(bitmap.hasRange(0, 0xffffffff)).toBe(false)
      expect(bitmap.hasRange(0, 0xffffffff + 1)).toBe(false)
      expect(bitmap.hasRange(0xfffffffe, 0xffffffff + 1)).toBe(false)
      expect(bitmap.hasRange(0xffffffff, 0xffffffff + 1)).toBe(false)
    })

    it('returns false for areas that contains no values', () => {
      const bitmap = new RoaringBitmap32([100, 101, 102, 103, 105])
      expect(bitmap.hasRange(99, 101)).toBe(false)
      expect(bitmap.hasRange(105, 107)).toBe(false)
      expect(bitmap.hasRange(105, 109)).toBe(false)
      expect(bitmap.hasRange(100, 106)).toBe(false)
    })

    it('works with simple values', () => {
      const bitmap = new RoaringBitmap32([100, 101, 102, 103, 105])
      expect(bitmap.hasRange(100, 102)).toBe(true)
      expect(bitmap.hasRange(100, 103)).toBe(true)
      expect(bitmap.hasRange(100, 104)).toBe(true)
      expect(bitmap.hasRange(100, 105)).toBe(false)
    })

    it('accepts floating point values', () => {
      const bitmap = new RoaringBitmap32([50, 51, 52, 53, 55])
      expect(bitmap.hasRange(50, 53.4)).toBe(true)
      expect(bitmap.hasRange(50, 53.6)).toBe(true)
      expect(bitmap.hasRange(50.3, 53.4)).toBe(true)
      expect(bitmap.hasRange(50.7, 53.7)).toBe(true)
      expect(bitmap.hasRange(49.9, 52)).toBe(true)
      expect(bitmap.hasRange(50, 52.3)).toBe(true)
      expect(bitmap.hasRange(49.9, 54.9)).toBe(false)
      expect(bitmap.hasRange(49.2, 54)).toBe(true)
      expect(bitmap.hasRange(49.9, 54)).toBe(true)
      expect(bitmap.hasRange(50, 54)).toBe(true)
      expect(bitmap.hasRange(55, 55.2)).toBe(true)
      expect(bitmap.hasRange(55, 55.5)).toBe(true)
      expect(bitmap.hasRange(55, 55.7)).toBe(true)
    })

    // test integer maxvalue once C is fixed
  })

  describe('flipRange', () => {
    it('does nothing for invalid values', () => {
      const bitmap = new RoaringBitmap32([1, 2])
      bitmap.flipRange(undefined as any, 6)
      bitmap.flipRange(null as any, 6)
      bitmap.flipRange('0' as any, 6)
      bitmap.flipRange(0, [8] as any)
      bitmap.flipRange(NaN, 4)
      bitmap.flipRange(4, 4)
      bitmap.flipRange(-2, -4)
      bitmap.flipRange(-4, -2)
      bitmap.flipRange(4, 2)
      bitmap.flipRange(4, -2)
      expect(bitmap.toArray()).toEqual([1, 2])
    })

    it('flips a ranges on an empty bitmap', () => {
      const bitmap = new RoaringBitmap32()
      bitmap.flipRange(1, 3)
      bitmap.flipRange(3, 5)
      bitmap.flipRange(8, 10)
      expect(bitmap.toArray()).toEqual([1, 2, 3, 4, 8, 9])
    })

    it('accepts negative numbers', () => {
      const bitmap = new RoaringBitmap32([1])
      bitmap.flipRange(-4, 3)
      expect(bitmap.toArray()).toEqual([0, 2])
    })

    it('accepts negative infinity', () => {
      const bitmap = new RoaringBitmap32([1])
      bitmap.flipRange(-Infinity, 3)
      expect(bitmap.toArray()).toEqual([0, 2])
    })

    it('flips a ranges', () => {
      const bitmap = new RoaringBitmap32([4, 6, 7])
      bitmap.flipRange(1, 3)
      bitmap.flipRange(3, 5)
      bitmap.flipRange(8, 10)
      bitmap.flipRange(4, 10)
      expect(bitmap.toArray()).toEqual([1, 2, 3, 4, 5])
      bitmap.flipRange(4, 10)
      expect(bitmap.toArray()).toEqual([1, 2, 3, 6, 7, 8, 9])
    })

    // test integer maxvalue once C is fixed
  })
})

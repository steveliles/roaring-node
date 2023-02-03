import {
  RoaringBitmap32,
  bufferAlignedAlloc,
  bufferAlignedAllocUnsafe,
  isBufferAligned,
  ensureBufferAligned,
} from "../";
import { expect } from "chai";

describe("bufferAlignedAlloc", () => {
  it("exposes the bufferAlignedAlloc function", () => {
    expect(bufferAlignedAlloc).to.be.a("function");
    expect(RoaringBitmap32.bufferAlignedAlloc).to.eq(bufferAlignedAlloc);
  });

  it("throws if first argument (size) is invalid", () => {
    expect(() => bufferAlignedAlloc(-1)).to.throw();
    expect(() => bufferAlignedAlloc("x" as any)).to.throw();
    expect(() => bufferAlignedAlloc({} as any)).to.throw();
    expect(() => bufferAlignedAlloc(null as any)).to.throw();
  });

  it("can allocate an empty buffer", () => {
    const buffer = bufferAlignedAlloc(0);
    expect(buffer).to.be.instanceOf(Buffer);
    expect(buffer.length).to.eq(0);
    expect(isBufferAligned(buffer)).to.eq(true);
  });

  it("can allocate a buffer of a given size", () => {
    const buffer = bufferAlignedAlloc(10, 128);
    expect(buffer).to.be.instanceOf(Buffer);
    expect(buffer.length).to.eq(10);
    expect(isBufferAligned(buffer, 128)).to.eq(true);
  });

  it("is initialized with zeroes", () => {
    const buffer = bufferAlignedAlloc(2340);
    expect(buffer).to.be.instanceOf(Buffer);
    expect(buffer.length).to.eq(2340);
    for (let i = 0; i < 2340; ++i) {
      expect(buffer[i]).to.eq(0);
    }
    expect(isBufferAligned(buffer)).to.eq(true);
    expect(RoaringBitmap32.isBufferAligned(buffer, 32)).to.eq(true);
  });
});

describe("bufferAlignedAllocUnsafe", () => {
  it("exposes the bufferAlignedAllocUnsafe function", () => {
    expect(bufferAlignedAllocUnsafe).to.be.a("function");
    expect(RoaringBitmap32.bufferAlignedAllocUnsafe).to.eq(bufferAlignedAllocUnsafe);
  });

  it("throws if first argument (size) is invalid", () => {
    expect(() => bufferAlignedAllocUnsafe(-1)).to.throw();
    expect(() => bufferAlignedAllocUnsafe(null as any)).to.throw();
    expect(() => bufferAlignedAllocUnsafe("x" as any)).to.throw();
    expect(() => bufferAlignedAllocUnsafe({} as any)).to.throw();
  });

  it("can allocate an empty buffer", () => {
    const buffer = bufferAlignedAllocUnsafe(0, 512);
    expect(buffer).to.be.instanceOf(Buffer);
    expect(buffer.length).to.eq(0);
    expect(isBufferAligned(buffer, 512)).to.eq(true);
  });

  it("can allocate a buffer of a given size", () => {
    const buffer = bufferAlignedAllocUnsafe(10);
    expect(buffer).to.be.instanceOf(Buffer);
    expect(buffer.length).to.eq(10);
    expect(isBufferAligned(buffer)).to.eq(true);
    expect(RoaringBitmap32.isBufferAligned(buffer, 32)).to.eq(true);
    expect(RoaringBitmap32.isBufferAligned(buffer.buffer)).to.eq(true);
    expect(RoaringBitmap32.isBufferAligned(buffer, 111)).to.eq(false);
  });

  describe("ensureBufferAligned", () => {
    it("exposes the ensureBufferAligned function", () => {
      expect(ensureBufferAligned).to.be.a("function");
      expect(RoaringBitmap32.ensureBufferAligned).to.eq(ensureBufferAligned);
    });

    it("returns the same buffer if it is already aligned", () => {
      const buffer = bufferAlignedAlloc(30);
      expect(ensureBufferAligned(buffer, 32)).to.eq(buffer);
    });

    it("returns a new buffer if the buffer is not aligned", () => {
      const unalignedBuffer = Buffer.from(bufferAlignedAlloc(31).buffer, 1, 27);
      const result = ensureBufferAligned(unalignedBuffer);
      expect(result).to.not.eq(unalignedBuffer);
      expect(result).to.be.instanceOf(Buffer);
      expect(result.length).to.eq(27);
      expect(isBufferAligned(result)).to.eq(true);
    });

    it("returns a new buffer if the buffer is not aligned, with a custom alignment", () => {
      const unalignedBuffer = Buffer.from(bufferAlignedAlloc(31).buffer, 1, 30);
      const result = ensureBufferAligned(unalignedBuffer, 256);
      expect(result).to.not.eq(unalignedBuffer);
      expect(result).to.be.instanceOf(Buffer);
      expect(result.length).to.eq(30);
      expect(isBufferAligned(result, 256)).to.eq(true);
    });
  });
});

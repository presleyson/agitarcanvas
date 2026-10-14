import { describe, expect, it } from 'vitest';
import { BLOCKS, isBlockId } from './agitar';

describe('isBlockId', () => {
  it('aceita os identificadores dos nove blocos', () => {
    expect(BLOCKS.every((block) => isBlockId(block.id))).toBe(true);
  });

  it('recusa valores que não são blocos, inclusive nomes herdados de objetos', () => {
    for (const value of ['constructor', 'toString', '__proto__', '', 'Mercado', null, undefined, 3]) {
      expect(isBlockId(value)).toBe(false);
    }
  });
});

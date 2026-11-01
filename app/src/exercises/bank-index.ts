// An index over a bank, built once per bank array and topped up as the array
// grows. Card building looks sentences up here instead of scanning the whole
// bank for every card: with every unit loaded the bank is 72,693 rows, and a
// scan with a regex normaliser per row cost 40 to 140 ms a card.
//
// The bank only ever appends (Bundle.extend pushes onto the same array), so an
// index remembers how far it has read and adds only the new rows. If the array
// has got shorter, or the last row it read is no longer where it was, the index
// starts again from the first row.
import type { BankSentence } from '../content/schema';

interface Reader<I> { index: I; seen: number; last?: BankSentence }

/** A lookup for `bank`: `make` starts an empty index, `add` takes in one row (rows arrive in bank order). */
export function bankIndex<I>(make: () => I, add: (index: I, s: BankSentence) => void): (bank: readonly BankSentence[]) => I {
  const readers = new WeakMap<readonly BankSentence[], Reader<I>>();
  return (bank) => {
    let r = readers.get(bank);
    if (r && (bank.length < r.seen || bank[r.seen - 1] !== r.last)) r = undefined;
    if (!r) readers.set(bank, r = { index: make(), seen: 0 });
    for (; r.seen < bank.length; r.seen++) add(r.index, bank[r.seen]);
    r.last = bank[r.seen - 1];
    return r.index;
  };
}

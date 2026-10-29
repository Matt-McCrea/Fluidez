import { questionCard } from '../../src/ui/session/cards';

test('every option on a card is shown in one language, so colour never gives the answer away', () => {
  const card = questionCard('q1', { q: '¿Quién abre el café?', options: ['Vale', 'Tomás', 'Don Hernando', 'Nobody'], answer: 0 });
  if (card.type !== 'mcq') throw new Error('expected mcq');
  expect(new Set(card.options.map((o) => o.lang)).size).toBe(1);
});

// Typed answers: an input (or textarea) with the accented-character helper
// above the keyboard. The helper buttons never take focus away from the
// field, so the caret stays where the learner was typing.
import { useEffect, useRef } from 'preact/hooks';

export const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'] as const;

type Field = HTMLInputElement | HTMLTextAreaElement;

export function AccentBar({ target, onChange }: { target: { current: Field | null }; onChange: (v: string) => void }) {
  const insert = (ch: string) => {
    const el = target.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    const next = el.value.slice(0, start) + ch + el.value.slice(end);
    onChange(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + ch.length, start + ch.length); });
  };
  return (
    <div class="accents" role="group" aria-label="Spanish characters">
      {ACCENTS.map((ch) => (
        <button
          type="button" key={ch} class="accent" aria-label={`Insert ${ch}`}
          onMouseDown={(e) => e.preventDefault()} onClick={() => insert(ch)}
        >{ch}</button>
      ))}
    </div>
  );
}

export interface AnswerFieldProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  label: string;
  placeholder?: string;
  lang?: 'es' | 'en';
  multiline?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  rows?: number;
  id?: string;
}

export function AnswerField(p: AnswerFieldProps) {
  const ref = useRef<Field | null>(null);
  useEffect(() => { if (p.autoFocus && !p.disabled) ref.current?.focus({ preventScroll: true }); }, [p.autoFocus, p.disabled]);
  const common = {
    id: p.id,
    class: `field${p.lang === 'es' ? ' es-input' : ''}`,
    lang: p.lang,
    value: p.value,
    placeholder: p.placeholder,
    disabled: p.disabled,
    'aria-label': p.label,
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'sentences' as const,
    spellcheck: false,
    onInput: (e: Event) => p.onChange((e.currentTarget as Field).value),
  };
  return (
    <div class="answer">
      {p.lang === 'es' && !p.disabled ? <AccentBar target={ref} onChange={p.onChange} /> : <div class="accents-space" aria-hidden="true" />}
      {p.multiline
        ? <textarea {...common} rows={p.rows ?? 5} ref={(el) => { ref.current = el; }} />
        : (
          <input
            {...common} type="text" enterKeyHint="send" ref={(el) => { ref.current = el; }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); p.onSubmit?.(); } }}
          />
        )}
    </div>
  );
}

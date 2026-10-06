import type { Operator } from '../types/math.ts';
export function NumberLine({ boundary, operator }: { boundary: number; operator: Operator }) {
  const left = operator === '<' || operator === '≤';
  const closed = operator === '≤' || operator === '≥';
  return <figure className="number-line"><svg viewBox="0 0 420 85" role="img" aria-label={`Number line: x ${operator} ${boundary}, ${closed ? 'closed' : 'open'} circle, arrow to the ${left ? 'left' : 'right'}`}>
    <line x1="25" y1="32" x2="395" y2="32" stroke="#a2aaa5" strokeWidth="2"/>
    {Array.from({ length: 7 }, (_, i) => <g key={i}><line x1={60 + i * 50} x2={60 + i * 50} y1="27" y2="38" stroke="#a2aaa5"/><text x={60 + i * 50} y="65" textAnchor="middle" fill="#58645e" fontSize="13">{boundary + i - 3}</text></g>)}
    <line x1="210" y1="32" x2={left ? 30 : 390} y2="32" stroke="#26745b" strokeWidth="4"/>
    <path d={left ? 'M 40 24 L 29 32 L 40 40' : 'M 380 24 L 391 32 L 380 40'} fill="none" stroke="#26745b" strokeWidth="4"/>
    <circle cx="210" cy="32" r="7" fill={closed ? '#26745b' : '#fff'} stroke="#26745b" strokeWidth="3"/>
  </svg><figcaption>{closed ? 'Filled circle: includes' : 'Open circle: does not include'} {boundary}. Shade to the {left ? 'left' : 'right'}.</figcaption></figure>;
}

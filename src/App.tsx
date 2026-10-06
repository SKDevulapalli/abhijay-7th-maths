import { useRef, useState } from 'react';
import type { Difficulty, Operator, Question, SavedData, Topic } from './types/math.ts';
import { generateSessionQuestions, isCorrect } from './utils/questionGenerator.ts';
import { advance, createSession, loadData, recordResponse, saveData } from './utils/storage.ts';
import { NumberLine } from './components/NumberLine.tsx';
const titles = { 1: 'Algebraic Equations', 3: 'Inequalities' };
function Explanation({ question }: { question: Question }) {
  return <div className="explanation"><h3>Steps</h3><ol>{question.explanation.map((step, i) => <li key={i}>{step}</li>)}</ol>{question.numberLine && <NumberLine {...question.numberLine}/>}</div>;
}
export default function App() {
  const [data, setData] = useState<SavedData>(loadData);
  const current = useRef(data);
  const [page, setPage] = useState<'home' | 'setup' | 'practice' | 'progress' | 'placeholder' | 'review'>(() => data.session ? 'practice' : 'home');
  const [chapter, setChapter] = useState<1 | 3>(1);
  const [topic, setTopic] = useState<Topic>('one-side');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [count, setCount] = useState(10);
  const [input, setInput] = useState('');
  const [operator, setOperator] = useState<Operator>('>');
  const [error, setError] = useState('');
  const [storageWarning, setStorageWarning] = useState(false);
  const session = data.session;
  function commit(next: SavedData) { current.current = next; setData(next); setStorageWarning(!saveData(next)); }
  function choose(value: 1 | 3) { setChapter(value); setTopic(value === 1 ? 'one-side' : 'one-step'); setPage('setup'); setError(''); }
  function start() {
    try { commit({ ...current.current, session: createSession(chapter, topic, difficulty, generateSessionQuestions(chapter, topic, difficulty, count)) }); setInput(''); setOperator('>'); setError(''); setPage('practice'); } catch (e) { setError(e instanceof Error ? e.message : 'Please try again.'); }
  }
  function submit() {
    const latest = current.current;
    const active = latest.session;
    if (!active || active.completed || active.responses[active.index]) return;
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(input.trim())) { setError('Enter a number, such as 5 or −3 (use the minus key).'); return; }
    commit(recordResponse(latest, { value: input.trim(), operator, correct: isCorrect(active.questions[active.index], input, operator) })); setError('');
  }
  function next() { commit(advance(current.current)); setInput(''); setOperator('>'); setError(''); }
  const q = session?.questions[session.index];
  const response = session?.responses[session.index];
  const correct = session?.responses.filter(r => r.correct).length || 0;
  return <main><header><span className="eyebrow">A little practice, every day</span><h1>7th Grade Math</h1></header>
    {storageWarning && <p role="alert" className="warning">Browser storage is unavailable. Keep this tab open; progress cannot be saved until storage is available.</p>}
    {page !== 'home' && <button className="back" onClick={() => { setPage('home'); setError(''); }}>← Back to Chapters</button>}
    {page === 'home' && <><h2>Choose a Chapter</h2><div className="chapters">
      <button className="chapter" onClick={() => choose(1)}><span>Chapter 1</span><strong>Algebraic Equations</strong><span className="arrow">→</span></button>
      <button className="chapter" onClick={() => setPage('placeholder')}><span>Chapter 2</span><strong className="muted">Coming Soon</strong><span className="arrow">→</span></button>
      <button className="chapter" onClick={() => choose(3)}><span>Chapter 3</span><strong>Inequalities</strong><span className="arrow">→</span></button>
    </div>{session && !session.completed && <button className="secondary" onClick={() => setPage('practice')}>Resume practice · Question {session.index + 1} of {session.questions.length}</button>}
    <button className="text-button" onClick={() => setPage('progress')}>View Progress</button></>}
    {page === 'placeholder' && <section><h2>Chapter 2</h2><p className="muted">Coming Soon</p></section>}
    {page === 'setup' && <section><span className="eyebrow">Chapter {chapter}</span><h2>{titles[chapter]}</h2>
      <fieldset><legend>Choose Topic</legend><div className="choices topics">{(chapter === 1 ? [['one-side', 'One-Side Equations'], ['both-sides', 'Variables on Both Sides'], ['mixed', 'Mixed']] : [['one-step', 'One-step inequalities'], ['two-step', 'Two-step inequalities'], ['both-sides', 'Variables on Both Sides'], ['mixed', 'Mixed']]).map(([value, label]) => <button key={value} aria-pressed={topic === value} onClick={() => setTopic(value as Topic)}>{label}</button>)}</div></fieldset>
      <fieldset><legend>Difficulty</legend><div className="choices">{(['easy', 'medium', 'hard'] as const).map(value => <button key={value} aria-pressed={difficulty === value} onClick={() => setDifficulty(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div><p className="hint">{difficulty === 'easy' ? 'Small numbers and positive coefficients.' : 'Includes negative numbers' + (chapter === 3 ? ' and reversing the inequality sign.' : '.')}</p></fieldset>
      <label className="count-label" htmlFor="count">Questions</label><select id="count" value={count} onChange={e => setCount(Number(e.target.value))}>{[5, 10, 15, 20].map(n => <option key={n}>{n}</option>)}</select>
      {session && !session.completed && <p className="hint">Starting a new practice replaces your unfinished session. Answers already scored stay in Progress.</p>}
      {error && <p role="alert">{error}</p>}<button className="primary full" onClick={start}>Start Practice</button></section>}
    {page === 'practice' && session && !session.completed && q && <section key={q.id}><div className="question-meta"><span>Question {session.index + 1} of {session.questions.length}</span><span>{titles[session.chapter]}</span></div><div className="track"><div style={{ width: `${session.index / session.questions.length * 100}%` }}/></div><h2 className="solve">Solve for x</h2><p className="equation">{q.question}</p>
      <form onSubmit={e => { e.preventDefault(); submit(); }}><label htmlFor="answer">Your answer</label><div className="answer-row"><span>x</span>{q.type === 'inequality' ? <select aria-label="Inequality operator" disabled={!!response} value={response?.operator || operator} onChange={e => setOperator(e.target.value as Operator)}>{(['>', '<', '≥', '≤'] as const).map(op => <option key={op}>{op}</option>)}</select> : <span>=</span>}<input id="answer" autoFocus inputMode="decimal" autoComplete="off" disabled={!!response} value={response ? response.value : input} onChange={e => setInput(e.target.value)} aria-describedby={error ? 'answer-error' : undefined}/></div>
      {error && <p id="answer-error" role="alert">{error}</p>}{!response && <button className="primary full" type="submit">Submit</button>}</form>
      {response && <div className={`result ${response.correct ? 'correct' : 'incorrect'}`} role="status"><h3>{response.correct ? '✓ Correct!' : '✗ Not quite.'}</h3><p>{response.correct ? '' : 'Correct answer: ' }<strong>{q.answer}</strong></p>{!response.correct ? <Explanation question={q}/> : q.numberLine ? <><NumberLine {...q.numberLine}/><details><summary>See steps</summary><Explanation question={q}/></details></> : null}<button className="primary full" onClick={next}>{session.index === session.questions.length - 1 ? 'See Results' : 'Next'}</button></div>}
    </section>}
    {page === 'practice' && session?.completed && <section className="completion"><span className="eyebrow">Practice Complete!</span><h2>{correct} / {session.questions.length} Correct</h2><p className="score">{Math.round(correct / session.questions.length * 100)}<span>%</span></p><p className="muted">Correct: {correct} · Incorrect: {session.questions.length - correct}</p><button className="secondary full" disabled={correct === session.questions.length} onClick={() => setPage('review')}>Review Mistakes{correct === session.questions.length ? ' · None!' : ''}</button><button className="primary full" onClick={() => { setChapter(session.chapter); setTopic(session.topic); setDifficulty(session.difficulty); setCount(session.questions.length); setPage('setup'); }}>Practice Again</button><button className="text-button" onClick={() => setPage('home')}>Back to Chapters</button></section>}
    {page === 'review' && session && <section><h2>Review Mistakes</h2>{session.questions.map((question, i) => session.responses[i]?.correct === false && <article className="mistake" key={question.id}><span className="eyebrow">Question {i + 1}</span><h3>{question.question}</h3><p>Your answer: x {question.type === 'equation' ? '=' : session.responses[i].operator} {session.responses[i].value}</p><p><strong>Correct answer: {question.answer}</strong></p><Explanation question={question}/></article>)}<button className="secondary full" onClick={() => setPage('practice')}>Back to Results</button></section>}
    {page === 'progress' && <section><h2>Progress</h2>{([1, 3] as const).map(ch => { const p = data.progress[ch]; return <article className="progress" key={ch}><span className="eyebrow">Chapter {ch}</span><h3>{titles[ch]}</h3><p>Questions: {p?.attempted || 0}</p><p>Correct: {p?.correct || 0} · Incorrect: {p?.incorrect || 0}</p><p>Accuracy: {p?.attempted ? `${Math.round(p.correct / p.attempted * 100)}%` : '—'}</p><p>Best score: {p?.sessions ? `${p.bestScore}%` : '—'}</p></article>; })}<p className="hint">Progress is saved in this browser. Clearing browser data removes it.</p></section>}
    <footer>One question at a time.</footer>
  </main>;
}

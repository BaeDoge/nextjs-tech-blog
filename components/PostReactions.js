"use client";
import { useEffect, useState } from 'react';

const REACTIONS = [
  // { value: 'helpful', emoji: '👍', label: '도움이 됐어요' },
  // { value: 'clear', emoji: '💡', label: '설명이 명확해요' },
  // { value: 'love', emoji: '💚', label: '좋은 글이에요' },
  // { value: 'curious', emoji: '🤔', label: '더 알고 싶어요' },
  
];

export default function PostReactions({ postId }) {
  const [selected, setSelected] = useState('');
  const [ready, setReady] = useState(false);
  const storageKey = `study-blog-reaction:${postId}`;

  useEffect(() => {
    try { setSelected(window.localStorage.getItem(storageKey) || ''); } catch {}
    setReady(true);
  }, [storageKey]);

  function choose(value) {
    const next = selected === value ? '' : value;
    setSelected(next);
    try {
      if (next) window.localStorage.setItem(storageKey, next);
      else window.localStorage.removeItem(storageKey);
    } catch {}
  }
  return <div></div>
  // return (
  //   <section className="post-reactions" aria-label="글 반응">
  //     {/* <div><strong>이 글은 어땠나요?</strong><p>코멘트를 남겨주세요.</p></div> */}
  //     <div className="reaction-options">
  //       {REACTIONS.map((reaction) => <button key={reaction.value} type="button" aria-pressed={selected === reaction.value} className={selected === reaction.value ? 'reaction-button is-selected' : 'reaction-button'} onClick={() => choose(reaction.value)} disabled={!ready} title={reaction.label}><span>{reaction.emoji}</span><small>{reaction.label}</small></button>)}
  //     </div>
  //     <small className="reaction-note"></small>
  //   </section>
  // );
}

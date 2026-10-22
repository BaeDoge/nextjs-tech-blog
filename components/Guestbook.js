"use client";
import { useCallback, useEffect, useState } from 'react';

const BOTTLE_COLORS = ['seafoam', 'sky', 'lavender', 'coral', 'sand'];
const MAX_LENGTH = 180;

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '방금 전';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [website, setWebsite] = useState('');

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/guestbook', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '방명록을 불러오지 못했어요.');
      setMessages(data.messages || []);
    } catch (error) {
      setNotice(error.message || '방명록을 불러오지 못했어요.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  async function submitMessage(event) {
    event.preventDefault();
    if (!message.trim()) { setNotice('병에 담을 메시지를 먼저 적어주세요.'); return; }
    setSending(true); setNotice('');
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), website, bottle_color: BOTTLE_COLORS[Math.floor(Math.random() * BOTTLE_COLORS.length)] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '메시지를 남기지 못했어요.');
      setMessage(''); setWebsite(''); setNotice('쪽지를 바다에 띄웠어요. 고마워요!');
      await loadMessages();
    } catch (error) { setNotice(error.message || '잠시 후 다시 시도해 주세요.'); }
    finally { setSending(false); }
  }

  return (
    <section className="guestbook-section" aria-labelledby="guestbook-title">
      <div className="section-heading"><div><span className="eyebrow">MESSAGES IN A BOTTLE</span><h2 id="guestbook-title">바다 건너 온 쪽지</h2></div><p>누군가에게 전하고 싶은 말을 유리병에 담아 띄워보세요.</p></div>
      <div className="guestbook-ocean">
        <div className="ocean-sun" aria-hidden="true" />
        <div className="ocean-copy"><span>THE LITTLE SEA OF STUDY</span><strong>오늘의 마음을<br />바다에 남겨요.</strong><p>응원, 공부 다짐, 작은 질문 모두 좋아요.</p></div>
        <div className="bottle-field" aria-label="익명 쪽지 목록">
          {loading ? <p className="guestbook-empty">파도 위 쪽지를 찾는 중이에요…</p> : messages.length === 0 ? <p className="guestbook-empty">아직 도착한 쪽지가 없어요.<br />첫 번째 유리병을 띄워주세요.</p> : messages.map((item, index) => <button key={item.id} type="button" className={`message-bottle bottle-${item.bottle_color || 'seafoam'} bottle-position-${index % 12}`} onClick={() => setSelected(item)} aria-label={`익명 쪽지 ${index + 1} 열기`} title="쪽지 열어보기"><span aria-hidden="true">✉</span></button>)}
        </div>
        <div className="ocean-wave wave-one" aria-hidden="true" /><div className="ocean-wave wave-two" aria-hidden="true" />
      </div>
      <div className="guestbook-bottom">
        <form className="guestbook-form" onSubmit={submitMessage}>
          <label htmlFor="guestbook-message">유리병에 넣을 쪽지</label>
          <textarea id="guestbook-message" value={message} onChange={(event) => setMessage(event.target.value.slice(0, MAX_LENGTH))} placeholder="오늘 배운 것, 누군가에게 전하고 싶은 응원 한마디…" maxLength={MAX_LENGTH} required rows={3} />
          <div className="guestbook-form-meta"><span>{message.length}/{MAX_LENGTH}자 · 익명으로 공개돼요</span><button className="button-primary" type="submit" disabled={sending}>{sending ? '띄우는 중…' : '유리병 띄우기 ↗'}</button></div>
          <div className="honeypot" aria-hidden="true"><label htmlFor="guestbook-website">웹사이트</label><input id="guestbook-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
          {notice && <p className="guestbook-notice" role="status">{notice}</p>}
        </form>
        <p className="guestbook-safety">욕설, 개인정보, 광고성 문구는 차단될 수 있어요. 공개된 쪽지는 누구나 읽을 수 있으니 민감한 정보는 적지 말아주세요.</p>
      </div>
      {selected && <div className="message-modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="message-modal" role="dialog" aria-modal="true" aria-labelledby="message-modal-title" onClick={(event) => event.stopPropagation()}><button className="message-modal-close" type="button" onClick={() => setSelected(null)} aria-label="닫기">×</button><span className="eyebrow">A MESSAGE FROM THE SEA</span><h3 id="message-modal-title">익명의 누군가가 남긴 쪽지</h3><p className="message-modal-content">{selected.message}</p><small>{formatDate(selected.created_at)}</small><button type="button" className="button-secondary" onClick={() => setSelected(null)}>바다로 돌아가기</button></section></div>}
    </section>
  );
}

import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LENGTH = 180;
const DEFAULT_BLOCKLIST = ['시발', '씨발', '병신', '개새끼', '좆같', '꺼져', '느금마'];
const ALLOWED_COLORS = new Set(['seafoam', 'sky', 'lavender', 'coral', 'sand']);

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function headers(key) {
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
}

function normalizeText(value) {
  return value.toLocaleLowerCase('ko-KR').normalize('NFKC').replace(/[\s\p{P}\p{S}_]+/gu, '');
}

function blockedMessage(message) {
  const normalized = normalizeText(message);
  const configured = (process.env.GUESTBOOK_BLOCKLIST || '').split(',').map((word) => word.trim()).filter(Boolean);
  return [...DEFAULT_BLOCKLIST, ...configured].some((word) => normalized.includes(normalizeText(word)));
}

function getIpHash(request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown';
  const salt = process.env.GUESTBOOK_HASH_SALT || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'guestbook';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

async function supabaseFetch(path, options = {}) {
  const cfg = config();
  if (!cfg) throw new Error('방명록 저장소가 아직 설정되지 않았어요. 운영자가 Supabase 환경 변수를 설정해야 합니다.');
  const response = await fetch(`${cfg.url}/rest/v1/${path}`, { ...options, headers: { ...headers(cfg.key), ...(options.headers || {}) }, cache: 'no-store' });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!response.ok) {
    console.error('Guestbook database error:', response.status, text.slice(0, 500));
    throw new Error('방명록 처리 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
  }
  return data;
}

export async function GET() {
  try {
    const messages = await supabaseFetch('guestbook_messages?select=id,message,created_at,bottle_color&order=created_at.desc&limit=60');
    return NextResponse.json({ messages: messages || [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = config() ? 500 : 503;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Honeypot: bots often fill hidden fields; return success without storing.
    if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true });

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) return NextResponse.json({ error: '쪽지 내용을 입력해 주세요.' }, { status: 400 });
    if (message.length > MAX_LENGTH) return NextResponse.json({ error: `쪽지는 ${MAX_LENGTH}자 이내로 작성해 주세요.` }, { status: 400 });
    if (message.replace(/[\s\p{P}\p{S}]/gu, '').length < 2) return NextResponse.json({ error: '조금 더 내용을 적어주세요.' }, { status: 400 });
    if (blockedMessage(message)) return NextResponse.json({ error: '차단된 표현이 포함되어 있어 쪽지를 공개할 수 없어요.' }, { status: 400 });
    if (/(https?:\/\/|www\.)/i.test(message)) return NextResponse.json({ error: '방명록에는 링크를 남길 수 없어요.' }, { status: 400 });

    const ipHash = getIpHash(request);
    const since = new Date(Date.now() - 60_000).toISOString();
    const recent = await supabaseFetch(`guestbook_messages?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}&limit=1`);
    if (recent?.length) return NextResponse.json({ error: '쪽지는 1분에 한 번씩 남길 수 있어요. 잠시 쉬었다가 다시 띄워주세요.' }, { status: 429 });

    const colors = ALLOWED_COLORS;
    const bottleColor = colors.has(body.bottle_color) ? body.bottle_color : 'seafoam';
    const inserted = await supabaseFetch('guestbook_messages?select=id,message,created_at,bottle_color', {
      method: 'POST', headers: { Prefer: 'return=representation' },
      body: JSON.stringify([{ message, bottle_color: bottleColor, ip_hash: ipHash }]),
    });
    return NextResponse.json({ ok: true, message: inserted?.[0] || null }, { status: 201 });
  } catch (error) {
    const status = config() ? 500 : 503;
    return NextResponse.json({ error: error.message || '쪽지를 저장하지 못했어요.' }, { status });
  }
}

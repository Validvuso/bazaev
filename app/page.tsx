'use client';
import { useState, useRef, useEffect } from 'react';

interface Topic { id: string; label: string; text: string; }
interface Message { role: 'bot' | 'user'; text: string; offer?: string | null; loading?: boolean; }
interface HistoryItem { role: string; content: string; }

const GROQ_KEY = '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';

const TOPICS: Topic[] = [
  { id: 'civil', label: '⚖️ Гражданское', text: 'Гражданское право' },
  { id: 'labor', label: '💼 Трудовое', text: 'Трудовое право' },
  { id: 'family', label: '❤️ Семейное', text: 'Семейное право' },
  { id: 'contract', label: '📄 Договоры', text: 'Договоры' },
  { id: 'consumer', label: '🛡️ Потребитель', text: 'Защита прав потребителей' },
  { id: 'admin', label: '📋 Административное', text: 'Административное право' },
  { id: 'housing', label: '🏠 Жилищное', text: 'Жилищное право' },
];

const QUICK = ['Обжаловать штраф ГИБДД', 'Не платят зарплату', 'Расторгнуть договор аренды'];

function getSystem(topic: string): string {
  return `Ты — опытный российский юрист-консультант в приложении МойЮрист.
Текущая область: ${topic}.
Отвечай чётко, ссылайся на статьи законов РФ.
Предлагай конкретные шаги.
Если нужен документ — в конце добавь: [OFFER_DOC: название документа]
Отвечай только по-русски.`;
}

function parseOffer(raw: string): { text: string; offer: string | null } {
  const m = raw.match(/\[OFFER_DOC:\s*(.+?)\]/);
  if (!m) return { text: raw, offer: null };
  return { text: raw.replace(m[0], '').trim(), offer: m[1].trim() };
}

export default function Home() {
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Здравствуйте! Я ваш юрист-консультант. Опишите ситуацию — разберём вместе и предложим варианты действий.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (userText: string) => {
    if (!userText.trim() || loading) return;
    const newHistory: HistoryItem[] = [...history, { role: 'user', content: userText }];
    setHistory(newHistory);
    setMessages(prev => [...prev,
      { role: 'user', text: userText },
      { role: 'bot', text: '', loading: true },
    ]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: getSystem(topic.text) },
            ...newHistory,
          ],
        }),
      });
      const data = await res.json();
      const raw: string = data.choices?.[0]?.message?.content ?? 'Ошибка. Попробуйте снова.';
      const { text: cleanText, offer } = parseOffer(raw);
      setHistory(prev => [...prev, { role: 'assistant', content: raw }]);
      setMessages(prev => [...prev.slice(0, -1), { role: 'bot', text: cleanText, offer }]);
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: 'bot', text: 'Ошибка соединения.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#185FA5', color: '#fff', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚖️</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>МойЮрист</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Юрист-консультант • Онлайн</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '10px 16px', overflowX: 'auto', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => setTopic(t)} style={{
            padding: '5px 14px', borderRadius: 99,
            border: topic.id === t.id ? '1.5px solid #185FA5' : '1px solid #e2e8f0',
            background: topic.id === t.id ? '#E6F1FB' : '#fff',
            color: topic.id === t.id ? '#185FA5' : '#64748b',
            fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
            fontWeight: topic.id === t.id ? 500 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', maxWidth: '85%', marginLeft: m.role === 'user' ? 'auto' : 0 }}>
              {m.role === 'bot' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#185FA5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>⚖</div>
              )}
              <div style={{
                padding: '10px 14px', borderRadius: 16,
                borderBottomLeftRadius: m.role === 'bot' ? 4 : 16,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                background: m.role === 'user' ? '#185FA5' : '#fff',
                color: m.role === 'user' ? '#fff' : '#1e293b',
                fontSize: 14, lineHeight: 1.6,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                whiteSpace: 'pre-wrap',
              }}>
                {m.loading ? <span style={{ color: '#94a3b8' }}>Консультант печатает...</span> : m.text}
              </div>
            </div>
            {m.offer && (
              <div style={{ margin: '10px 0 0 36px', background: '#EFF6FF', border: '1.5px solid #185FA5', borderRadius: 12, padding: 14, maxWidth: '80%' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0C447C', marginBottom: 4 }}>📄 {m.offer}</div>
                <div style={{ fontSize: 12, color: '#185FA5', marginBottom: 10 }}>Готовый документ (Word + PDF) + инструкция куда подать</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0C447C', marginBottom: 10 }}>3 000 ₽</div>
                <button
                  onClick={(e) => {
                    (e.target as HTMLButtonElement).textContent = '✓ Заказ оформлен!';
                    (e.target as HTMLButtonElement).style.background = '#27AE60';
                  }}
                  style={{ width: '100%', padding: '9px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                  💳 Оплатить и получить документ
                </button>
              </div>
            )}
          </div>
        ))}
        {messages.length === 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} style={{ padding: '7px 14px', border: '1px solid #185FA5', borderRadius: 99, fontSize: 13, color: '#185FA5', background: '#fff', cursor: 'pointer' }}>{q}</button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '10px 16px 16px', background: '#fff', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '8px 12px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Опишите вашу ситуацию..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#1e293b' }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: loading || !input.trim() ? '#cbd5e1' : '#185FA5', color: '#fff', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: 16 }}>
            ↑
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 6 }}>
          Ответы носят информационный характер и не заменяют официальную юридическую консультацию
        </div>
      </div>
    </div>
  );
}

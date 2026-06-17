import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';

const SUGGESTIONS = [
  "Comment obtenir un acte de naissance ?",
  "Quels documents pour un permis de construire ?",
  "Horaires d'ouverture des guichets",
  "Comment suivre mon dossier ?",
];

interface Message {
  role: 'bot' | 'user';
  text: string;
}

type InlineNode = React.ReactElement | string;

function renderInline(text: string, keyPrefix = ''): InlineNode[] {
  const parts: InlineNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let last = 0;
  let ki = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      parts.push(<strong key={keyPrefix + ki++}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      parts.push(<em key={keyPrefix + ki++}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      parts.push(<code key={keyPrefix + ki++}>{m[4]}</code>);
    } else if (m[5] !== undefined) {
      const href = m[6];
      parts.push(
        href.startsWith('http')
          ? <a key={keyPrefix + ki++} className="chat-link" href={href} target="_blank" rel="noopener noreferrer">{m[5]}</a>
          : <Link key={keyPrefix + ki++} className="chat-link" to={href}>{m[5]}</Link>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderMarkdown(text: string): React.ReactElement[] {
  const lines = text.split('\n');
  const out: React.ReactElement[] = [];
  let olist: React.ReactElement[] | null = null;
  let ki = 0;
  for (const line of lines) {
    const orderedMatch = line.match(/^(\d+)\. (.+)$/);
    const blockquoteMatch = line.match(/^> (.+)$/);
    if (orderedMatch) {
      if (!olist) olist = [];
      olist.push(<li key={ki++}>{renderInline(orderedMatch[2], `li-${ki}`)}</li>);
    } else {
      if (olist) {
        out.push(<ol key={ki++} className="chat-list">{olist}</ol>);
        olist = null;
      }
      if (blockquoteMatch) {
        out.push(<div key={ki++} className="chat-quote">{renderInline(blockquoteMatch[1], `bq-${ki}`)}</div>);
      } else if (line !== '') {
        out.push(<p key={ki++} className="chat-p">{renderInline(line, `p-${ki}`)}</p>);
      }
    }
  }
  if (olist) out.push(<ol key={ki} className="chat-list">{olist}</ol>);
  return out;
}

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Bienvenue ! Je suis l'assistant virtuel de la **CCIAMA**. Comment puis-je vous aider dans vos démarches d'entreprise ?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Merci pour votre question. Pour obtenir une **Carte de Membre de la CCIAMA**, vous devez :\n\n1. Remplir le formulaire d'adhésion en ligne\n2. Fournir une copie de votre **Registre du Commerce (RCCM)**\n3. Régler les frais annuels selon votre catégorie\n\n> Le délai moyen est de **48 heures** après dépôt du dossier complet.\n\nVous pouvez initier cette démarche via la rubrique [Services aux entreprises](/services).",
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            className="chat-launcher"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir l'assistant virtuel CCIAMA"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <span className="chat-launcher-dot" />
            <span className="chat-launcher-label">Assistant IA</span>
            <MessageCircle size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            role="dialog"
            aria-label="Assistant virtuel CCIAMA"
            aria-modal="true"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-head">
              <div className="chat-avatar" aria-hidden="true">IA</div>
              <div className="chat-meta">
                <div className="chat-title">Assistant IA</div>
                <div className="chat-status">
                  <span className="dot" />
                  Assistant du portail
                </div>
              </div>
              <button
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="chat-body"
              ref={bodyRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className="chat-msg-avatar" aria-hidden="true">
                    {msg.role === 'bot' ? 'IA' : 'U'}
                  </div>
                  <div className="chat-msg-bubble">
                    {renderMarkdown(msg.text)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg bot" aria-label="L'assistant rédige une réponse…">
                  <div className="chat-msg-avatar" aria-hidden="true">IA</div>
                  <div className="chat-msg-bubble">
                    <div className="typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="chat-suggestions" aria-label="Suggestions de questions">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}

            <form
              className="chat-input"
              onSubmit={e => { e.preventDefault(); sendMessage(input); }}
              aria-label="Envoyer un message"
            >
              <input
                placeholder="Posez votre question…"
                value={input}
                onChange={e => setInput(e.target.value)}
                aria-label="Message"
                autoComplete="off"
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Envoyer">
                <Send size={16} />
              </button>
            </form>

            <div className="chat-foot" aria-hidden="true">
              Propulsé par l'IA · Les réponses sont indicatives
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

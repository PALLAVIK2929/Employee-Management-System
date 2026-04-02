import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Bot, User, Loader2, Download, Trash2, Plus, History, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const SYSTEM_PROMPT = `You are an HR Assistant for a company using an Employee Management System (EMS). 
You help employees and admins with questions about: 
- Leave policies and how to apply 
- Onboarding processes 
- Department structures 
- Company handbook and HR policies 
- Employee benefits and payroll queries 
- General HR best practices 
Keep responses concise, friendly, and professional. 
If asked something outside HR scope, politely redirect.`;

const ChatInterface = ({ isDrawer = false, onClose = null }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hr_chat_history');
    return saved ? JSON.parse(saved) : [
      { 
        role: 'assistant', 
        content: "Hi! I'm your HR Assistant. Ask me anything about company policies, leave rules, onboarding, or employee management.",
        timestamp: new Date().toISOString()
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What is the leave policy?",
    "How do I onboard a new employee?",
    "What are the working hours?",
    "How do I apply for leave?"
  ];

  useEffect(() => {
    localStorage.setItem('hr_chat_history', JSON.stringify(messages.slice(-10)));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride = null) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const newUserMsg = { 
      role: 'user', 
      content: messageText, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.concat(newUserMsg).map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content[0].text,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Something went wrong, please try again. (Make sure your VITE_ANTHROPIC_API_KEY is valid)",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const initialMsg = [{ 
      role: 'assistant', 
      content: "Hi! I'm your HR Assistant. Ask me anything about company policies, leave rules, onboarding, or employee management.",
      timestamp: new Date().toISOString()
    }];
    setMessages(initialMsg);
    localStorage.removeItem('hr_chat_history');
  };

  const exportChat = () => {
    const text = messages.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      backgroundColor: 'var(--bg-card)',
      color: 'var(--text-primary)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'var(--accent-color)', padding: '8px', borderRadius: '10px', color: '#fff' }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px' }}>HR Assistant</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Online
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={exportChat} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Export Chat"><Download size={18} /></button>
          <button onClick={clearChat} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Clear Chat"><Trash2 size={18} /></button>
          {isDrawer && <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>}
        </div>
      </div>

      {/* Message List */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '12px',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="var(--accent-color)" />
              </div>
            )}
            <div style={{ maxWidth: '80%' }}>
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: m.role === 'user' ? '18px 18px 0 18px' : '0 18px 18px 18px',
                backgroundColor: m.role === 'user' ? 'var(--accent-color)' : 'var(--bg-primary)',
                color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '1.5',
                boxShadow: 'var(--card-shadow)'
              }}>
                {m.content}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: 'var(--text-secondary)', 
                marginTop: '4px',
                textAlign: m.role === 'user' ? 'right' : 'left'
              }}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {m.role === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', animation: 'fadeInUp 0.3s ease-out' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="var(--accent-color)" />
            </div>
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px 20px', borderRadius: '0 18px 18px 18px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }} />
              <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }} />
              <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips */}
      {messages.length === 1 && (
        <div style={{ padding: '0 20px 10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(s)}
              style={{ 
                padding: '8px 14px', 
                borderRadius: '10px', 
                border: '1px solid var(--border-color)', 
                backgroundColor: 'var(--bg-card)', 
                color: 'var(--text-secondary)', 
                fontSize: '12px', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}
      >
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--bg-primary)', 
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            backgroundColor: 'var(--accent-color)', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: (!input.trim() || isLoading) ? 0.6 : 1
          }}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = window.location.pathname;

  if (!isAuthenticated || location === '/login' || location === '/handbook-chat') return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Drawer */}
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          bottom: '80px', 
          right: '0', 
          width: '380px', 
          height: '600px', 
          maxHeight: 'calc(100vh - 120px)',
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <ChatInterface isDrawer onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Bubble */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--accent-color)', 
          color: '#fff', 
          border: 'none', 
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {hasUnread && !isOpen && (
          <span style={{ position: 'absolute', top: '0', right: '0', width: '14px', height: '14px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #fff' }} />
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};

const HandbookChat = () => {
  const [sessions] = useState([
    { id: 1, title: 'Current Conversation', active: true },
    { id: 2, title: 'Vacation Policy Q&A', active: false },
    { id: 3, title: 'Onboarding Help', active: false },
  ]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '300px', 
        backgroundColor: 'var(--bg-card)', 
        borderRight: '1px solid var(--border-color)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px' 
      }}>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center',
          width: '100%', padding: '12px', borderRadius: '12px', 
          backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none',
          fontWeight: '700', cursor: 'pointer', marginBottom: '32px'
        }}>
          <Plus size={18} /> New Chat
        </button>

        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Recent Chats</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sessions.map(s => (
            <div key={s.id} style={{ 
              padding: '12px 16px', borderRadius: '10px', 
              backgroundColor: s.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: s.active ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              {s.active ? <MessageSquare size={16} /> : <History size={16} />} {s.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1 }}>
        <ChatInterface />
      </div>
    </div>
  );
};

export default HandbookChat;

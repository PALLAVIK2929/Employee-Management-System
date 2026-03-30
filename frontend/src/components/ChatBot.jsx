import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { 
  Send, Bot, User, Sparkles, MessageSquare, 
  ShieldCheck, Loader2, Plus, History, 
  BookOpen, Info, ExternalLink, Hash,
  Paperclip, Smile, Search, ChevronRight,
  MoreVertical, Download, Maximize2
} from 'lucide-react';

const ChatBot = () => {
  // 1. State Management
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI Handbook Assistant. I'm connected to the latest company policies, benefits guides, and conduct manuals. How can I help you navigate our platform today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    { title: "Vacation Policy", icon: "🏖️", text: "What is the annual leave policy?" },
    { title: "Expense Claims", icon: "💸", text: "How do I submit travel expenses?" },
    { title: "Health Benefits", icon: "🏥", text: "What health insurance do we provide?" },
    { title: "IT Support", icon: "💻", text: "How to reset my work password?" }
  ];

  // 2. Design Tokens
  const colors = {
    white: '#fff',
    pageBg: '#F3F4F6',
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    lightPurple: '#EEF2FF',
    muted: '#6B7280',
    border: '#E5E7EB',
    botBubble: '#F9FAFB',
    userBubble: '#1E1B4B',
    success: '#10B981'
  };

  // 3. Handlers
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg = { 
      text: messageText, 
      sender: 'user', 
      timestamp: new Date() 
    };
    
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    // Artificial delay for "thinking" feel
    setTimeout(async () => {
      setIsTyping(true);
      try {
        const response = await api.sendMessage(messageText);
        setMessages(prev => [...prev, { 
          text: response.reply, 
          sender: 'bot', 
          timestamp: new Date() 
        }]);
      } catch (error) {
        setMessages(prev => [...prev, { 
          text: "I'm having a bit of trouble reaching the handbook servers. Please try again or contact HR directly.", 
          sender: 'bot', 
          timestamp: new Date() 
        }]);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    }, 600);
  };

  const startNewChat = () => {
    setMessages([{ 
      text: "New session started. I'm ready to help with any handbook questions.", 
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  // 4. Styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: colors.white,
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
      animation: 'fadeUp 0.6s ease-out'
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#F9FAFB',
      borderRight: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 24px'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.white,
      position: 'relative'
    },
    header: {
      padding: '24px 40px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      zIndex: 10
    },
    messageList: {
      flex: 1,
      overflowY: 'auto',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
      backgroundSize: '30px 30px'
    },
    botBubble: {
      backgroundColor: colors.white,
      color: colors.primary,
      padding: '20px 24px',
      borderRadius: '0 24px 24px 24px',
      fontSize: '14px',
      lineHeight: '1.7',
      maxWidth: '80%',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      position: 'relative'
    },
    userBubble: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '20px 24px',
      borderRadius: '24px 24px 0 24px',
      fontSize: '14px',
      lineHeight: '1.7',
      maxWidth: '80%',
      boxShadow: '0 10px 15px -3px rgba(30, 27, 75, 0.2)'
    },
    inputArea: {
      padding: '32px 40px',
      borderTop: `1px solid ${colors.border}`,
      backgroundColor: colors.white
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: '#F9FAFB',
      padding: '8px 8px 8px 24px',
      borderRadius: '20px',
      border: `1.5px solid ${colors.border}`,
      transition: 'all 0.2s'
    },
    newChatBtn: {
      padding: '14px',
      borderRadius: '14px',
      backgroundColor: colors.primary,
      color: colors.white,
      fontSize: '13px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      cursor: 'pointer',
      marginBottom: '40px',
      boxShadow: '0 4px 12px rgba(30, 27, 75, 0.2)',
      transition: 'transform 0.2s'
    },
    sidebarItem: (active) => ({
      padding: '14px 16px',
      borderRadius: '12px',
      backgroundColor: active ? colors.lightPurple : 'transparent',
      color: active ? colors.accent : colors.muted,
      fontSize: '13px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      marginBottom: '6px',
      transition: 'all 0.2s'
    })
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .dot {
          width: 6px;
          height: 6px;
          background-color: #3D3B8E;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .message-item { animation: fadeUp 0.4s ease-out; }
      `}</style>

      {/* ── Sidebar ── */}
      <div style={styles.sidebar}>
        <div style={styles.newChatBtn} onClick={startNewChat}>
          <Plus size={18} /> New Conversation
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '11px', fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Recent Sessions</p>
          <div style={styles.sidebarItem(true)}>
            <MessageSquare size={16} /> Current Chat
          </div>
          <div style={styles.sidebarItem(false)}>
            <History size={16} /> Expense Policy Q&A
          </div>
          <div style={styles.sidebarItem(false)}>
            <History size={16} /> Remote Work Guide
          </div>

          <p style={{ fontSize: '11px', fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', marginTop: '40px' }}>Documentation</p>
          <div style={styles.sidebarItem(false)}>
            <BookOpen size={16} /> Employee Handbook
          </div>
          <div style={styles.sidebarItem(false)}>
            <ShieldCheck size={16} /> Benefits Summary
          </div>
          <div style={styles.sidebarItem(false)}>
            <Hash size={16} /> Code of Conduct
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: colors.lightPurple, borderRadius: '20px', marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.accent, marginBottom: '8px' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '12px', fontWeight: '800' }}>AI Powered</span>
          </div>
          <p style={{ fontSize: '11px', color: colors.accent, opacity: 0.8, lineHeight: '1.6', margin: 0 }}>
            Our assistant uses RAG technology to fetch answers directly from verified corporate documents.
          </p>
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: colors.lightPurple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.accent, boxShadow: '0 4px 10px rgba(61, 59, 142, 0.1)' }}>
              <Bot size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: colors.primary, margin: 0 }}>AI Handbook Assistant</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: colors.muted }}>Verified Knowledge Base · Active</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.muted, cursor: 'pointer' }}><Download size={20} /></button>
            <button style={{ padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.muted, cursor: 'pointer' }}><Maximize2 size={20} /></button>
          </div>
        </header>

        {/* Message List */}
        <div style={styles.messageList}>
          {messages.map((msg, i) => (
            <div key={i} className="message-item" style={{ display: 'flex', gap: '20px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                backgroundColor: msg.sender === 'bot' ? colors.lightPurple : colors.primary,
                color: msg.sender === 'bot' ? colors.accent : colors.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: msg.sender === 'user' ? '0 4px 10px rgba(30, 27, 75, 0.2)' : 'none'
              }}>
                {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '8px', maxWidth: '100%' }}>
                <div style={msg.sender === 'bot' ? styles.botBubble : styles.userBubble}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {msg.sender === 'bot' ? 'Assistant' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: colors.lightPurple, color: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} />
              </div>
              <div style={{ ...styles.botBubble, padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div className="dot" style={{ animationDelay: '0s' }} />
                  <div className="dot" style={{ animationDelay: '0.2s' }} />
                  <div className="dot" style={{ animationDelay: '0.4s' }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: colors.accent, marginLeft: '8px' }}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Area */}
        <div style={styles.inputArea}>
          {messages.length < 3 && !isLoading && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {suggestions.map(s => (
                <div 
                  key={s.title} 
                  style={{ padding: '10px 20px', borderRadius: '14px', border: `1px solid ${colors.border}`, fontSize: '13px', fontWeight: '700', color: colors.primary, cursor: 'pointer', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                  onClick={() => handleSend(null, s.text)}
                  onMouseOver={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.backgroundColor = colors.lightPurple; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.backgroundColor = '#fff'; }}
                >
                  <span>{s.icon}</span> {s.title}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSend}>
            <div style={styles.inputWrapper}>
              <Smile size={22} style={{ color: colors.muted, cursor: 'pointer' }} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about company policies..."
                disabled={isLoading}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', fontWeight: '500', outline: 'none', color: colors.primary, padding: '12px 0' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Paperclip size={22} style={{ color: colors.muted, cursor: 'pointer' }} />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: input.trim() && !isLoading ? colors.primary : '#E5E7EB',
                    color: colors.white,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={14} style={{ color: colors.success }} />
              <span style={{ fontSize: '11px', fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>End-to-End Encrypted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={14} style={{ color: colors.accent }} />
              <span style={{ fontSize: '11px', fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Source Material</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

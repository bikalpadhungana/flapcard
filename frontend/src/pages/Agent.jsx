import React, { useState, useEffect, useRef } from 'react';


function Agent({ userinfo = {}, onClose }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Destructure with safe defaults
  const { 
    username = 'User',
    phone_number_1,
    email,
    description = '',
    user_photo,
    jobtitle,
    organization,
    website_url,
    data: userData = ''
  } = userinfo;

  // Style defaults
  const defaultColor = userinfo.user_colour || '#1c73ba';
  const firstName = username.split(' ')[0];
  const assistantName = `${firstName}'s Assistant`;

  // Optimized system message
  const systemMessage = {
    role: 'system',
    content: `You are ${firstName}'s cheerful assistant. Use:
             ${username} | ${jobtitle || ''} | ${organization || ''}
             Contact: ${phone_number_1 || ''} | ${email || ''}
             Services: ${description || ''}
             Website: ${website_url || ''}
             Products: ${userData || ''}

             Rules:
             1. First check Products/Contact info
             2. Use 😊 emojis where appropriate
             3. Keep answers under 10 words
             4. Unknown queries: "Let me connect you with ${firstName}!"`
  };

  useEffect(() => {
    document.title = `${firstName}'s Assistant`;
  }, [firstName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
  
    const userMessage = { sender: 'user', text: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setQuery('');
  
    setIsTyping(true);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-distill-llama-70b:free',
          messages: [systemMessage, ...newMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))],
        }),
      });
  
      const data = await response.json();
      const botText = data.choices?.[0]?.message?.content || `Let me connect you with ${firstName}!`;
      
      const botMessage = {
        sender: 'bot',
        text: botText,
        quickReplies: generateQuickReplies(botText)
      };
  
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `😊 Please contact ${firstName} directly!`
      }]);
    }
    setIsTyping(false);
  };
  
  // Context-aware quick replies
  const generateQuickReplies = (botText) => {
    const replies = [];
    const lowerText = botText.toLowerCase();
  
    // Only show contact methods if mentioned in the response
    if (phone_number_1 && lowerText.match(/call|phone|contact|number/)) {
      replies.push({ text: '📞 Call', action: 'call' });
    }
    
    if (email && lowerText.match(/email|contact|reach out/)) {
      replies.push({ text: '📧 Email', action: 'email' });
    }
    
    if (website_url && lowerText.match(/website|site|online|visit/)) {
      replies.push({ text: '🌐 Website', action: 'website' });
    }
    
    if (userData && lowerText.match(/product|service|offer|provide/)) {
      replies.push({ text: '🛍 Products', action: 'products' });
    }
  
    return replies.slice(0, 2); // Show max 2 most relevant
  };
  
  const handleQuickAction = (action) => {
    switch(action) {
      case 'call': 
        window.location.href = `tel:${phone_number_1}`;
        break;
      case 'email': 
        window.location.href = `mailto:${email}`;
        break;
      case 'website': 
        window.open(website_url, '_blank');
        break;
      case 'products': 
        setQuery('Tell me about your products/services');
        break;
      default:
        break;
    }
  };

  return (
    <div className="agent-container">
      <style>{`
        .agent-container {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          font-family: system-ui, sans-serif;
        }

        .agent-header {
          display: flex;
          align-items: center;
          padding: 20px;
          background: ${defaultColor};
          border-radius: 20px 20px 0 0;
          color: white;
          position: relative;
        }

        .agent-avatar {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          margin-right: 15px;
          object-fit: cover;
        }

        .message.user .bubble {
          background: ${defaultColor};
          color: white;
        }

        .input-area button {
          background: ${defaultColor};
          transition: opacity 0.2s;
        }

        .input-area button:disabled {
          opacity: 0.7;
        }

        .quick-replies button {
          border: 1px solid ${defaultColor};
          color: ${defaultColor};
          margin: 4px;
          padding: 6px 12px;
          border-radius: 20px;
          background: transparent;
        }

        .typing-indicator span {
          animation: bounce 1s infinite;
          margin: 0 2px;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>

      <div className="agent-header">
        <img src={user_photo} alt={username} className="agent-avatar" />
        <div className="agent-info">
          <h2>{assistantName}</h2>
          <p>{[jobtitle, organization].filter(Boolean).join(' | ')}</p>
        </div>
        <button onClick={onClose} className="close-button" style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer'
        }}>×</button>
      </div>

      <div className="conversation-window" style={{ padding: '15px' }}>
        <div className="welcome-message" style={{ 
          textAlign: 'center',
          padding: '15px 0',
          borderBottom: '1px solid #eee'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#666' }}>How can I help you today? 😊</p>
          <div className="quick-questions" style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center'
          }}>
            <button onClick={() => setQuery(`Tell me about ${firstName}`)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `1px solid ${defaultColor}`,
                background: 'transparent',
                color: defaultColor,
                cursor: 'pointer'
              }}>
              About
            </button>
            {phone_number_1 && (
              <button onClick={() => setQuery('How can I contact?')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${defaultColor}`,
                  background: 'transparent',
                  color: defaultColor,
                  cursor: 'pointer'
                }}>
                Contact
              </button>
            )}
          </div>
        </div>

        <div className="message-area" style={{
          height: '300px',
          overflowY: 'auto',
          padding: '15px 0'
        }}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`} style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
            }}>
              {msg.sender === 'bot' && <div style={{
                fontSize: '0.8em',
                color: '#666',
                marginRight: '8px'
              }}>🤖 Assistant</div>}
              <div className="bubble" style={{
                maxWidth: '70%',
                padding: '10px 15px',
                borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                background: msg.sender === 'user' ? defaultColor : '#f0f0f0',
                color: msg.sender === 'user' ? 'white' : '#333',
                wordBreak: 'break-word'
              }}>
                {msg.text}
                {msg.quickReplies?.length > 0 && (
                  <div className="quick-replies" style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexWrap: 'wrap'
                  }}>
                    {msg.quickReplies.map((qr, i) => (
                      <button key={i} onClick={() => handleQuickAction(qr.action)}
                        style={{
                          border: `1px solid ${defaultColor}`,
                          color: defaultColor,
                          margin: '4px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          background: 'transparent',
                          cursor: 'pointer'
                        }}>
                        {qr.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              color: '#666'
            }}>
              <span style={{ animationDelay: '0s' }}>•</span>
              <span style={{ animationDelay: '0.2s' }}>•</span>
              <span style={{ animationDelay: '0.4s' }}>•</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area" style={{
          display: 'flex',
          gap: '10px',
          padding: '15px 0',
          borderTop: '1px solid #eee'
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${assistantName}...`}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '25px',
              outline: 'none'
            }}
          />
          <button onClick={handleSend} disabled={isTyping}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer'
            }}>
            {isTyping ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

Agent.defaultProps = {
  userinfo: {},
  onClose: () => {}
};

export default Agent;
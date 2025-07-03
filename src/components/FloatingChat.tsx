
import { useState } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { 
          message: currentMessage,
          history: messages.slice(-5) // Send last 5 messages for context
        }
      });

      console.log('Chat response:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I couldn't process your message.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-96">
          <div className="glass-effect rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl animate-scale-in h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Assistant</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Online • Always ready to help</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.isUser
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white/60 dark:bg-slate-700/60 text-gray-900 dark:text-white backdrop-blur-sm'
                      }`}
                    >
                      {msg.isUser ? (
                        <p>{msg.text}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100">
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const inline = !match;
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    customStyle={{
                                      background: '#1e293b',
                                      padding: '1rem',
                                      borderRadius: '0.375rem',
                                      fontSize: '0.75rem'
                                    }}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code 
                                    className="bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-xs font-mono" 
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              h1: ({ children }: any) => (
                                <h1 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">{children}</h1>
                              ),
                              h2: ({ children }: any) => (
                                <h2 className="text-base font-bold text-red-600 dark:text-red-400 mb-2">{children}</h2>
                              ),
                              h3: ({ children }: any) => (
                                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">{children}</h3>
                              ),
                              p: ({ children }: any) => (
                                <p className="mb-2 leading-relaxed">{children}</p>
                              ),
                              ul: ({ children }: any) => (
                                <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                              ),
                              ol: ({ children }: any) => (
                                <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                              ),
                              li: ({ children }: any) => (
                                <li className="text-sm">{children}</li>
                              ),
                              strong: ({ children }: any) => (
                                <strong className="font-bold text-blue-600 dark:text-blue-400">{children}</strong>
                              ),
                              em: ({ children }: any) => (
                                <em className="italic text-purple-600 dark:text-purple-400">{children}</em>
                              )
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      )}
                      <p className={`text-xs mt-1 opacity-70 ${
                        msg.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-white/10 dark:border-slate-700/50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-1 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;

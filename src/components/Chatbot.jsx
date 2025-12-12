import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, X, Sparkles, MessageSquare, Calendar, Star, Route, Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = "AIzaSyBm3X7W2njci6cwa0UyN5KoBYIIFW-xgrA"; 

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true); 
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!showWelcome) scrollToBottom();
  }, [messages, showWelcome]);

  const handleSend = async (textInput = input) => {
    const messageText = textInput.trim();
    if (!messageText) return;
    if (showWelcome) setShowWelcome(false);

    const userMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        if (API_KEY === "AIzaSyBm3X7W2njci6cwa0UyN5KoBYIIFW-xgrA" || !API_KEY) throw new Error("No API Key");
        
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = `You are Vyom, Hampi Guide. User: "${messageText}". Short, helpful answer (50 words).`;
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please check API Key." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const QuickActionButton = ({ icon: Icon, text, query }) => (
    <button 
      onClick={() => handleSend(query)}
      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-brand-accent/50 hover:shadow-md transition-all text-left group"
    >
      <div className="bg-brand-bg p-2 rounded-xl text-brand-accent group-hover:scale-110 transition">
        <Icon size={20} />
      </div>
      <span className="font-bold text-brand-dark text-sm">{text}</span>
    </button>
  );

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
            >
            <button 
                onClick={() => setIsOpen(true)}
                className="pointer-events-auto bg-brand-dark text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-all duration-300 group"
            >
                <div className="bg-brand-accent p-1.5 rounded-full group-hover:rotate-12 transition">
                    <Sparkles size={16} className="text-white" />
                </div>
                <span className="font-serif font-bold text-sm tracking-wide">Clueless? Let's create your next trip...</span>
            </button>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/30 backdrop-blur-sm">
                <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
                
                <motion.div 
                    initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                    // SILKY SMOOTH ANIMATION
                    transition={{ type: "spring", damping: 20, stiffness: 100, mass: 0.8 }} 
                    // WIDER CARD
                    className="bg-white w-full max-w-xl h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative z-10"
                >
                    {/* Header */}
                    <div className="bg-white p-5 flex justify-between items-center border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="text-brand-accent" size={24} />
                            <div>
                                <h3 className="font-bold text-brand-dark text-xl font-serif">Hampi Guide</h3>
                                <p className="text-xs text-gray-500">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-brand-dark hover:bg-gray-100 p-2 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-brand-bg/30">
                        {showWelcome ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                <div className="bg-brand-accent/10 p-5 rounded-full mb-2">
                                    <Sparkles size={40} className="text-brand-accent" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-brand-dark mb-2 font-serif">Namaskara!</h2>
                                    <p className="text-gray-600">I'm Vyom, your AI travel companion.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <QuickActionButton icon={Calendar} text="2-Day Itinerary" query="Plan a 2-day itinerary for Hampi." />
                                    <QuickActionButton icon={Star} text="Top 5 Sites" query="What are the top 5 must-visit sites?" />
                                    <QuickActionButton icon={Route} text="Walking Route" query="Suggest a walking route for ruins." />
                                    <QuickActionButton icon={Compass} text="Hidden Gems" query="Tell me about hidden gems." />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-br-none shadow-md' : 'bg-white border border-gray-200 text-brand-dark rounded-bl-none shadow-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && <div className="text-gray-500 text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Vyom is thinking...</div>}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about Hampi heritage sites..."
                            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
                        />
                        <button 
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className="bg-brand-accent text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#ff8547] transition shadow-lg disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
}
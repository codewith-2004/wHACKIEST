import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, X, Sparkles, MessageSquare, Calendar, Star, Route, Compass, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// ✅ API Key from Environment Variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Chatbot = React.forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    React.useImperativeHandle(ref, () => ({
        openWithQuery: (query) => {
            setIsOpen(true);
            handleSend(query);
        }
    }));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!showWelcome) scrollToBottom();
    }, [messages, showWelcome]);

    // RESET FUNCTION: Clears chat and shows buttons again
    const resetChat = () => {
        setMessages([]);
        setShowWelcome(true);
        setInput("");
    };

    const handleSend = async (textInput = input) => {
        const messageText = textInput.trim();
        if (!messageText) return;

        // Hide welcome screen if visible
        if (showWelcome) setShowWelcome(false);

        // 1. Add User Message
        const userMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            if (!API_KEY) throw new Error("MISSING_KEY");

            // NOTE: Using "gemini-2.5-flash" as requested by user.
            console.log("Talking to Gemini using model: gemini-2.5-flash");

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `You are Vyom, an expert AI tour guide for Hampi.
        The user wants assistance with their trip. 
        User Query: "${messageText}".
        
        Instructions:
        - If they ask for an itinerary, provide a structured day-by-day plan.
        - If they ask about history, tell a short, engaging story.
        - Keep responses friendly, exciting, and helpful.
        - Use emojies where appropriate.
        - Max length: 150 words (unless it's a detailed itinerary).`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'model', text: text }]);
        } catch (error) {
            console.error("Gemini Error:", error);

            let errorMessage;

            if (error.message.includes("404")) {
                errorMessage = `⚠️ Model Not Found: "gemini-2.5-flash" was not found on your API key's project. Verify you have access to this preview/new model.`;
            } else if (error.message.includes("403")) {
                errorMessage = `⚠️ Access Denied: API Key does not have permission for "gemini-2.5-flash".`;
            } else if (error.message.includes("MISSING_KEY")) {
                errorMessage = "⚠️ Configuration Error: VITE_GEMINI_API_KEY is missing from .env file.";
            } else {
                errorMessage = `Connection failed: ${error.message}`;
            }

            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
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
                            className="pointer-events-auto bg-brand-dark text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-all duration-300 group border border-white/20"
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
                            transition={{ type: "spring", damping: 20, stiffness: 100, mass: 0.8 }}
                            className="bg-white w-full max-w-xl h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative z-10"
                        >
                            {/* Header with RESET button */}
                            <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100 shadow-sm z-20">
                                <div className="flex items-center gap-2">
                                    <div className="bg-brand-accent/10 p-2 rounded-lg">
                                        <MessageSquare className="text-brand-accent" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-dark text-lg font-serif">Hampi Guide</h3>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* RESET BUTTON */}
                                    <button onClick={resetChat} title="Reset Chat" className="text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 p-2 rounded-full transition">
                                        <RotateCcw size={20} />
                                    </button>
                                    {/* CLOSE BUTTON */}
                                    <button onClick={() => setIsOpen(false)} title="Close" className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 bg-brand-bg/30">
                                {showWelcome ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                        <div className="bg-white p-4 rounded-full shadow-md mb-2 relative">
                                            <Sparkles size={32} className="text-brand-accent" />
                                            <span className="absolute top-0 right-0 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-brand-dark mb-2 font-serif">Namaskara!</h2>
                                            <p className="text-gray-600 max-w-xs mx-auto text-sm">I'm Vyom, your AI companion. I know where you are and can guide you.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
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
                                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm prose prose-sm max-w-none ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-br-none prose-invert' : 'bg-white border border-gray-200 text-brand-dark rounded-bl-none'}`}>
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wide">
                                                    <Loader2 size={14} className="animate-spin text-brand-accent" />
                                                    Vyom is thinking...
                                                </div>
                                            </div>
                                        )}
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
                                    className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all text-sm font-medium"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-brand-accent text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#ff8547] transition shadow-lg disabled:opacity-50 hover:scale-105 active:scale-95"
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
});

export default Chatbot;
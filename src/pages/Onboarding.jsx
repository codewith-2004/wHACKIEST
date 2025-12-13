import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { Baby, PersonStanding, Check, Calendar, ArrowRight } from 'lucide-react';

export default function Onboarding() {
    const { updateProfile } = useGamification();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [profile, setProfile] = useState({
        avatar: '',
        username: '',
        gender: '',
        dob: '',
    });

    // Avatar Choices (Emojis for now, can be images)
    const avatars = [
        '🤠', '🧕', '🤴', '👸', '👮‍♂️', '💂‍♀️',
        '👳‍♂️', '👲', '🧛‍♂️', '🧜‍♀️', '🧞‍♂️', '🧚‍♀️',
        '🚴', '🧗‍♀️', '🧙‍♂️', '🦹‍♀️', '👽', '🤖'
    ];

    const handleNext = () => {
        if (step === 1 && profile.avatar) setStep(2);
        else if (step === 2 && profile.username) setStep(3);
        else if (step === 3 && profile.gender) setStep(4);
    };

    const handleComplete = () => {
        if (profile.dob) {
            updateProfile(profile);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF3E1] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors duration-300">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                    <motion.div
                        className="h-full bg-brand-accent"
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-black text-brand-dark mb-2">Choose Your Avatar</h2>
                            <p className="text-gray-500 mb-8">This is how you'll appear on the leaderboard.</p>

                            <div className="grid grid-cols-6 gap-4 mb-8">
                                {avatars.map((av) => (
                                    <button
                                        key={av}
                                        onClick={() => setProfile({ ...profile, avatar: av })}
                                        className={`text-4xl p-4 rounded-2xl transition-all hover:scale-110 active:scale-95 ${profile.avatar === av
                                            ? 'bg-brand-accent shadow-lg shadow-orange-500/30 scale-110'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        {av}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!profile.avatar}
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-black text-brand-dark mb-2">What should we call you?</h2>
                            <p className="text-gray-500 mb-8">Choose a unique username for your adventures.</p>

                            <div className="mb-12">
                                <input
                                    type="text"
                                    value={profile.username}
                                    placeholder="@ExplorerName"
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-center text-2xl font-bold text-brand-dark outline-none focus:border-brand-accent transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!profile.username}
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-black text-brand-dark mb-2">Select Your Gender</h2>
                            <p className="text-gray-500 mb-8">Checking who's exploring more!</p>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                {[
                                    { id: 'male', label: 'Male', icon: <PersonStanding size={40} /> },
                                    { id: 'female', label: 'Female', icon: <WomanIcon size={40} /> },
                                    { id: 'other', label: 'Prefer not to say', icon: <Sparkles size={40} /> }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setProfile({ ...profile, gender: opt.id })}
                                        className={`p-6 rounded-3xl border-4 flex flex-col items-center gap-4 transition-all ${profile.gender === opt.id
                                            ? 'border-brand-accent bg-orange-50 text-brand-accent'
                                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                                            } ${opt.id === 'other' ? 'col-span-2' : ''}`}
                                    >
                                        {opt.icon}
                                        <span className="font-bold">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!profile.gender}
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-black text-brand-dark mb-2">When is your Birthday?</h2>
                            <p className="text-gray-500 mb-8">We might have a surprise for you!</p>

                            <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 mb-12">
                                <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-4">
                                    <Calendar size={40} className="text-brand-accent" />
                                </div>
                                <input
                                    type="date"
                                    value={profile.dob}
                                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                    className="w-full bg-transparent text-center text-3xl font-bold text-brand-dark outline-none"
                                />
                            </div>

                            <button
                                onClick={handleComplete}
                                disabled={!profile.dob}
                                className="w-full bg-brand-accent text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Start Your Journey
                                <ArrowRight />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Icon Helper
const Sparkles = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
);

const WomanIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7l-5.5 11h11L12 7z" />
        <path d="M10 18v4" />
        <path d="M14 18v4" />
    </svg>
);

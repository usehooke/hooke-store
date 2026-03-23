'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, ArrowRight, Check } from 'lucide-react';
import { calculateRecommendedSize, FitnessGoal } from '@/lib/size-wizard';

interface SizeQuizModalProps {
 isOpen: boolean;
 onClose: () => void;
 onComplete: (size: string) => void;
}

export default function SizeQuizModal({ isOpen, onClose, onComplete }: SizeQuizModalProps) {
 const [step, setStep] = useState(1);
 const [height, setHeight] = useState(175);
 const [weight, setWeight] = useState(75);
 const [preference, setPreference] = useState<FitnessGoal>('regular');
 const [result, setResult] = useState<string | null>(null);

 const handleCalculate = () => {
 const recommended = calculateRecommendedSize({ height, weight, preference });
 setResult(recommended);
 setStep(4);
 };

 const reset = () => {
 setStep(1);
 setResult(null);
 onClose();
 };

 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="bg-white w-full max-w-md overflow-hidden shadow-2xl"
 >
 {/* Header */}
 <div className="bg-hooke-900 text-white p-6 flex justify-between items-center">
 <div className="flex items-center gap-2">
 <Ruler size={20} />
 <h2 className="text-sm font-bold tracking-widest">Provador Virtual Hooke</h2>
 </div>
 <button onClick={reset} className="hover:rotate-90 transition-transform">
 <X size={20} />
 </button>
 </div>

 <div className="p-8">
 <AnimatePresence mode="wait">
 {/* Step 1: Altura */}
 {step === 1 && (
 <motion.div 
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-6"
 >
 <div>
 <h3 className="text-xl font-black tracking-tight text-hooke-900 mb-2">Sua Altura</h3>
 <p className="text-xs text-gray-400 tracking-widest">Deslize para ajustar em cm</p>
 </div>
 
 <div className="py-8 text-center">
 <span className="text-6xl font-black text-hooke-900">{height}</span>
 <span className="text-xl font-bold text-gray-400 ml-2">cm</span>
 </div>

 <input 
 type="range" 
 min="150" 
 max="210" 
 value={height} 
 onChange={(e) => setHeight(Number(e.target.value))}
 className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-hooke-900"
 />

 <button 
 onClick={() => setStep(2)}
 className="w-full bg-hooke-900 text-white py-4 font-bold tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
 >
 Próximo <ArrowRight size={16} />
 </button>
 </motion.div>
 )}

 {/* Step 2: Peso */}
 {step === 2 && (
 <motion.div 
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-6"
 >
 <div>
 <h3 className="text-xl font-black tracking-tight text-hooke-900 mb-2">Seu Peso</h3>
 <p className="text-xs text-gray-400 tracking-widest">Aproxime o valor em kg</p>
 </div>
 
 <div className="py-8 text-center">
 <span className="text-6xl font-black text-hooke-900">{weight}</span>
 <span className="text-xl font-bold text-gray-400 ml-2">kg</span>
 </div>

 <input 
 type="range" 
 min="50" 
 max="150" 
 value={weight} 
 onChange={(e) => setWeight(Number(e.target.value))}
 className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-hooke-900"
 />

 <div className="flex gap-4">
 <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-4 font-bold tracking-widest text-[10px]">Voltar</button>
 <button onClick={() => setStep(3)} className="flex-[2] bg-hooke-900 text-white py-4 font-bold tracking-widest text-xs">Continuar</button>
 </div>
 </motion.div>
 )}

 {/* Step 3: Preferência */}
 {step === 3 && (
 <motion.div 
 key="step3"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-6"
 >
 <div>
 <h3 className="text-xl font-black tracking-tight text-hooke-900 mb-2">Caimento</h3>
 <p className="text-xs text-gray-400 tracking-widest">Como você gosta que a roupa fique?</p>
 </div>
 
 <div className="grid grid-cols-1 gap-3">
 {[
 { id: 'slim', label: 'Mais Justa', desc: 'Delineia mais o corpo' },
 { id: 'regular', label: 'Na Medida', desc: 'Caimento padrão Hooke' },
 { id: 'loose', label: 'Mais Larga', desc: 'Estilo Oversized/Folgado' }
 ].map((opt) => (
 <button
 key={opt.id}
 onClick={() => setPreference(opt.id as FitnessGoal)}
 className={`p-4 border-2 text-left transition-all ${preference === opt.id ? 'border-hooke-900 bg-hooke-50' : 'border-gray-100 hover:border-gray-200'}`}
 >
 <div className="flex justify-between items-center">
 <span className="font-bold tracking-widest text-xs text-hooke-900">{opt.label}</span>
 {preference === opt.id && <Check size={16} className="text-hooke-900" />}
 </div>
 <p className="text-[10px] text-gray-500 mt-1">{opt.desc}</p>
 </button>
 ))}
 </div>

 <button 
 onClick={handleCalculate}
 className="w-full bg-hooke-900 text-white py-4 font-bold tracking-widest text-xs hover:bg-black transition-colors"
 >
 Ver Resultado
 </button>
 </motion.div>
 )}

 {/* Step 4: Resultado */}
 {step === 4 && result && (
 <motion.div 
 key="result"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center space-y-8 py-4"
 >
 <div>
 <p className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-2">Recomendamos o tamanho</p>
 <div className="relative inline-block">
 <span className="text-8xl font-black text-hooke-900 tracking-tighter">{result}</span>
 <motion.div 
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.3, type: 'spring' }}
 className="absolute -top-2 -right-6 bg-green-500 text-white p-2 rounded-full"
 >
 <Check size={20} />
 </motion.div>
 </div>
 </div>

 <p className="text-gray-500 text-sm leading-relaxed px-4">
 Com base em suas medidas ({height}cm, {weight}kg), o tamanho <strong className="text-hooke-900">{result}</strong> terá o caimento ideal para o seu perfil.
 </p>

 <div className="space-y-3">
 <button 
 onClick={() => {
 onComplete(result);
 reset();
 }}
 className="w-full bg-hooke-900 text-white py-4 font-bold tracking-widest text-xs hover:bg-black transition-colors"
 >
 Usar este tamanho
 </button>
 <button 
 onClick={() => setStep(1)}
 className="w-full text-xs font-bold tracking-widest text-gray-400 hover:text-hooke-900"
 >
 Refazer Teste
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </motion.div>
 </div>
 );
}

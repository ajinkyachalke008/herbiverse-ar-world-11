import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Leaf, 
  Lock,
  Play,
  RotateCcw,
  Home,
  Zap,
  Crown,
  Sword,
  Shield,
  Heart,
  Coins,
  Gem
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Game data
const questionsLevel1 = [
  {
    id: 1,
    question: "Which plant is called 'Holy Basil'?",
    options: ["Neem", "Tulsi", "Aloe Vera", "Mint"],
    correct: 1,
    explanation: "Tulsi is called Holy Basil and is widely used in Ayurveda for immunity and healing."
  },
  {
    id: 2,
    question: "What is the main benefit of Turmeric in Ayurveda?",
    options: ["Sleep enhancement", "Anti-inflammatory", "Hair growth", "Weight loss"],
    correct: 1,
    explanation: "Turmeric contains curcumin, which has powerful anti-inflammatory and antioxidant properties."
  },
  {
    id: 3,
    question: "Which herb is known as the 'King of Herbs' in Ayurveda?",
    options: ["Ashwagandha", "Brahmi", "Neem", "Ginseng"],
    correct: 0,
    explanation: "Ashwagandha is called the 'King of Herbs' and is renowned for stress relief and vitality."
  },
  {
    id: 4,
    question: "What does 'Ayurveda' literally mean?",
    options: ["Plant medicine", "Natural healing", "Knowledge of life", "Ancient wisdom"],
    correct: 2,
    explanation: "Ayurveda comes from Sanskrit: 'Ayu' (life) + 'Veda' (knowledge), meaning 'Knowledge of Life'."
  },
  {
    id: 5,
    question: "Which plant is commonly used for skin conditions in Ayurveda?",
    options: ["Tulsi", "Neem", "Ginger", "Cardamom"],
    correct: 1,
    explanation: "Neem has antibacterial and antifungal properties, making it excellent for treating skin conditions."
  }
];

const badges = {
  1: { 
    name: "Herbal Apprentice", 
    icon: "⚔️", 
    description: "Mastered Basic Herbal Knowledge",
    color: "from-green-400 to-emerald-600",
    xp: 100
  },
  2: { 
    name: "Ayurveda Warrior", 
    icon: "🛡️", 
    description: "Conquered Medicinal Mysteries",
    color: "from-blue-400 to-cyan-600",
    xp: 250
  },
  3: { 
    name: "Yoga Sage", 
    icon: "🔮", 
    description: "Achieved Spiritual Mastery",
    color: "from-purple-400 to-pink-600",
    xp: 500
  },
  4: { 
    name: "Grand Herbalist", 
    icon: "👑", 
    description: "Legendary Master of All Realms",
    color: "from-yellow-400 to-orange-600",
    xp: 1000
  }
};

// Gaming particles component
const FloatingParticles = ({ count = 20 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent-glow rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const HerbalQuest = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [hp, setHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: 'correct' | 'wrong' }[]>([]);
  const { toast } = useToast();

  const startQuest = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setXp(0);
    setHp(100);
    setCombo(0);
    setAnswers([]);
    setShowFeedback(false);
    setLastAnswer(null);
    setParticles([]);
  };

  const triggerParticles = (type: 'correct' | 'wrong', x: number, y: number) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      type
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleAnswer = (selectedAnswer: number, event: React.MouseEvent) => {
    const question = questionsLevel1[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    setAnswers([...answers, selectedAnswer]);
    setLastAnswer({
      correct: isCorrect,
      explanation: question.explanation
    });
    setShowFeedback(true);

    if (isCorrect) {
      const comboBonus = combo > 0 ? combo * 2 : 0;
      const pointsEarned = 10 + comboBonus;
      const xpEarned = 25 + comboBonus;
      
      setScore(score + pointsEarned);
      setXp(xp + xpEarned);
      setCombo(combo + 1);
      triggerParticles('correct', x, y);
      
      toast({
        title: `🎯 Critical Hit! +${pointsEarned} points`,
        description: `${combo > 0 ? `${combo}x Combo Bonus! ` : ''}${question.explanation}`,
        duration: 3000,
      });
    } else {
      setHp(Math.max(0, hp - 15));
      setCombo(0);
      triggerParticles('wrong', x, y);
      
      toast({
        title: "💔 Missed! -15 HP",
        description: `Correct answer: ${question.options[question.correct]}. ${question.explanation}`,
        duration: 4000,
        variant: "destructive"
      });
    }

    // Move to next question or results after delay
    setTimeout(() => {
      if (currentQuestion < questionsLevel1.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setLastAnswer(null);
      } else {
        setGameState('results');
      }
    }, 3000);
  };

  const resetGame = () => {
    setGameState('intro');
    setCurrentQuestion(0);
    setScore(0);
    setXp(0);
    setHp(100);
    setCombo(0);
    setAnswers([]);
    setShowFeedback(false);
    setLastAnswer(null);
    setParticles([]);
  };

  const progress = ((currentQuestion + 1) / questionsLevel1.length) * 100;
  const finalScore = Math.round((score / (questionsLevel1.length * 10)) * 100);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 overflow-hidden">
      {/* Gaming Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
        <FloatingParticles count={30} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Dynamic Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-4 h-4 pointer-events-none z-50 ${
              particle.type === 'correct' 
                ? 'text-green-400 text-2xl' 
                : 'text-red-400 text-2xl'
            }`}
            style={{ left: particle.x, top: particle.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.5, 0], 
              opacity: [1, 1, 0],
              y: particle.y - 100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {particle.type === 'correct' ? '✨' : '💥'}
          </motion.div>
        ))}
      </AnimatePresence>

      <Navigation />
      
      <main className="pt-20 pb-10 relative z-10">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            
            {/* Intro Screen */}
            {gameState === 'intro' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto text-center"
              >
                <motion.div
                  className="mb-8 relative"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* Epic Title with Glowing Effects */}
                  <div className="relative mb-6">
                    <motion.div 
                      className="text-9xl mb-4 relative z-10"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      ⚔️
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 text-9xl text-accent-glow/30 blur-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚔️
                    </motion.div>
                  </div>
                  
                  <motion.h1 
                    className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    HERBAL QUEST
                  </motion.h1>
                  
                  <motion.div
                    className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡ LEGENDARY CHALLENGES ⚡
                  </motion.div>
                  
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    🌟 <strong>Enter the Arena of Ancient Wisdom!</strong> 🌟<br/>
                    Battle through mystical herb knowledge, unlock legendary achievements, 
                    and rise from apprentice to Grand Herbalist!
                  </p>
                </motion.div>

                {/* Gaming Stats Panel */}
                <Card className="max-w-3xl mx-auto mb-8 bg-slate-800/50 border-green-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Sword className="w-7 h-7 text-yellow-400" />
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        LEVEL 1: HERBAL APPRENTICE
                      </span>
                      <Shield className="w-7 h-7 text-cyan-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Quest Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          QUEST OBJECTIVES
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            <span>Survive 5 Knowledge Battles</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span>Master Multiple Choice Combat</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            <span>Unlock Ancient Herbal Secrets</span>
                          </div>
                          <div className="flex items-center gap-2 text-yellow-400">
                            <Crown className="w-4 h-4" />
                            <span className="font-semibold">Achieve Apprentice Rank!</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column - Rewards */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                          <Gem className="w-5 h-5" />
                          LEGENDARY REWARDS
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span>Up to 50 Gold per correct answer</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Star className="w-4 h-4 text-cyan-400" />
                            <span>125 XP for quest completion</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-semibold">Combo Multiplier System</span>
                          </div>
                          <div className="flex items-center gap-2 text-orange-400">
                            <Trophy className="w-4 h-4" />
                            <span className="font-semibold">⚔️ Herbal Apprentice Badge</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievement Gallery */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries(badges).map(([level, badge]) => (
                    <motion.div
                      key={level}
                      whileHover={{ scale: level === '1' ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={`relative overflow-hidden border-2 transition-all duration-300 ${
                          level === '1' 
                            ? `bg-gradient-to-br ${badge.color} border-yellow-400/50 shadow-lg shadow-yellow-400/20` 
                            : 'bg-slate-800/30 border-slate-600/50 opacity-60'
                        }`}
                      >
                        <CardContent className="p-4 text-center relative">
                          {level === '1' && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <div className="text-4xl mb-2 relative z-10">{badge.icon}</div>
                          <div className="font-bold text-sm mb-1 relative z-10">{badge.name}</div>
                          <div className="text-xs text-slate-400 mb-2 relative z-10">{badge.description}</div>
                          <div className="text-xs font-semibold text-yellow-400 relative z-10">
                            {badge.xp} XP
                          </div>
                          {level !== '1' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                              <Lock className="w-6 h-6 text-slate-500" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={startQuest}
                    className="relative group px-12 py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-white font-bold text-xl rounded-xl border-0 shadow-2xl overflow-hidden"
                  >
                    {/* Button glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 group-hover:opacity-100 blur-xl"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Button content */}
                    <div className="relative z-10 flex items-center gap-3">
                      <Sword className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      <span>⚡ ENTER THE ARENA ⚡</span>
                      <Crown className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 border-2 border-yellow-400/50 rounded-xl"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(234, 179, 8, 0.3)",
                          "0 0 40px rgba(234, 179, 8, 0.6)",
                          "0 0 20px rgba(234, 179, 8, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Quiz Screen */}
            {gameState === 'playing' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Gaming HUD */}
                <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-600/50 backdrop-blur-sm">
                  {/* Top Row - Game Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-bold">HP</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                          style={{ width: `${hp}%` }}
                          animate={{ width: `${hp}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-sm text-slate-300 mt-1">{hp}/100</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">GOLD</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-400">{score}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Star className="w-5 h-5 text-cyan-400" />
                        <span className="text-cyan-400 font-bold">XP</span>
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">{xp}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400 font-bold">COMBO</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {combo > 0 && (
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                            key={combo}
                          >
                            {combo}x
                          </motion.span>
                        )}
                        {combo === 0 && '0x'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-300">
                        BATTLE {currentQuestion + 1} OF {questionsLevel1.length}
                      </span>
                      <span className="text-sm text-yellow-400 font-semibold">
                        HERBAL APPRENTICE QUEST
                      </span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-4 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${progress}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Battle Arena - Question Card */}
                <Card className="mb-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-green-500/30 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5" />
                  <CardHeader className="text-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        ⚔️
                      </motion.div>
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-4 py-1">
                        KNOWLEDGE BATTLE
                      </Badge>
                      <motion.div
                        animate={{ rotate: [0, -360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        🛡️
                      </motion.div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-center mb-4 text-slate-100">
                      {questionsLevel1[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questionsLevel1[currentQuestion].options.map((option, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                          whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className={`
                              p-6 h-auto text-left justify-start w-full text-white font-semibold
                              bg-gradient-to-r from-slate-700/50 to-slate-600/50 
                              border-2 border-slate-500/50 
                              hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20
                              transition-all duration-300 disabled:opacity-50
                              ${!showFeedback ? 'hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20' : ''}
                            `}
                            onClick={(e) => handleAnswer(index, e)}
                            disabled={showFeedback}
                          >
                            <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-4 font-bold text-white text-lg shadow-lg">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-lg">{option}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Epic Feedback */}
                <AnimatePresence>
                  {showFeedback && lastAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className={`
                        border-4 relative overflow-hidden
                        ${lastAnswer.correct 
                          ? 'border-green-400 bg-gradient-to-br from-green-900/50 to-emerald-900/50' 
                          : 'border-red-400 bg-gradient-to-br from-red-900/50 to-pink-900/50'
                        }
                      `}>
                        {/* Animated background */}
                        <motion.div
                          className={`absolute inset-0 ${
                            lastAnswer.correct 
                              ? 'bg-gradient-to-br from-green-400/10 to-emerald-400/10' 
                              : 'bg-gradient-to-br from-red-400/10 to-pink-400/10'
                          }`}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <CardContent className="p-8 text-center relative z-10">
                          <motion.div 
                            className="mb-6"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: lastAnswer.correct ? [0, 15, -15, 0] : [0, -10, 10, 0]
                            }}
                            transition={{ duration: 0.6 }}
                          >
                            {lastAnswer.correct ? (
                              <div className="text-8xl">🎯</div>
                            ) : (
                              <div className="text-8xl">💥</div>
                            )}
                          </motion.div>
                          
                          <motion.h3 
                            className={`text-4xl font-bold mb-4 ${
                              lastAnswer.correct ? 'text-green-400' : 'text-red-400'
                            }`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            {lastAnswer.correct ? '⚡ CRITICAL HIT! ⚡' : '💔 MISSED ATTACK! 💔'}
                          </motion.h3>
                          
                          <p className="text-lg text-slate-200 mb-6 leading-relaxed">
                            {lastAnswer.explanation}
                          </p>
                          
                          <div className="flex justify-center gap-4 flex-wrap">
                            {lastAnswer.correct ? (
                              <>
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2 text-lg">
                                  <Coins className="w-5 h-5 mr-2" />
                                  +{10 + (combo > 1 ? (combo - 1) * 2 : 0)} Gold
                                </Badge>
                                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-4 py-2 text-lg">
                                  <Star className="w-5 h-5 mr-2" />
                                  +{25 + (combo > 1 ? (combo - 1) * 2 : 0)} XP
                                </Badge>
                                {combo > 1 && (
                                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-lg">
                                    <Zap className="w-5 h-5 mr-2" />
                                    {combo}x Combo!
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-4 py-2 text-lg">
                                <Heart className="w-5 h-5 mr-2" />
                                -15 HP
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Results Screen */}
            {gameState === 'results' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-3xl mx-auto text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8"
                >
                  <div className="text-8xl mb-4">
                    {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🌟' : '🌱'}
                  </div>
                </motion.div>

                <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                  🏆 QUEST COMPLETED! 🏆
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  <strong>Legendary Achievement Unlocked!</strong><br/>
                  You have proven yourself worthy in the Arena of Ancient Wisdom!
                </p>

                <Card className="mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-yellow-400/50 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-4xl text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      ⚡ BATTLE STATISTICS ⚡
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <motion.div 
                        className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-4xl font-bold text-yellow-400">{score}</div>
                        <div className="text-sm text-slate-300">Total Gold</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Star className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <div className="text-4xl font-bold text-cyan-400">{xp}</div>
                        <div className="text-sm text-slate-300">Experience Points</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-4xl font-bold text-green-400">{finalScore}%</div>
                        <div className="text-sm text-slate-300">Accuracy</div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Sword className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-4xl font-bold text-purple-400">
                          {answers.filter((answer, i) => answer === questionsLevel1[i].correct).length}/{questionsLevel1.length}
                        </div>
                        <div className="text-sm text-slate-300">Victories</div>
                      </motion.div>
                    </div>

                    {finalScore >= 60 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="text-center"
                      >
                        <div className="mb-4">
                          <motion.div
                            className="text-8xl mb-4"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ⚔️
                          </motion.div>
                        </div>
                        <Badge className="text-xl px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-white border-0 shadow-2xl shadow-green-500/30">
                          <Crown className="w-6 h-6 mr-3" />
                          🏆 HERBAL APPRENTICE ACHIEVED! 🏆
                          <Sparkles className="w-6 h-6 ml-3" />
                        </Badge>
                        <p className="text-lg text-green-400 mt-4 font-semibold">
                          You have earned the right to bear the title of Herbal Apprentice!
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-4">💪</div>
                        <Badge className="text-lg px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                          Keep Training, Warrior!
                        </Badge>
                        <p className="text-slate-400 mt-4">
                          You need 60% accuracy to become a Herbal Apprentice. Try again!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={resetGame} 
                      className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-xl border-0 shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
                    >
                      <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      ⚔️ Battle Again
                    </Button>
                  </motion.div>
                  <Link to="/">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl border-0 shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                        <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        🏰 Return to Herbiverse
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                <div className="mt-8 text-muted-foreground">
                  <p>More levels coming soon:</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="outline" className="opacity-50">
                      <Lock className="w-3 h-3 mr-1" />
                      Level 2: Medicinal Herbs
                    </Badge>
                    <Badge variant="outline" className="opacity-50">
                      <Lock className="w-3 h-3 mr-1" />
                      Level 3: Yoga & Wellness
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HerbalQuest;
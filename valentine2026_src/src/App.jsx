import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';

const quotes = [
  "You are your own longest commitment. Treat yourself like a priority.",
  "To love oneself is the beginning of a lifelong romance. — Oscar Wilde",
  "You are allowed to be both a masterpiece and a work in progress, simultaneously.",
  "Your soul will never be satisfied by the approval of others. Feed it your own instead.",
  "The way you treat yourself sets the standard for others.",
  "You are not a backup plan. You are the main event.",
  "Be the love you never received.",
  "Self-love is the fuel that allows you to shine bright for the rest of the world.",
  "You don’t need to 'earn' rest or kindness. They are your birthright.",
  "Fall in love with the process of becoming the best version of yourself.",
  "Your worth is not a decimal point; it is a whole number that never changes.",
  "Talk to yourself like you would to someone you love. — Brené Brown",
  "Inner peace begins the moment you choose not to allow another person or event to control your emotions.",
  "You are enough. Not because of what you do, but because of who you are.",
  "Choose yourself, even when others don't.",
  "Self-care is not selfish; it is self-preservation. — Audre Lorde",
  "The most powerful relationship you will ever have is the one with yourself.",
  "You are deserving of the same grace you so freely give to others.",
  "Confidence is not 'they will like me.' Confidence is 'I’ll be fine if they don't.'",
  "Flowers don’t compete with the flower next to them; they just bloom. You should too."
];

const FloatingHeart = ({ id, onComplete }) => {
  const randomX = Math.random() * 100; // 0 to 100vw
  const randomDuration = 3 + Math.random() * 4;
  const randomDelay = Math.random() * 0.5;
  const randomSize = 15 + Math.random() * 25;

  return (
    <motion.div
      initial={{ y: '100vh', x: `${randomX}vw`, opacity: 0.8, scale: 0 }}
      animate={{
        y: '-10vh',
        opacity: 0,
        scale: 1,
        x: `${randomX + (Math.random() * 20 - 10)}vw`
      }}
      transition={{ duration: randomDuration, ease: "easeOut", delay: randomDelay }}
      onAnimationComplete={() => onComplete(id)}
      className="fixed pointer-events-none text-rose-300"
      style={{ fontSize: randomSize }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="1em"
        height="1em"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
};

const PopHeart = ({ id, onComplete }) => {
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 100;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 1],
        x: x,
        y: y,
        opacity: 0
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute pointer-events-none text-rose-400"
      style={{ left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px' }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="24"
        height="24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
};

function App() {
  const [quote, setQuote] = useState("A tiny generator for big self love. Take a quote, keep the energy, and remember that you're the main character.");
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [popHearts, setPopHearts] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  const removeFloatingHeart = useCallback((id) => {
    setFloatingHearts(prev => prev.filter(h => h.id !== id));
  }, []);

  const removePopHeart = useCallback((id) => {
    setPopHearts(prev => prev.filter(h => h.id !== id));
  }, []);

  const generateLove = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);

    // Add floating hearts
    const count = 10 + Math.floor(Math.random() * 10);
    const newHearts = Array.from({ length: count }).map(() => ({
      id: Math.random(),
    }));
    setFloatingHearts(prev => [...prev, ...newHearts]);

    // Add pop hearts
    const popCount = 8;
    const newPopHearts = Array.from({ length: popCount }).map(() => ({
      id: Math.random(),
    }));
    setPopHearts(prev => [...prev, ...newPopHearts]);
  };

  const handleShare = async () => {
    const shareMessage = `Check out this tiny generator for big self love ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(shareMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-valentine-cream">
      {/* Background Floating Hearts */}
      {floatingHearts.map(heart => (
        <FloatingHeart key={heart.id} id={heart.id} onComplete={removeFloatingHeart} />
      ))}

      {/* Main Content */}
      <main className="z-10 w-full max-w-2xl flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-valentine-rose mb-2 italic">Self Love</h1>
          <div className="h-1 w-24 bg-valentine-blush mx-auto rounded-full"></div>
        </motion.div>

        {/* Quote Container with Glassmorphism */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={quote}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-10 md:p-16 rounded-[3rem] shadow-xl text-center min-h-[300px] flex items-center justify-center"
            >
              <p className="text-2xl md:text-3xl text-valentine-deep-rose leading-relaxed font-serif italic">
                "{quote}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Button Section */}
        <div className="relative group">
          {/* Pop Hearts behind button */}
          {popHearts.map(heart => (
            <PopHeart key={heart.id} id={heart.id} onComplete={removePopHeart} />
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateLove}
            className="px-10 py-5 bg-valentine-rose text-white rounded-full text-xl font-semibold shadow-lg hover:bg-valentine-deep-rose transition-colors relative z-20 overflow-hidden"
          >
            Give me some love
          </motion.button>
        </div>

        {/* Share Button */}
        <motion.button
          onClick={handleShare}
          className="flex items-center gap-2 text-valentine-rose hover:text-valentine-deep-rose transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
          whileHover={{ y: -2 }}
        >
          {isCopied ? (
            <>
              <Check size={18} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={18} />
              <span>Share with a friend</span>
            </>
          )}
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-8 text-valentine-rose/80 text-center z-10">
        <p className="text-sm md:text-base font-medium">
          Don't forget to love yourself first.
        </p>
        <p className="text-xs mt-1">
          Built with love from Yvonne So, 2026
        </p>
      </footer>
    </div>
  );
}

export default App;

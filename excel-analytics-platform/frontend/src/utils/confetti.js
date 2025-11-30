import confetti from 'canvas-confetti';

export const showConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b']
  });
};

export const showSuccessConfetti = () => {
  confetti({
    particleCount: 150,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#3b82f6', '#8b5cf6', '#10b981']
  });
  confetti({
    particleCount: 150,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#3b82f6', '#8b5cf6', '#10b981']
  });
};
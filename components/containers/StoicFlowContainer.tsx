import React, { useEffect, useState } from 'react';
import { StoicFlowLoader } from '../ui/StoicFlowLoader';

interface Props {
  onFlowStart: () => void; // Функція, що запуститься після натискання кнопки
}

export const StoicFlowContainer = ({ onFlowStart }: Props) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Імітуємо 3 секунди завантаження (як у твоїй TWA версії)
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StoicFlowLoader 
      isReady={isReady} 
      onStart={onFlowStart} 
    />
  );
};
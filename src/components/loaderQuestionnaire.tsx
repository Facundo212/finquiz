import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import { Spinner } from '@/components/ui/spinner';

import { pascalLanguageFacts } from '@/constants';

export function LoaderQuestionnaire() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => {
          let newIndex;

          do {
            newIndex = Math.floor(Math.random() * pascalLanguageFacts.length);
          } while (newIndex === prevIndex);

          return newIndex;
        });
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-theme(space.16))]">
      <Spinner size="large">
        <span className="text-xl">Cargando cuestionario...</span>
      </Spinner>
      <div className="text-center max-w-2xl px-4 min-h-[120px] flex flex-col justify-center">
        <div
          className={`text-lg italic text-gray-600 transition-all duration-500 absolute w-full left-0 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Markdown>{pascalLanguageFacts[currentQuoteIndex]}</Markdown>
        </div>
      </div>
    </div>
  );
}

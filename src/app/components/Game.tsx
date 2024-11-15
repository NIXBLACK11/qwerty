"use client"

import { useState, useEffect, useRef } from 'react';
import { Space_Mono } from "next/font/google";
import { MdTimer } from 'react-icons/md';
import { updatePlayerWPMRequest } from '../utils/dbCalls';

const spaceMono = Space_Mono({
    subsets: ['latin'],
    display: 'swap',
    weight: "400"
})

interface PlayerProps {
    player: number;
    gameID: string;
}
  
export const Game: React.FC<PlayerProps> = ({ player, gameID }) => {
    const text = "Success is the result of preparation, hard work, and learning from failure. It’s not about luck, but about the effort you put in when no one is watching, pushing forward despite obstacles and setbacks.";
    const [startTime, setStartTime] = useState<number | null>(null);
    const [WPM, setWPM] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [errorsInType, setErrorsInType] = useState<number>(0);
    // const [_completedText, setCompletedText] = useState<string>("");
    const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
    const [index, setIndex] = useState<number>(0);
    const pressedKeyRef = useRef<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const totalWords = text.length;

    const startTimer = () => {
        setStartTime(Date.now());
    };

    const handleUpdateWPM = async (wpm: number) => {
        try {
            const result = await updatePlayerWPMRequest(gameID, player, wpm);
        
            if (result.success) {
              console.log('WPM updated successfully:', result.game);
            } else {
              console.error('Update failed:', result.error || 'Unknown error');
            }
        } catch {
            console.error('Failed to update WPM');
        }
    }

    const stopTimer = async () => {
        if (startTime !== null && totalTime == 0) {
            const endTime = Date.now();
            const elapsedTime = (endTime - startTime) / 1000;
            const wpm = ((totalWords - errorsInType) / 5) * (60 / elapsedTime);
            setWPM(wpm);
            setTotalTime(elapsedTime);
            handleUpdateWPM(wpm);
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (WPM === 0 && startTime !== null) {
          interval = setInterval(() => {
            setElapsedTime((Date.now() - startTime) / 1000);
          }, 100);
        } else {
          clearInterval(interval);
        }
    
        return () => clearInterval(interval);
    }, [WPM, startTime]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.length === 1 || ['Enter', 'Backspace', 'Space', 'Tab'].includes(event.key)) {
                pressedKeyRef.current = event.key;

                if (!startTime) {
                    startTimer();
                }

                if (pressedKeyRef.current !== text[index]) {
                //     setCompletedText(prev => prev + text[index]);
                // } else {
                    setErrorsInType(prev => prev + 1);
                    setIncorrectIndices(prev => [...prev, index]);
                }
                setIndex(index + 1);

                if (index + 1 >= text.length) {
                    stopTimer();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [index, text]);

    const displayText = text.split("").map((char, i) => {
        if (i < index) {
            return (
                <span
                    key={i}
                    className={`text-5xl ${incorrectIndices.includes(i) ? 'text-red-700' : 'text-white'}`}
                >
                    {char}
                </span>
            );
        } else if(i > index) {
            return (
                <span key={i} className="text-5xl text-accent">
                    {char}
                </span>
            );
        } else {
            return (
                <>
                    <span className="absolute animate-blink text-accent custom-cursor">
                        |
                    </span>
                    <span key={i} className="text-5xl text-accent">
                        {char}
                    </span>
                </>
            )
        }
    });

    return (
        <div className="flex flex-col justify-center w-4/5 h-full p-0 items-center">
            <div className='flex flex-row justify-center items-center w-full h-1/5 text-white text-3xl'>
                <MdTimer />
                <p>{startTime ? elapsedTime.toFixed(2) : 0}</p>
            </div>
            <div className={`${spaceMono.className} mt-10 h-3/5`}>
                {displayText}
            </div>
            <div className='h-1/5 w-full flex flex-col justify-start items-center'>
                {WPM !== 0 && <p className='text-white text-3xl'>You have played your chance!</p>}
                <p className='text-white text-3xl'>WPM: {WPM}</p>
            </div>
        </div>
    );
};

"use client"

import { useState, useEffect, useRef } from 'react';
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
    subsets: ['latin'],
    display: 'swap',
    weight: "400"
})

export const Game = () => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [WPM, setWPM] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [errorsInType, setErrorsInType] = useState<number>(0);
    const [text, setText] = useState<string>("Success is the result of preparation, hard work, and learning from failure. It’s not about luck, but about the effort you put in when no one is watching, pushing forward despite obstacles and setbacks.");
    const [completedText, setCompletedText] = useState<string>("");
    const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
    const [index, setIndex] = useState<number>(0);
    const pressedKeyRef = useRef<string | null>(null);

    const totalWords = text.length;

    const startTimer = () => {
        setStartTime(Date.now());
    };

    const stopTimer = () => {
        if (startTime !== null && totalTime == 0) {
            const endTime = Date.now();
            const elapsedTime = (endTime - startTime) / 1000;
            const wpm = ((totalWords - errorsInType) / 5) * (60 / elapsedTime);
            setWPM(wpm);
            setTotalTime(elapsedTime);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.length === 1 || ['Enter', 'Backspace', 'Space', 'Tab'].includes(event.key)) {
                pressedKeyRef.current = event.key;

                if(!startTime) {
                    startTimer();
                }

                if (pressedKeyRef.current === text[index]) {
                    setCompletedText(prev => prev + text[index]);
                }
                else {
                    setErrorsInType(prev => prev + 1);
                    setIncorrectIndices(prev => [...prev, index]);
                }
                setIndex(index + 1);

                if(index+1>=text.length) {
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
        <div className="flex justify-center w-4/5 h-3/5 p-0 items-center">
            <div className={`${spaceMono.className} px-10`}>
                {displayText}
            </div>
        </div>
    )
}

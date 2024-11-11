"use client"

import { useState, useEffect, useRef } from 'react';
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
    subsets: ['latin'],
    display: 'swap',
    weight: "400"
})

export const Game = () => {
    const [text, setText] = useState<string>("Success is the result of preparation, hard work, and learning from failure. It’s not about luck, but about the effort you put in when no one is watching, pushing forward despite obstacles and setbacks.");
    const [completedText, setCompletedText] = useState<string>("");
    const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
    const [index, setIndex] = useState<number>(0);
    const pressedKeyRef = useRef<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.length === 1 || ['Enter', 'Backspace', 'Space', 'Tab'].includes(event.key)) {
                pressedKeyRef.current = event.key;

                if (pressedKeyRef.current === text[index]) {
                    setCompletedText(prev => prev + text[index]);
                    setIndex(index + 1);
                }
                else {
                    setIncorrectIndices(prev => [...prev, index]);
                    setIndex(index + 1);
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
                    <span className="absolute animate-blink text-accent">
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

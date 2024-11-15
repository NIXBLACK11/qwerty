export interface IQWERTYGame {
    name: string;
    wager: number;
    player1Account: string;
}

export interface FullQWERTYGame {
    id: string;
    name: string;
    wager: number;
    player1Account: string;
    player2Account: string;
    player1WPM: number;
    player2WPM: number;
    player1Joined: boolean;
    player2Joined: boolean;
    winner: string;
}

export interface JQWERTYGame {
    id: string;
    player2Account: string;
}
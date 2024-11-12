export interface IQWERTYGame {
    name: string;
    wager: Number;
    player1Account: string;
}

export interface FullQWERTYGame {
    id: string;
    name: string;
    wager: number;
    player1Account: string;
    player2Account: string;
    player1WPM: string;
    player2WPM: string;
    player1Joined: Boolean;
    player2Joined: Boolean;
    winner: string;
}

export interface JQWERTYGame {
    id: string;
    player2Account: string;
}
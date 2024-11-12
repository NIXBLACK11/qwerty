export interface IQWERTYGame {
    name: String;
    wager: Number;
    player1Account: String;
}

export interface FullQWERTYGame {
    id: String;
    name: String;
    wager: number;
    player1Account: String;
    player2Account: String;
    player1WPM: String;
    player2WPM: String;
    player1Joined: Boolean;
    player2Joined: Boolean;
    winner: String;
}

export interface JQWERTYGame {
    id: string;
    player2Account: String;
}
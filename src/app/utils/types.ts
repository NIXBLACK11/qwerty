export interface IQWERTYGame {
    name: String;
    wager: Number;
    player1Account: String;
}

export interface FullQWERTYGame {
    name: String;
    wager: Number;
    player1Account: String;
    playe2Account: String;
    player1WPM: String;
    player2WPM: String;
    winner: String;
}
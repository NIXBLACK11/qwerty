import mongoose, { Schema } from 'mongoose';

const QWERTYGameSchema: Schema = new Schema({
  name: { type: String, required: true },
  wager: { type: Number, required: true },
  player1WPM: { type: Number, default: 0 },
  player2WPM: { type: Number, default: 0 },
  player1Account: { type: String, required: true},
  player2Account: { type: String, default: "" },
  player1Joined: { type: Boolean, default: false },
  player2Joined: { type: Boolean, default: false },
  winner: { type: String, default: ""},
}, {
  timestamps: true,
});

const QWERTYGame = mongoose.models.QWERTYGame || mongoose.model('QWERTYGame', QWERTYGameSchema);

export default QWERTYGame;

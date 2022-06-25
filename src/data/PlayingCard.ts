const NUMERIC_VALUES = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
};

export default class PlayingCard {
  value: string;
  suit: string;
  code: string;

  constructor(value: string, suit: string, code: string) {
    this.value = value;
    this.suit = suit;
    this.code = code;
  }

  getNumericValue = (): number => {
    return NUMERIC_VALUES[this.value as keyof typeof NUMERIC_VALUES];
  };
}

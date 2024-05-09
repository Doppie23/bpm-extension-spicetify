const dict = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

export default function pitchClassToKey(pc: number): string {
  if (dict.hasOwnProperty(pc)) {
    return dict[pc as keyof typeof dict];
  }
  return "";
}

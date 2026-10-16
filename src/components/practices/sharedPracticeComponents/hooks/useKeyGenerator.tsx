import { useState } from 'react';
import {
  Accidental,
  accidentalAvailable,
  alignScaleView,
  findKey,
  getRandomKey,
  Key,
  qualityForScale,
  ScaleViewId,
  selectionFromCanonical,
  toCanonicalNote,
} from '../../../../assets/practiceAssets/keys.ts';

export const useKeyGenerator = () => {
  const [currentKey, setCurrentKey] = useState<Key | null>(
    () => findKey('C', 'major') ?? null
  );
  const [letter, setLetter] = useState<string>('C');
  const [accidental, setAccidental] = useState<Accidental>('natural');
  const [scaleView, setScaleView] = useState<ScaleViewId>('major');
  const [showAllNotes, setShowAllNotes] = useState(false);

  const commitSelection = (
    nextLetter: string,
    nextAccidental: Accidental,
    nextScale: ScaleViewId
  ) => {
    const accidentalChoice = accidentalAvailable(nextLetter, nextAccidental)
      ? nextAccidental
      : 'natural';
    const canonical = toCanonicalNote(nextLetter, accidentalChoice);
    const key = findKey(canonical, qualityForScale(nextScale));

    setLetter(nextLetter);
    setAccidental(accidentalChoice);
    setScaleView(nextScale);
    if (key) setCurrentKey(key);
  };

  const generateNewKey = () => {
    let newKey = getRandomKey();
    let regenAttempts = 0;

    while (currentKey && currentKey.name === newKey.name && regenAttempts < 5) {
      newKey = getRandomKey();
      regenAttempts += 1;
    }

    const parsed = selectionFromCanonical(newKey.root);
    const nextScale = alignScaleView(
      scaleView,
      newKey.quality === 'minor' ? 'minor' : 'major'
    );

    setShowAllNotes(false);
    commitSelection(parsed.letter, parsed.accidental, nextScale);
    return newKey;
  };

  const selectLetter = (nextLetter: string) => {
    commitSelection(nextLetter, accidental, scaleView);
  };

  const selectAccidental = (nextAccidental: Accidental) => {
    commitSelection(letter, nextAccidental, scaleView);
  };

  const selectScaleView = (nextScale: ScaleViewId) => {
    commitSelection(letter, accidental, nextScale);
  };

  return {
    currentKey,
    letter,
    accidental,
    scaleView,
    showAllNotes,
    setShowAllNotes,
    generateNewKey,
    selectLetter,
    selectAccidental,
    selectScaleView,
  };
};

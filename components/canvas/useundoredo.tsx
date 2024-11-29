import { Note, Stroke } from '@/lib/types';
import React, { useState } from 'react';

export default function useUndoRedo({
  setNote,
  note,
}: {
  setNote: React.Dispatch<React.SetStateAction<Note | null>>;
  note: Note | null;
}) {
  const [undoStack, setUndoStack] = useState<Note[]>([]);
  const [redoStack, setRedoStack] = useState<Note[]>([]);

  const addStroke = (newStroke: Stroke) => {

	if (!note?.strokes)
		return;
    // Push the current state of the note to the undo stack
    setUndoStack((prevUndo) => [...prevUndo, note]);
    // Clear the redo stack
    setRedoStack([]);
    // Update the note with the new stroke
    setNote({
      ...note,
      strokes: [...note.strokes, newStroke],
    });
  };

  const undo = () => {
	if (!note)
		return;
    if (undoStack.length === 0) return;
    // Get the previous state of the note
    const previousNote = undoStack.pop()!;
    // Push the current state to the redo stack
    setRedoStack((prevRedo) => [note, ...prevRedo]);
    // Set the previous state as the current note
    setNote(previousNote);
  };

  const redo = () => {
	if (!note)
		return;
    if (redoStack.length === 0) return;
    // Get the next state of the note
    const nextNote = redoStack.shift()!;
    // Push the current state to the undo stack
    setUndoStack((prevUndo) => [...prevUndo, note]);
    // Set the next state as the current note
    setNote(nextNote);
  };

  return { undo, redo, addStroke };
}

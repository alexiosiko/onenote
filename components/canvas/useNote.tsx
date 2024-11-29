import { toast } from '@/hooks/use-toast';
import { CanvasSettings, Note, Stroke } from '@/lib/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseNote(
	canvasSettings: CanvasSettings,
) { 
	const [note, setNote] = useState<Note | null>(null);
	const updateNoteStrokes = (value: React.SetStateAction<Stroke[]>) =>
		setNote((prevNote) =>
		prevNote
			? {
				...prevNote,
				strokes: typeof value === "function" ? value(prevNote.strokes) : value,
			}
			: null
		);


	// Save the note to the server
	const handleSave = async () => {
		try {
			if (!note)
				return;

			const updatedNote: Note = {
				...note,
				title: canvasSettings.name,
			};


			const res = await axios.put('/api/note', {
				note: updatedNote,
			});
			toast({
				title: "Note saved."
			})
			
		} catch (e: any) {
			console.error('Error saving note:', e);
		}
	};
	return {
		handleSave,
		note,
		setNote,
		updateNoteStrokes,
	}
}

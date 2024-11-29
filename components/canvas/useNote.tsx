import { toast } from '@/hooks/use-toast';
import { CanvasSettings, Note, Stroke } from '@/lib/types';
import axios from 'axios';
import React, { useState } from 'react'

export default function UseNote() { 
	const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
		name: 'Untitled 1',
		size: 6,
		thinning: 0.2,
		color: 'black',
		smoothing: 1,
		streamline: 1,
		start: { cap: true },
		end: { cap: true },
	});
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


			await axios.put('/api/note', {
				note: updatedNote,
			});
			toast({
				title: "Note saved."
			})
			
		} catch (e: unknown) {
			toast({
				title: "Server error",
				variant: "destructive",
			});
			console.error('Error saving note:', e);
		}
	};
	return {
		handleSave,
		note,
		setNote,
		updateNoteStrokes,
		canvasSettings,
		setCanvasSettings
	}
}

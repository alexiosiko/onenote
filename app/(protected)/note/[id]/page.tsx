"use client";

import PerfectFreehandCanvas from '@/components/canvas/canvas';
import TopBar from '@/components/canvas/topbar';
import UseNote from '@/components/canvas/useNote';
import useUndoRedo from '@/components/canvas/useundoredo';
import axios from 'axios';
import React, { useEffect } from 'react';

	

export default function Page({ params }: { params: Promise<{ id: string }> }) {

	const { note, setNote, handleSave, updateNoteStrokes, setCanvasSettings, canvasSettings } = UseNote();
	const { undo, redo, addStroke } = useUndoRedo({ setNote, note });




	useEffect(() => {
		const fetchNote = async () => {

		try {
			const noteId = (await params).id;
			const res = await axios.get('/api/note', {
			params: {
				noteId,
			},
			});

			const fetchedNote = res.data.note;

			if (fetchedNote) {
			setNote(fetchedNote);
			setCanvasSettings((settings) => ({
				...settings,
				name: fetchedNote.title,
			}));
			}
		} catch (e: unknown) {
			console.error('Error fetching note:', e);
		}
		};

		fetchNote();
	}, []);

	

	return (
		<div>
		<TopBar
			undo={undo}
			redo={redo}
			note={note}
			handleSave={handleSave}
			setCanvasSettings={setCanvasSettings}
			canvasSettings={canvasSettings}
		/>
		<PerfectFreehandCanvas
			addStroke={addStroke}
			canvasSettings={canvasSettings}
			strokes={note?.strokes || []}
			setStrokes={updateNoteStrokes}
		/>
		</div>
	);
}
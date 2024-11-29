import React, { useState } from 'react'
import { FaRedo, FaUndo, FaSave, FaHome } from 'react-icons/fa';
import { FaPencil } from "react-icons/fa6";
import ColorPicker from './colorpicker';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import Delete from './handledelete';
import { CanvasSettings, Note } from '@/lib/types';

export default function TopBar({ handleSave, setCanvasSettings, canvasSettings, undo, redo, note
}: { 
	handleSave: () => Promise<void>; 
	setCanvasSettings: React.Dispatch<React.SetStateAction<CanvasSettings>>; 
	canvasSettings: CanvasSettings; 
	undo: () => void; 
	note: Note | null,
	redo: () => void;
}) {
	const router = useRouter();
	const [hideColorPicker, setHideColorPicker] = useState<boolean>(true);
	const handleHome = async () => {
		await handleSave();
		router.push('/');
	}
	
	return (
		<div className='flex justify-between p-6 bg-secondary absolute top-0 outline-1 w-full shadow'>
			<div className='flex gap-8'>
				<FaHome  className='hover:cursor-pointer' onClick={handleHome} size={32}/>
				<ColorPicker canvasSettings={canvasSettings} setHideColorPicker={setHideColorPicker} setCanvasSettings={setCanvasSettings} open={hideColorPicker} setOpen={setHideColorPicker} />
			</div>
			<div>
				<Input value={canvasSettings.name} 
				className='outline-none'
				onChange={(e) =>
					setCanvasSettings((prev) => ({
						...prev,
						name: e.target.value, // Properly update the name property
					}))
				}/>
			</div>
			<div className='flex gap-8 justify-end'>
			<div className="flex gap-8 justify-end">
				<FaSave onClick={handleSave} className="hover:cursor-pointer" size={32} />
				<FaUndo onClick={undo} className="hover:cursor-pointer" size={32} />
				<Delete noteId={note?._id as unknown as string | null} />
			</div>

		</div>

	</div>
)
}

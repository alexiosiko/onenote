import React from 'react'
import { Card, CardContent } from '../ui/card'
import { CanvasSettings } from '@/lib/types';

const colors = [
	'red',
	'blue',
	'green',
	'black',
	'white',
]
export default function ColorPicker({ open, setOpen, canvasSettings, setCanvasSettings, setHideColorPicker }: {
	open: boolean,
	setHideColorPicker: React.Dispatch<React.SetStateAction<boolean>>,
	setOpen : React.Dispatch<React.SetStateAction<boolean>>,
	setCanvasSettings: React.Dispatch<React.SetStateAction<CanvasSettings>>,
canvasSettings: CanvasSettings,
}) {
	const handleSetColor = (color: string) => {
		setCanvasSettings((prevSettings) => ({
		  ...prevSettings,
		  color: color,
		}));

		setHideColorPicker(true);
	  };
	return (
		<div className='relative'>
			<div
				style={{ backgroundColor: canvasSettings.color}}
				className={`hover:cursor-pointer w-8 h-8 rounded-full`}
				onClick={() =>setOpen(open => !open) }/>
			<Card className='absolute -left-12 top-12' hidden={open}>
				<CardContent className='flex gap-4 p-4 max-w-xs'>
					{colors.map((color, index) => 
						<div
						key={index}
						style={{ background: color }}
						onClick={() => handleSetColor(color)} className={`hover:cursor-pointer w-8 h-8 rounded-full b`} />
					)}
				</CardContent>
			</Card>
		</div>
	)
}

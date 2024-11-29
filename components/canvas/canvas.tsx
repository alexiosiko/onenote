import React, { useRef, useState, useEffect, PointerEvent, WheelEvent } from 'react';
import { getStroke } from 'perfect-freehand';
import { CanvasSettings, Stroke } from '@/lib/types';


export type Point = {
x: number;
y: number;
}
/*
	strokeProperties: {
		size: 6,
		thinning: 0.2,
		color: 'black',
		smoothing: 1,
		streamline: 1,
		start: { cap: true },
		end: { cap: true },
	}
*/



export default function PerfectFreehandCanvas({ strokes, addStroke, setStrokes, canvasSettings }: {
	strokes: Stroke[],
	addStroke: (newStroke: Stroke) => void,
	setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
	canvasSettings: CanvasSettings
}) {
	
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const [points, setPoints] = useState<Point[]>([]);
	const [scale, setScale] = useState<number>(1);
	const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState<boolean>(false);
	const [lastPos, setLastPos] = useState<Point>({ x: 0, y: 0 });
	const [isErasing, setIsErasing] = useState<boolean>(false);


	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
	
		// Disable the "Save Image As" window
		const disableContextMenu = (e: MouseEvent) => {
			e.preventDefault(); // Prevent the default right-click menu
		};
	
		canvas.addEventListener('contextmenu', disableContextMenu);
	
		return () => {
			canvas.removeEventListener('contextmenu', disableContextMenu); // Cleanup
		};
	}, []);
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
	
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	
		const draw = () => {
			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.translate(translate.x, translate.y);
			ctx.scale(scale, scale);
		
			// Draw grid
			const gridSize = 50;
			const width = canvas.width / scale;
			const height = canvas.height / scale;
			const startX = Math.floor(-translate.x / scale / gridSize) * gridSize;
			const startY = Math.floor(-translate.y / scale / gridSize) * gridSize;
		
			ctx.strokeStyle = '#ccc'; // Grid
			for (let x = startX; x < width - translate.x / scale; x += gridSize)
				for (let y = startY; y < height - translate.y / scale; y += gridSize)
					ctx.strokeRect(x, y, gridSize, gridSize);
		
			// Draw saved strokes
			strokes.forEach((stroke) => {
				const strokePoints = stroke.points.map(p => [p.x, p.y] as [number, number]);
				const outlinePoints = getStroke(strokePoints, {
				size: stroke.size,
				thinning: stroke.thinning,
				smoothing: stroke.smoothing,
				streamline: stroke.streamline,
				});
		
				ctx.beginPath();
				outlinePoints.forEach(([x, y], index) => {
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				});
				ctx.closePath();
				ctx.fillStyle = stroke.color;
				ctx.fill();
			});
		
			// Draw current stroke using current canvas settings
			if (points.length > 0) {
				const strokePoints = points.map(p => [p.x, p.y] as [number, number]);
				const outlinePoints = getStroke(strokePoints, {
				size: canvasSettings.size,
				thinning: canvasSettings.thinning,
				smoothing: canvasSettings.smoothing,
				streamline: canvasSettings.streamline,
				});
		
				ctx.beginPath();
				outlinePoints.forEach(([x, y], index) => {
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
				});
				ctx.closePath();
				ctx.fillStyle = canvasSettings.color;
				ctx.fill();
			}
		
			ctx.restore();
			};
	
		draw();
	}, [points, strokes, scale, translate, canvasSettings]);
	
	const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
		e.preventDefault();
	
		if (e.button === 1) {
			// Middle mouse button for panning
			setIsPanning(true);
			setLastPos({ x: e.clientX, y: e.clientY });
		} else if (e.button === 2) {
			// Right mouse button for erasing
			setIsErasing(true);
			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;
			const x = (e.clientX - rect.left - translate.x) / scale;
			const y = (e.clientY - rect.top - translate.y) / scale;
			eraseStroke({ x, y });
		} else {
			// Left mouse button for drawing
			setIsDrawing(true);
			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;
			const x = (e.clientX - rect.left - translate.x) / scale;
			const y = (e.clientY - rect.top - translate.y) / scale;
			setPoints([{ x, y }]);
		}
	};
		
	const eraseStroke = (point: Point) => {
		const eraserRadius = 10; // Adjust this value as needed
		setStrokes((prevStrokes) =>
			prevStrokes.filter((stroke) =>
				!stroke.points.some(
					(p) =>
						Math.sqrt(
							Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
						) <= eraserRadius
				)
			)
		);
	};

	const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
		if (isPanning) {
			const dx = e.clientX - lastPos.x;
			const dy = e.clientY - lastPos.y;
			setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
			setLastPos({ x: e.clientX, y: e.clientY });
		} else if (isErasing) {
			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;
			const x = (e.clientX - rect.left - translate.x) / scale;
			const y = (e.clientY - rect.top - translate.y) / scale;
			eraseStroke({ x, y });
		} else if (isDrawing) {
			const rect = canvasRef.current?.getBoundingClientRect();
			if (!rect) return;
			const x = (e.clientX - rect.left - translate.x) / scale;
			const y = (e.clientY - rect.top - translate.y) / scale;
			setPoints((prev) => [...prev, { x, y }]);
		}
	};

	const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
		if (e.button === 1 && isPanning) {
			setIsPanning(false);
		} else if (e.button === 2 && isErasing) {
			setIsErasing(false);
		} else if (e.button === 0 && isDrawing) {
			const newStroke: Stroke = {
				points,
				size: canvasSettings.size,
				color: canvasSettings.color,
				thinning: canvasSettings.thinning,
				smoothing: canvasSettings.smoothing,
				streamline: canvasSettings.streamline,
			}
			addStroke(newStroke) // For undo and redo logic 
			setIsDrawing(false);
			setStrokes((prev) => [
				...prev,
				newStroke
			]);
			setPoints([]);
		}
	};

	const handleWheel = (e: WheelEvent<HTMLCanvasElement>) => {
		const zoomIntensity = 0.003;
		const { offsetX, offsetY, deltaY } = e.nativeEvent;

		// Calculate the zoom factor
		const zoom = Math.exp(deltaY * -zoomIntensity);

		// Calculate the new scale, ensuring it stays within desired bounds
		const newScale = Math.min(Math.max(0.3, scale * zoom), 5);

		// Calculate the mouse position in canvas coordinates
		const mouseX = (offsetX - translate.x) / scale;
		const mouseY = (offsetY - translate.y) / scale;

		// Update the translation to keep the zoom centered on the mouse position
		setTranslate({
		x: offsetX - mouseX * newScale,
		y: offsetY - mouseY * newScale,
		});

		// Update the scale

		setScale(newScale);
	};


	return (
		<canvas
			ref={canvasRef}
			style={{  cursor: isPanning ? 'grabbing' : 'crosshair' }}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
			onWheel={handleWheel}
		/>
	);
};

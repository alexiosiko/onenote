import { Point } from "@/components/canvas/canvas";
import { ObjectId } from "mongodb";

export type Note = {
	_id: ObjectId,
	title: string,
	strokes: Stroke[],
	ownerId: string,
}

export type NoteWithout_Id = Omit<Note, "_id" | "ownerId">;

export type CanvasSettings = {
	name: string;
	size: number;
	color: string;
	thinning: number;
	smoothing: number;
	streamline: number;
	start: object;
	end: object;
};
  export type Stroke = {
	points: Point[];
	size: number;
	color: string;
	thinning: number;
	smoothing: number;
	streamline: number;
}


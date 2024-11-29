import { dbPromise } from "@/lib/monogdb";
import { Note } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		let noteId = req.nextUrl.searchParams.get('noteId');
		let _id;
		if (noteId == null)
			_id = new ObjectId();
		else
			_id = new ObjectId(noteId);
		
		const db = await dbPromise();
		const notes = db.collection('notes');
		let note = await notes.findOne({ _id: _id })

		// If the note doesn't exist, create a new one
		if (!note) {
			note = {
			  _id: _id,
			  strokes: [],
			  title: "New Note",
			  ownerId: null, // Adjust this if you have user authentication
			};
	  
			await notes.insertOne(note);
		  }

		return NextResponse.json({ message: "Worked", note: note}, { status: 200});
		
	} catch (e: any) {
		console.error(e);
		return NextResponse.json({ message: "Fail"}, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const { note }: { note: Note } = await req.json();

		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ message: "Auth error" }, { status: 401 });
		}

		const db = await dbPromise();
		const notes = db.collection('notes');

		// Prepare the note's `_id`
		const noteId = note._id ? new ObjectId(note._id) : new ObjectId();

		// Assign `ownerId` to ensure ownership
		note._id = noteId;
		note.ownerId = userId;

		// Perform the upsert operation
		const result = await notes.updateOne(
			{ _id: noteId }, // Filter by `_id`
			{ $set: note }, // Update the fields
			{ upsert: true } // Insert if it doesn't exist
		);

		const message = result.upsertedId
			? "Note inserted successfully"
			: "Note updated successfully";

		return NextResponse.json({ message }, { status: 200 });
	} catch (e: any) {
		console.error(e);
		return NextResponse.json({ message: "Fail" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const noteId = req.nextUrl.searchParams.get('noteId');
		if (!noteId)
			return NextResponse.json({ "message": "noteId is null in header params"}, { status: 405 });

		const db = await dbPromise();
		const notes = db.collection('notes');
		await notes.deleteOne({ _id: new ObjectId(noteId)});
		return NextResponse.json({ "message": "Deleted note"}, { status: 200 });
	} catch (e: any) {
		return NextResponse.json({ "message": "Server error"}, { status: 500 });
	}
}

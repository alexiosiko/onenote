import { dbPromise } from "@/lib/monogdb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { userId } = await auth();
		if (!userId)
			return NextResponse.json({ message: "Auth error"}, { status: 401 });

		const db = await dbPromise();
		const notes = await db.collection("notes").find({ ownerId: userId }).toArray();
		return NextResponse.json({ message: "Fetched notes", notes}, { status: 200 });
	} catch (e: unknown) {
		console.error(e);
		return NextResponse.json({ message: "Fail"}, { status: 500 });
	}
	 
}



// async function addNoteRefsToUser(userId: string, noteId: ObjectId) {
// 	const db = await dbPromise();
// 	const users = db.collection('users');

// 	const result = await users.updateOne(
// 		{ userId },
// 		{ $push: { notes: noteId } } as any
// 	);

// 	if (result.matchedCount === 0) {
// 		console.error(`User with userId ${userId} not found`);
// 		throw new Error(`User not found`);
// 	}
// }

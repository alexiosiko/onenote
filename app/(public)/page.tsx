"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Note } from "@/lib/types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
const [notesData, setNotesData] = useState<Note[] | null | undefined>(undefined);

const user = useUser();
const router = useRouter();

const fetchNotes =  async () => {
	if (!user.isSignedIn) {
		setNotesData(null);
		return;
	}
	try {
		console.log("Fetching notes");
		const res = await axios.get("/api/notes");
		setNotesData(res.data.notes);
	} catch (e) {
		console.error(e);
		}
	}	

	useEffect(() => {
		fetchNotes();
	}, [user.isSignedIn])


return (
	<div className="flex flex-col max-w-4xl mx-auto">
		<div className="flex justify-between py-8">
			<p className="text-5xl">Notes</p>
			<Input className="max-w-48" placeholder="Search my notes" />
		</div>
		<Button variant="default" onClick={() => router.push('/note')}>Create Note</Button>
		<div className="w-full flex flex-col py-4 gap-4">
			{notesData && notesData.map((note) => 
				<div onClick={() => router.push(`/note/${note._id.toString()}`)} className="hover:cursor-pointer hover:bg-background p-2" key={note._id.toString()}>{note.title}</div>
			)}
			{notesData === undefined && 
				<>
					<Skeleton className="w-full h-8 p-6" />
					<Skeleton className="w-full h-8 p-6" />
					<Skeleton className="w-full h-8 p-6" />
					<Skeleton className="w-full h-8 p-6" />
				</>
			}
		</div>
	</div>
);
}
"use client";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Note } from "@/lib/types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

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
		<div className="flex flex-col gap-2">
			<p>My Notes</p>
			<Button variant="secondary" onClick={() => router.push('/note')}>Create Note</Button>
		</div>
		{/* <div className="w-48 h-screen flex flex-col p-2 gap-4">
			<Button onClick={() => router.push('/note')}>New Note</Button>
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
		<div className="bg-background flex-grow p-4">
		{user.isSignedIn ? <UserButton /> : <SignInButton />}

		</div> */}
	</div>
);
}
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa"
export default function Delete({ noteId }: {
	noteId: string | null
}) {
	const router = useRouter();
	const handleDelete = async () => {
		if (!noteId) {
			toast({
				title: "This note is not saved on your account.",
				description: "Cannot delete note that is not already stored.",
				variant: "destructive"
			})
			return;
		}
		try {
			const res = await axios.delete('/api/note', {
				params: { noteId: noteId }
			});
			toast({
				title: "Note deleted."
			})
			router.push('/'); // Go home
		} catch (e: any) {
			console.error(e);
		}
	}
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<FaTrashAlt className="hover:cursor-pointer" size={32} />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

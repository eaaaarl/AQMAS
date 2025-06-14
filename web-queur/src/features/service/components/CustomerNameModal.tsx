import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";

interface CustomerNameModalProps {
    open: boolean;
    onCancel: () => void;
    name: string | '';
    setName: (name: string) => void;
    onConfirm: () => void;
}

export default function CustomerNameModal({ open, onCancel, name, setName, onConfirm }: CustomerNameModalProps) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter Customer Name?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please provide the customer's name for this order.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Customer name"
                        autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onCancel()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

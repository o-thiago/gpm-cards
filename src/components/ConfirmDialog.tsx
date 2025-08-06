"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
}

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
}: ConfirmDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end space-x-2 mt-4">
					<Button variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Remover
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

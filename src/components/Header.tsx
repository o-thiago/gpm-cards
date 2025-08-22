"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
	onAddCard: () => void;
}

export function Header({ onAddCard }: HeaderProps) {
	return (
		<header className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Meus Cards</h1>
				<Button
					onClick={onAddCard}
					className="bg-indigo-600 hover:bg-indigo-700"
				>
					<Plus className="w-4 h-4 mr-2" />
					Adicionar Card
				</Button>
			</div>
		</header>
	);
}

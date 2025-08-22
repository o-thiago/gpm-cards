"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	onAddCard: () => void;
}

export function EmptyState({ onAddCard }: EmptyStateProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
			<div className="container mx-auto">
				<div className="text-center py-20">
					<h1 className="text-4xl font-bold text-primary mb-4">
						Bem-vindo ao GPMecatrônica Cards!
					</h1>
					<p className="text-muted-foreground mb-8">
						Crie e gerencie os cards do grupo de pesquisa.
					</p>
					<Button onClick={onAddCard} size="lg">
						<Plus className="w-5 h-5 mr-2" />
						Adicionar Primeiro Card
					</Button>
				</div>
			</div>
		</div>
	);
}

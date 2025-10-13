"use client";

import { Plus } from "lucide-react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	onAddCard: () => void;
	session: Session | null;
}

export function EmptyState({ onAddCard, session }: EmptyStateProps) {
	return (
		<div className="p-4 min-h-screen">
			<div className="container mx-auto">
				<div className="text-center py-20">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Bem-vindo ao GPMecatrônica Cards!
					</h1>
					<p className="text-muted-foreground mb-8">
						{session
							? "Crie e gerencie os cards do grupo de pesquisa."
							: "Por favor, faça login para criar e gerenciar os cards do grupo de pesquisa."}
					</p>
					{session?.user?.role === "ADMIN" && (
						<Button onClick={onAddCard} size="lg">
							<Plus className="w-5 h-5 mr-2" />
							Adicionar Card
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

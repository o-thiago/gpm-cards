"use client";

import { useState } from "react";

import { Header } from "@/components/Header";
import { CardForm } from "@/components/CardForm";
import { CardGrid } from "@/components/CardGrid";
import { Slideshow } from "@/components/Slideshow";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { useCards } from "@/hooks/useCards";
import type { CardData } from "@/components/ui/card";

export default function CardsPage() {
	const { cards, addCard, updateCard, deleteCard } = useCards();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingCard, setEditingCard] = useState<CardData | null>(null);
	const [cardToDelete, setCardToDelete] = useState<string | null>(null);

	const handleOpenForm = () => {
		setEditingCard(null);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingCard(null);
	};

	const handleSubmitForm = (formData: {
		title: string;
		description: string;
		image: string;
	}) => {
		if (editingCard) {
			updateCard(editingCard.id, formData);
		} else {
			addCard(formData);
		}
		handleCloseForm();
	};

	const handleEditCard = (card: CardData) => {
		setEditingCard(card);
		setIsFormOpen(true);
	};

	const handleDeleteCard = (cardId: string) => {
		setCardToDelete(cardId);
	};

	const confirmDeleteCard = () => {
		if (cardToDelete) {
			deleteCard(cardToDelete);
			setCardToDelete(null);
		}
	};

	if (cards.length === 0) {
		return (
			<>
				<EmptyState onAddCard={handleOpenForm} />
				<CardForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleSubmitForm}
					editingCard={editingCard}
				/>
			</>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<Header onAddCard={handleOpenForm} />
			<Slideshow cards={cards} />
			<CardGrid
				cards={cards}
				onEditCard={handleEditCard}
				onDeleteCard={handleDeleteCard}
			/>

			<CardForm
				isOpen={isFormOpen}
				onClose={handleCloseForm}
				onSubmit={handleSubmitForm}
				editingCard={editingCard}
			/>

			<ConfirmDialog
				isOpen={!!cardToDelete}
				onClose={() => setCardToDelete(null)}
				onConfirm={confirmDeleteCard}
				title="Confirmar Exclusão"
				description="Tem certeza que deseja remover este card? Esta ação não pode ser desfeita."
			/>
		</div>
	);
}

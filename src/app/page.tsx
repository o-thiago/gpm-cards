"use client";

import { useState } from "react";
import { CardForm } from "@/components/CardForm";
import { CardGrid } from "@/components/CardGrid";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { Slideshow } from "@/components/Slideshow";
import type { CardData } from "@/components/ui/card";
import useCardsStore from "@/store/useCardsStore";

export default function CardsPage() {
	const { cards, addCard, updateCard, deleteCard } = useCardsStore();
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
		<div className="min-h-screen bg-background">
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


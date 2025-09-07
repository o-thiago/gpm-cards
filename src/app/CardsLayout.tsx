"use client";

import { useState } from "react";
import { CardForm } from "@/components/CardForm";
import { CardGrid } from "@/components/CardGrid";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { Slideshow } from "@/components/Slideshow";
import type { CardData, CardFormData } from "@/components/ui/card";
import { client } from "@/lib/orpc";

interface CardsLayoutProps {
	initialCards: CardData[];
}

export function CardsLayout({ initialCards }: CardsLayoutProps) {
	const [cards, setCards] = useState<CardData[]>(initialCards);
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

	const handleSubmitForm = async (formData: CardFormData) => {
		if (editingCard) {
			const updatedCard = await client.cards.update({
				...formData,
				id: editingCard.id,
			});
			setCards(
				cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
			);
		} else {
			const newCard = await client.cards.create(formData);
			setCards([...cards, newCard]);
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

	const confirmDeleteCard = async () => {
		if (cardToDelete) {
			await client.cards.delete({ id: cardToDelete });
			setCards(cards.filter((card) => card.id !== cardToDelete));
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

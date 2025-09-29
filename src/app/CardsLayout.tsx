"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { CardForm } from "@/components/CardForm";
import { CardGrid } from "@/components/CardGrid";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { Slideshow } from "@/components/Slideshow";
import type {
	CardCategory,
	CardData,
	CardFormData,
} from "@/components/ui/card";
import { client } from "@/lib/orpc";

interface CardsLayoutProps {
	initialCards: CardData[];
	session: Session | null;
	category: CardCategory;
}

export function CardsLayout({
	initialCards,
	session,
	category,
}: CardsLayoutProps) {
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
		const dataWithCategory = { ...formData, category };
		if (editingCard) {
			const updatedCard = await client.cards.update({
				...dataWithCategory,
				id: editingCard.id,
			});
			setCards(
				cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
			);
		} else {
			const newCard = await client.cards.create(dataWithCategory);
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
				<Header onAddCard={handleOpenForm} session={session} />
				<EmptyState onAddCard={handleOpenForm} session={session} />
				{session?.user && (
					<CardForm
						isOpen={isFormOpen}
						onClose={handleCloseForm}
						onSubmit={handleSubmitForm}
						editingCard={editingCard}
						category={category}
					/>
				)}
			</>
		);
	}

	return (
		<div className="min-h-screen">
			<Header onAddCard={handleOpenForm} session={session} />
			<Slideshow cards={cards} />
			<CardGrid
				cards={cards}
				onEditCard={handleEditCard}
				onDeleteCard={handleDeleteCard}
				session={session}
			/>

			{session?.user && (
				<>
					<CardForm
						isOpen={isFormOpen}
						onClose={handleCloseForm}
						onSubmit={handleSubmitForm}
						editingCard={editingCard}
						category={category}
					/>
					<ConfirmDialog
						isOpen={!!cardToDelete}
						onClose={() => setCardToDelete(null)}
						onConfirm={confirmDeleteCard}
						title="Confirmar Exclusão"
						description="Tem certeza que deseja remover este card? Esta ação não pode ser desfeita."
					/>
				</>
			)}
		</div>
	);
}

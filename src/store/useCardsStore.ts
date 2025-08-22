import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardData, CardFormData } from "@/components/ui/card";

interface CardsState {
	cards: CardData[];
	addCard: (formData: CardFormData) => void;
	updateCard: (cardId: string, formData: CardFormData) => void;
	deleteCard: (cardId: string) => void;
}

const useCardsStore = create<CardsState>()(
	persist(
		(set) => ({
			cards: [],
			addCard: (formData) =>
				set((state) => ({
					cards: [
						...state.cards,
						{
							id: Date.now().toString(),
							title: formData.title.trim(),
							description: formData.description.trim(),
							image:
								formData.image ||
								`/placeholder.svg?height=300&width=400&query=${encodeURIComponent(
									formData.title,
								)}`,
							createdAt: new Date().toISOString(),
						},
					],
				})),
			updateCard: (cardId, formData) =>
				set((state) => ({
					cards: state.cards.map((card) =>
						card.id === cardId
							? {
									...card,
									title: formData.title.trim(),
									description: formData.description.trim(),
									image: formData.image || card.image,
								}
							: card,
					),
				})),
			deleteCard: (cardId) =>
				set((state) => ({
					cards: state.cards.filter((card) => card.id !== cardId),
				})),
		}),
		{
			name: "cards-storage", // Key to store data in localStorage
		},
	),
);

export default useCardsStore;

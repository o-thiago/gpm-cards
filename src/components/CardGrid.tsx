import type { Session } from "next-auth";
import type { CardData } from "@/components/ui/card";
import { CardItem } from "./CardItem";

interface CardGridProps {
	cards: CardData[];
	onEditCard: (card: CardData) => void;
	onDeleteCard: (cardId: string) => void;
	session: Session | null;
}

export function CardGrid({
	cards,
	onEditCard,
	onDeleteCard,
	session,
}: CardGridProps) {
	const isAdmin = session?.user?.role === "ADMIN";

	return (
		<main className="container mx-auto px-4 pb-8">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Cards</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{cards.map((card) => (
					<CardItem
						key={card.id}
						card={card}
						onEdit={isAdmin ? onEditCard : () => {}}
						onDelete={isAdmin ? onDeleteCard : () => {}}
						session={session}
					/>
				))}
			</div>
		</main>
	);
}

import { client } from "@/lib/orpc";
import { CardsLayout } from "./CardsLayout";

export default async function CardsPage() {
	const initialCards = await client.cards.get();

	return <CardsLayout initialCards={initialCards} />;
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { CardCategory } from "@/lib/db";
import { client } from "@/lib/orpc";
import { CardsLayout } from "./CardsLayout";

interface CategoryPageProps {
	category: CardCategory;
}

export default async function CategoryPage({ category }: CategoryPageProps) {
	const session = await getServerSession(authOptions);
	const initialCards = await client.cards.getByCategory({ category });

	return (
		<CardsLayout
			initialCards={initialCards}
			session={session}
			category={category}
		/>
	);
}

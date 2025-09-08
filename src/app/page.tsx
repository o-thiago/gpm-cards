import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { client } from "@/lib/orpc";
import { CardsLayout } from "./CardsLayout";

export default async function CardsPage() {
	const session = await getServerSession(authOptions);
	const initialCards = await client.cards.get();

	return <CardsLayout initialCards={initialCards} session={session} />;
}

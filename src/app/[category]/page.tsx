import { notFound } from "next/navigation";
import type { CardCategory } from "@/components/ui/card";
import CategoryPage from "../CategoryPage";

const categoryMap: Record<string, CardCategory> = {
	warnings: "WARNING",
	rules: "RULE",
	links: "LINK",
};

export default async function Page({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category: categoryName } = await params;
	const category = categoryMap[categoryName.toLowerCase()];

	if (!category) {
		return notFound();
	}

	return <CategoryPage category={category} />;
}


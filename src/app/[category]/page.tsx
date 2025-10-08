import { notFound } from "next/navigation";
import type { CardCategory } from "@/components/ui/card";
import CategoryPage from "../CategoryPage";

const categoryMap: Record<string, CardCategory> = {
	warnings: "WARNING",
	rules: "RULE",
	links: "LINK",
};

export default function Page({ params }: { params: { category: string } }) {
	const category = categoryMap[params.category.toLowerCase()];

	if (!category) {
		return notFound();
	}

	return <CategoryPage category={category} />;
}

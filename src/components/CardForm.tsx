"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CardCategory, CardData, CardFormData } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";

interface CardFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: CardFormData) => void;
	editingCard?: CardData | null;
	category: CardCategory;
}

export function CardForm({
	isOpen,
	onClose,
	onSubmit,
	editingCard,
	category,
}: CardFormProps) {
	const [formData, setFormData] = useState<CardFormData>({
		title: "",
		description: "",
		image: "",
		metadata: { link: "" },
	});

	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		if (editingCard) {
			setFormData({
				title: editingCard.title,
				description: editingCard.description,
				image: editingCard.image,
				metadata: editingCard.metadata ?? { link: "" },
			});
		} else {
			setFormData({ title: "", description: "", image: "", metadata: { link: "" } });
		}
		setImageError(false);
	}, [editingCard]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const isTitleValid = formData.title.trim() !== "";
		const isDescriptionValid = formData.description.trim() !== "";
		const isLinkValid = category !== "LINK" || (formData.metadata?.link?.trim() ?? "") !== "";
		const isImageValid = formData.image.trim() !== "";

		if (!isImageValid) {
			setImageError(true);
		}

		if (!isTitleValid || !isDescriptionValid || !isLinkValid || !isImageValid) return;

		onSubmit(formData);
	};

	const handleClose = () => {
		setFormData({ title: "", description: "", image: "", metadata: { link: "" } });
		setImageError(false);
		onClose();
	};

	const handleImageChange = (base64: string) => {
		setFormData({ ...formData, image: base64 });
		if (base64.trim() !== "") {
			setImageError(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-lg border border-white/20">
				<DialogHeader>
					<DialogTitle>
						{editingCard ? "Editar Card" : "Adicionar Novo Card"}
					</DialogTitle>
					<DialogDescription>
						{editingCard
							? "Edite as informações do card."
							: "Preencha as informações para criar um novo card."}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Título</Label>
						<Input
							id="title"
							name="title"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							placeholder="Digite o título do card"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Descrição</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Digite a descrição do card"
							rows={3}
							required
						/>
					</div>

					{category === "LINK" && (
						<div className="space-y-2">
							<Label htmlFor="link">Link</Label>
							<Input
								id="link"
								name="link"
								value={formData.metadata?.link ?? ""}
								onChange={(e) =>
									setFormData({
										...formData,
										metadata: { ...formData.metadata, link: e.target.value },
									})
								}
								placeholder="https://example.com"
								required
								type="url"
							/>
						</div>
					)}

					<ImageUpload
						name="image"
						value={formData.image}
						onChange={handleImageChange}
					/>
					{imageError && (
						<p className="text-sm font-medium text-destructive">
							É obrigatório o envio de uma imagem.
						</p>
					)}

					<Button type="submit" className="w-full">
						{editingCard ? "Salvar Alterações" : "Adicionar Card"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

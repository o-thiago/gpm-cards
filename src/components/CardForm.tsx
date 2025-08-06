"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "./ImageUpload";
import type { CardData, CardFormData } from "@/components/ui/card";

interface CardFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: CardFormData) => void;
	editingCard?: CardData | null;
}

export function CardForm({
	isOpen,
	onClose,
	onSubmit,
	editingCard,
}: CardFormProps) {
	const [formData, setFormData] = useState<CardFormData>({
		title: "",
		description: "",
		image: "",
	});

	useEffect(() => {
		if (editingCard) {
			setFormData({
				title: editingCard.title,
				description: editingCard.description,
				image: editingCard.image,
			});
		} else {
			setFormData({ title: "", description: "", image: "" });
		}
	}, [editingCard, isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title.trim() || !formData.description.trim()) return;
		onSubmit(formData);
	};

	const handleClose = () => {
		setFormData({ title: "", description: "", image: "" });
		onClose();
	};

	const handleImageChange = (base64: string) => {
		setFormData({ ...formData, image: base64 });
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Digite a descrição do card"
							rows={3}
							required
						/>
					</div>

					<ImageUpload value={formData.image} onChange={handleImageChange} />

					<Button type="submit" className="w-full">
						{editingCard ? "Salvar Alterações" : "Adicionar Card"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
	value: string;
	name?: string;
	onChange: (base64: string) => void;
	onFileChange?: (file: File | null) => void;
	required?: boolean;
}

export function ImageUpload({
	value,
	name,
	onChange,
	onFileChange,
	required = false,
}: ImageUploadProps) {
	const [dragActive, setDragActive] = useState(false);
	const [error, setError] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (file: File | null) => {
		if (!file) {
			onChange("");
			onFileChange?.(null);
			if (required) {
				setError(true);
			}
			return;
		}

		// Verificar se é uma imagem
		if (!file.type.startsWith("image/")) {
			alert("Por favor, selecione apenas arquivos de imagem.");
			return;
		}

		// Verificar tamanho (máximo 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("A imagem deve ter no máximo 5MB.");
			return;
		}

		// Converter para base64
		const reader = new FileReader();
		reader.onload = (e) => {
			const base64 = e.target?.result as string;
			onChange(base64);
			onFileChange?.(file);
			setError(false);
		};
		reader.readAsDataURL(file);
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files?.item(0)) {
			handleFileChange(e.dataTransfer.files[0]);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.item(0)) {
			handleFileChange(e.target.files[0]);
		}
	};

	const handleRemove = () => {
		onChange("");
		onFileChange?.(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
		if (required) {
			setError(true);
		}
	};

	const openFileDialog = () => {
		inputRef.current?.click();
	};

	return (
		<div className="space-y-2">
			<Label>Imagem</Label>

			{value ? (
				<div className="relative">
					<div className="relative w-full h-48 rounded-lg overflow-hidden border">
						<Image src={value} alt="Preview" fill className="object-contain" />
					</div>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						className="absolute top-2 right-2"
						onClick={handleRemove}
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			) : (
				<button
					type="button"
					className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
						dragActive
							? "border-indigo-500 bg-indigo-50"
							: error
								? "border-red-500"
								: "border-gray-300 hover:border-gray-400"
					} w-full`}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					onClick={openFileDialog}
				>
					<div className="flex flex-col items-center space-y-2">
						<ImageIcon className="w-8 h-8 text-gray-400" />
						<div className="text-sm text-gray-600">
							<span className="font-medium text-indigo-600">
								Clique para enviar
							</span>
							{" ou arraste e solte"}
						</div>
						<div className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</div>
					</div>
				</button>
			)}

			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				name={name}
				onChange={handleInputChange}
				className="hidden"
				required={required}
			/>

			{!value && (
				<Button
					type="button"
					variant="outline"
					onClick={openFileDialog}
					className="w-full"
				>
					<Upload className="w-4 h-4 mr-2" />
					Selecionar Imagem
				</Button>
			)}
			{error && (
				<p className="text-sm font-medium text-destructive">
					É obrigatório o envio de uma imagem.
				</p>
			)}
		</div>
	);
}

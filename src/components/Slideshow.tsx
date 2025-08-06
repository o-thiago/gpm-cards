"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CardData } from "@/components/ui/card";

interface SlideshowProps {
	cards: CardData[];
}

export function Slideshow({ cards }: SlideshowProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	// Slideshow automático
	useEffect(() => {
		if (!isPlaying || cards.length === 0) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % cards.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [isPlaying, cards.length]);

	// Ajustar slide atual se cards mudarem
	useEffect(() => {
		if (currentSlide >= cards.length && cards.length > 0) {
			setCurrentSlide(cards.length - 1);
		}
	}, [cards.length, currentSlide]);

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
	};

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % cards.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
	};

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	if (cards.length === 0) return null;

	return (
		<section
			className="relative bg-white shadow-lg mb-8"
			aria-label="Slideshow de cards"
		>
			<div className="relative h-96 overflow-hidden">
				{cards.map((card, index) => {
					const isBase64Image = card.image.startsWith("data:image/");

					return (
						<div
							key={card.id}
							className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
								index === currentSlide
									? "translate-x-0"
									: index < currentSlide
										? "-translate-x-full"
										: "translate-x-full"
							}`}
						>
							<div className="flex h-full">
								<div className="w-1/2 relative">
									{isBase64Image ? (
										<Image
											src={card.image || "/placeholder.svg"}
											alt={card.title}
											fill
											className="object-cover"
											priority={index === 0}
											unoptimized // Necessário para imagens base64
										/>
									) : (
										<Image
											src={card.image || "/placeholder.svg"}
											alt={card.title}
											fill
											className="object-cover"
											priority={index === 0}
										/>
									)}
								</div>
								<div className="w-1/2 flex items-center justify-center p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
									<div className="text-center max-w-md">
										<h2 className="text-3xl font-bold mb-4">{card.title}</h2>
										<p className="text-lg opacity-90">{card.description}</p>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Controles do Slideshow */}
			<div className="absolute inset-0 flex items-center justify-between p-4">
				<Button
					variant="outline"
					size="icon"
					onClick={prevSlide}
					className="bg-white/80 hover:bg-white"
					aria-label="Slide anterior"
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={nextSlide}
					className="bg-white/80 hover:bg-white"
					aria-label="Próximo slide"
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>

			{/* Indicadores e Controle de Play/Pause */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
				<Button
					variant="outline"
					size="sm"
					onClick={togglePlayPause}
					className="bg-white/80 hover:bg-white"
					aria-label={isPlaying ? "Pausar slideshow" : "Reproduzir slideshow"}
				>
					{isPlaying ? (
						<Pause className="w-3 h-3" />
					) : (
						<Play className="w-3 h-3" />
					)}
				</Button>
				<div className="flex space-x-2">
					{cards.map((card, index) => (
						<button
							type="submit"
							key={card.id}
							onClick={() => goToSlide(index)}
							className={`w-3 h-3 rounded-full transition-colors ${
								index === currentSlide ? "bg-white" : "bg-white/50"
							}`}
							aria-label={`Ir para slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

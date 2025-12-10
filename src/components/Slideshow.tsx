"use client";

import Autoplay from "embla-carousel-autoplay";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CardData } from "@/components/ui/card";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

interface SlideshowProps {
	cards: CardData[];
}

export function Slideshow({ cards }: SlideshowProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [isPlaying, setIsPlaying] = useState(true);

	const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

	useEffect(() => {
		if (!api) return;

		const autoplay = plugin.current;
		if (isPlaying) {
			autoplay.play();
		} else {
			autoplay.stop();
		}
	}, [api, isPlaying]);

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	if (cards.length === 0) return null;

	return (
		<section
			className="relative bg-card shadow-lg mb-8 rounded-xl overflow-hidden"
			aria-label="Slideshow de cards"
		>
			<Carousel
				setApi={setApi}
				plugins={[plugin.current]}
				className="w-full"
				opts={{
					loop: true,
				}}
			>
				<CarouselContent className="-ml-0">
					{cards.map((card, index) => {
						const isBase64Image = card.image?.startsWith("data:image/");
						return (
							<CarouselItem key={card.id} className="pl-0">
								<div className="flex h-96 w-full">
									<div className="w-1/2 relative bg-muted">
										<Image
											src={card.image || "/placeholder.svg"}
											alt={card.title}
											fill
											className="object-contain p-4"
											priority={index === 0}
											unoptimized={isBase64Image}
										/>
									</div>
									<div className="w-1/2 flex items-center justify-center p-8 bg-gradient-to-r from-primary to-green-600 text-white">
										<div className="text-center max-w-md">
											<h2 className="text-3xl font-bold mb-4">{card.title}</h2>
											<p className="text-lg opacity-90 line-clamp-6">
												{card.description}
											</p>
										</div>
									</div>
								</div>
							</CarouselItem>
						);
					})}
				</CarouselContent>
				<CarouselPrevious
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black border-none h-10 w-10 z-10"
					variant="outline"
				/>
				<CarouselNext
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black border-none h-10 w-10 z-10"
					variant="outline"
				/>
			</Carousel>

			{/* Indicadores e Controle de Play/Pause */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-10">
				<Button
					variant="outline"
					size="icon"
					onClick={togglePlayPause}
					className="h-8 w-8 bg-white/80 hover:bg-white border-none rounded-full"
					aria-label={isPlaying ? "Pausar slideshow" : "Reproduzir slideshow"}
				>
					{isPlaying ? (
						<Pause className="w-3 h-3 text-black" />
					) : (
						<Play className="w-3 h-3 text-black" />
					)}
				</Button>
			</div>
		</section>
	);
}

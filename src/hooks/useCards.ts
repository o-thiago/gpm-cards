"use client";

import { useState, useEffect } from "react";
import type { CardData, CardFormData } from "@/components/ui/card";

const INITIAL_CARDS: CardData[] = [];

export function useCards() {
  const [cards, setCards] = useState<CardData[]>([]);

  // Carregar cards do localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("cards");
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (error) {
        console.error("Erro ao carregar cards:", error);
        setCards(INITIAL_CARDS);
        localStorage.setItem("cards", JSON.stringify(INITIAL_CARDS));
      }
    } else {
      setCards(INITIAL_CARDS);
      localStorage.setItem("cards", JSON.stringify(INITIAL_CARDS));
    }
  }, []);

  // Salvar cards no localStorage
  const saveCards = (newCards: CardData[]) => {
    try {
      setCards(newCards);
      localStorage.setItem("cards", JSON.stringify(newCards));
    } catch (error) {
      console.error("Erro ao salvar cards:", error);
      if (error instanceof Error && error.name === "QuotaExceededError") {
        alert(
          "Espaço de armazenamento esgotado. Tente usar imagens menores ou remover alguns cards.",
        );
      }
    }
  };

  const addCard = (formData: CardFormData) => {
    const newCard: CardData = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      image:
        formData.image ||
        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(formData.title)}`,
      createdAt: new Date().toISOString(),
    };
    saveCards([...cards, newCard]);
  };

  const updateCard = (cardId: string, formData: CardFormData) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            title: formData.title.trim(),
            description: formData.description.trim(),
            image: formData.image || card.image,
          }
        : card,
    );
    saveCards(updatedCards);
  };

  const deleteCard = (cardId: string) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    saveCards(updatedCards);
  };

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
  };
}

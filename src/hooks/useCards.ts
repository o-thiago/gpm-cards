"use client"

import { useState, useEffect } from "react"
import type { CardData, CardFormData } from "@/components/ui/card"

const INITIAL_CARDS: CardData[] = [
  {
    id: "1",
    title: "Desenvolvimento Web",
    description: "Criação de aplicações web modernas e responsivas usando as mais recentes tecnologias.",
    image: "/placeholder.svg?height=300&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Design UI/UX",
    description: "Design de interfaces intuitivas e experiências de usuário excepcionais.",
    image: "/placeholder.svg?height=300&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Marketing Digital",
    description: "Estratégias de marketing digital para aumentar sua presença online.",
    image: "/placeholder.svg?height=300&width=400",
    createdAt: new Date().toISOString(),
  },
]

export function useCards() {
  const [cards, setCards] = useState<CardData[]>([])

  // Carregar cards do localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("cards")
    if (savedCards) {
      setCards(JSON.parse(savedCards))
    } else {
      setCards(INITIAL_CARDS)
      localStorage.setItem("cards", JSON.stringify(INITIAL_CARDS))
    }
  }, [])

  // Salvar cards no localStorage
  const saveCards = (newCards: CardData[]) => {
    setCards(newCards)
    localStorage.setItem("cards", JSON.stringify(newCards))
  }

  const addCard = (formData: CardFormData) => {
    const newCard: CardData = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      image:
        formData.image.trim() || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(formData.title)}`,
      createdAt: new Date().toISOString(),
    }
    saveCards([...cards, newCard])
  }

  const updateCard = (cardId: string, formData: CardFormData) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            title: formData.title.trim(),
            description: formData.description.trim(),
            image: formData.image.trim() || card.image,
          }
        : card,
    )
    saveCards(updatedCards)
  }

  const deleteCard = (cardId: string) => {
    const updatedCards = cards.filter((card) => card.id !== cardId)
    saveCards(updatedCards)
  }

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
  }
}

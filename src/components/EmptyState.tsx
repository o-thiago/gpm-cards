"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyStateProps {
  onAddCard: () => void
}

export function EmptyState({ onAddCard }: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo!</h1>
          <p className="text-gray-600 mb-8">Adicione seu primeiro card para começar</p>
          <Button onClick={onAddCard} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Primeiro Card
          </Button>
        </div>
      </div>
    </div>
  )
}

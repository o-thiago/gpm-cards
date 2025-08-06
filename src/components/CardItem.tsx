"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import type { CardData } from "@/components/ui/card"

interface CardItemProps {
  card: CardData
  onEdit: (card: CardData) => void
  onDelete: (cardId: string) => void
}

export function CardItem({ card, onEdit, onDelete }: CardItemProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
      <div className="relative h-48">
        <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />

        {/* Dropdown Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                aria-label="Opções do card"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(card)} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(card.id)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-600">{card.description}</CardDescription>
      </CardContent>
    </Card>
  )
}

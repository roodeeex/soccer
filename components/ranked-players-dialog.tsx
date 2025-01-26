"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy } from "lucide-react"

interface Player {
  name: string
  matchesPlayed: number
}

interface RankedPlayersDialogProps {
  isOpen: boolean
  onClose: () => void
  players: Player[]
}

export function RankedPlayersDialog({ isOpen, onClose, players }: RankedPlayersDialogProps) {
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([])

  useEffect(() => {
    const sortedPlayers = [...players].sort((a, b) => b.matchesPlayed - a.matchesPlayed)
    setRankedPlayers(sortedPlayers)
  }, [players])

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-600"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto data-[state=open]:duration-0 data-[state=closed]:duration-0">
        <DialogHeader>
          <DialogTitle>Players Ranked by Matches Played</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Matches</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedPlayers.map((player, index) => (
              <TableRow key={player.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {index < 3 ? <Trophy className={`h-4 w-4 ${getMedalColor(index + 1)}`} /> : index + 1}
                  </div>
                </TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-right">{player.matchesPlayed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}


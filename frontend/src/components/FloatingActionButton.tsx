import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { AddEntryDialog } from "./AddEntryDialog"

export const FloatingActionButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button
        size="lg"
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Add time entry"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

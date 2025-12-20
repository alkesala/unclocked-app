import { createFileRoute } from "@tanstack/react-router"
import { TimeEntriesPage } from "../pages/TimeEntriesPage"

export const Route = createFileRoute("/time-entries")({
  component: TimeEntriesPage,
})

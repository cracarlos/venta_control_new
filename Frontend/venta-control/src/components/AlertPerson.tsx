import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { AlertProps } from "@/types/alert"
import { AlertCircleIcon } from "lucide-react"

export function AlertPerson({ ok, message, title }: AlertProps) {
  // const _message = type === 'object' ? [message] : message
  

  return (
    <Alert variant={ ok?"default":"destructive" } className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul>
          {JSON.stringify(message, null, 2)}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

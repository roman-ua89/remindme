import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type AddTopicPopoverProps = {
  onSave: (name: string) => void
}

export function AddTopicPopover({ onSave }: AddTopicPopoverProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName) return

    onSave(trimmedName)
    setName('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button>
            <PlusIcon />
            Add topic
          </Button>
        }
      />
      <PopoverContent align="end" className="w-64">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="topic-name">Topic name</Label>
            <Input
              id="topic-name"
              value={name}
              placeholder="e.g. Verbs"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSave()
              }}
            />
          </div>
          <Button className="w-full" onClick={handleSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

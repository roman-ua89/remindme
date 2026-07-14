import { Link } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageContainer } from '@/components/layout/PageContainer'

export function AppHeader() {
  return (
    <header className="border-b border-border">
      <PageContainer className="flex h-14 items-center justify-between">
        <Link
          to="/"
          className="font-heading text-lg font-semibold tracking-tight hover:text-primary"
        >
          RemindMe
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm">
                User menu
                <ChevronDownIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageContainer>
    </header>
  )
}

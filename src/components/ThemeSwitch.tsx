"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-1" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-[60px]" />
          <p>Themes</p>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("radius")}>
          Radius
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("cyberpunk")}>
          Cyberpunk
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("bluelight")}>
          Bluelight
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("midnight")}>
          Midnight
        </DropdownMenuItem>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

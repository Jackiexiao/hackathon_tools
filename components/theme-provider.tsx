import { createContext, useContext, useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  return (
    <div>
      {children}
    </div>
  )
}
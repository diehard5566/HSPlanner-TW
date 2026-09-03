import type { ReactNode } from 'react'
import { useUiText } from './uiText'

export function UiText({ children }: { children: string }) {
  const ui = useUiText()
  return <>{ui(children)}</>
}

export function LocalizedNode({ children }: { children: ReactNode }) {
  const ui = useUiText()
  return <>{typeof children === 'string' ? ui(children) : children}</>
}

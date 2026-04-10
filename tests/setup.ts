import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

global.fetch = vi.fn()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).PointerEvent = class PointerEvent {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).Event = class Event {}
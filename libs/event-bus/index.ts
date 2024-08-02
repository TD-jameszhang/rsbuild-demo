type Payload = Record<string, unknown>
type Callback = (payload?: Payload) => void

export default class EventBus {
  private static instance: EventBus

  private listeners: Map<string, Callback[]>

  private constructor() {
    this.listeners = new Map()
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }

    return this.instance
  }

  private getHandlers(eventName: string): Callback[] {
    const handlers = this.listeners.get(eventName)

    return handlers || []
  }

  on(eventName: string, handler: Callback): () => void {
    const handlers = this.getHandlers(eventName)

    if (handler.length) {
      this.listeners.set(eventName, [...handlers, handler])
    } else {
      this.listeners.set(eventName, [handler])
    }

    return () => {
      const index = this.getHandlers(eventName).indexOf(handler)

      if (index > -1) {
        this.listeners.set(
          eventName,
          this.getHandlers(eventName).filter((_, i) => i !== index)
        )
      }
    }
  }

  off(eventName: string, handler?: Callback): void {
    if (eventName === '*') {
      this.listeners.clear()

      return
    }

    const handlers = this.listeners.get(eventName)

    if (handlers) {
      if (handler) {
        this.listeners.set(
          eventName,
          handlers.filter(h => h !== handler)
        )
      } else {
        this.listeners.delete(eventName)
      }
    }
  }

  emit(eventName: string, payload?: Payload): void {
    const handlers = this.listeners.get(eventName)

    if (handlers) {
      handlers.forEach(handler => handler(payload))
    }
  }
}

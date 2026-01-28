export interface CardEvent {
	entityType: string;
	entityId: string;
	action?: string;
	payload?: unknown;
	notifId?: string;
}

type CardEventListener = (event: CardEvent) => void;

export class CardsByEvents {
	private listenersByEntityKey = new Map<string, Set<CardEventListener>>();

	private readonly ENTITY_KEY_SEPARATOR = '-';

	private buildEntityKey(entityType: string, entityId: string): string {
		return `${entityType}${this.ENTITY_KEY_SEPARATOR}${entityId}`;
	}

	subscribeToEntity(entityType: string, entityId: string, listener: CardEventListener): () => void {
		const entityKey = this.buildEntityKey(entityType, entityId);

		const listeners = this.listenersByEntityKey.get(entityKey) ?? new Set<CardEventListener>();

		listeners.add(listener);
		this.listenersByEntityKey.set(entityKey, listeners);

		return () => {
			const currentListeners = this.listenersByEntityKey.get(entityKey);
			if (!currentListeners) return;

			currentListeners.delete(listener);
			if (currentListeners.size === 0) {
				this.listenersByEntityKey.delete(entityKey);
			}
		};
	}

	emitEventToEntity(entityType: string, entityId: string, event: CardEvent): void {
		const entityKey = this.buildEntityKey(entityType, entityId);
		const listeners = this.listenersByEntityKey.get(entityKey);
		if (!listeners || listeners.size === 0) return;

		Array.from(listeners).forEach((listener) => {
			try {
				listener(event);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('emitEventToEntity listener error', error);
			}
		});
	}

	clearAllSubscriptions(): void {
		this.listenersByEntityKey.clear();
	}

	getActiveSubscriptionsCount(): number {
		let total = 0;
		Array.from(this.listenersByEntityKey.values()).forEach((listeners) => {
			total += listeners.size;
		});
		return total;
	}

	getListenersByEntityKey(): Map<string, Set<CardEventListener>> {
		return this.listenersByEntityKey;
	}
}

export const cardsByEvents = new CardsByEvents();
export default cardsByEvents;

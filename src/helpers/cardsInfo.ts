/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CardEvent {
	entityType: string;
	entityId: string;
	action?: string;
	payload?: any;
	notifId?: string;
}

type CardEventListener = (event: CardEvent) => void;

interface TypeSubscription {
	handler: CardEventListener;
	filter?: (event: CardEvent) => boolean;
}

export class CardsByEvents {
	private readonly listenersByEntityKey = new Map<string, Set<CardEventListener>>();
	private readonly listenersByType = new Map<string, Set<TypeSubscription>>();
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

	subscribeToType(entityType: string, handler: CardEventListener, filter?: (event: CardEvent) => boolean): () => void {
		const listeners = this.listenersByType.get(entityType) ?? new Set<TypeSubscription>();
		const subscription: TypeSubscription = { handler, filter };

		listeners.add(subscription);
		this.listenersByType.set(entityType, listeners);

		return () => {
			const currentListeners = this.listenersByType.get(entityType);
			if (!currentListeners) return;

			currentListeners.delete(subscription);
			if (currentListeners.size === 0) {
				this.listenersByType.delete(entityType);
			}
		};
	}

	hasSubscribers(entityType: string, entityId: string): boolean {
		const entityKey = this.buildEntityKey(entityType, entityId);
		return (this.listenersByEntityKey.get(entityKey)?.size ?? 0) > 0;
	}

	hasTypeSubscribers(entityType: string): boolean {
		return (this.listenersByType.get(entityType)?.size ?? 0) > 0;
	}

	emitEventToEntity(entityType: string, entityId: string, event: CardEvent): void {
		const entityKey = this.buildEntityKey(entityType, entityId);
		const entityListeners = this.listenersByEntityKey.get(entityKey);

		if (entityListeners && entityListeners.size > 0) {
			Array.from(entityListeners).forEach((listener) => {
				try {
					listener(event);
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error('emitEventToEntity listener error', error);
				}
			});
		}

		const typeListeners = this.listenersByType.get(entityType);
		if (typeListeners && typeListeners.size > 0) {
			Array.from(typeListeners).forEach(({ handler, filter }) => {
				try {
					if (!filter || filter(event)) {
						handler(event);
					}
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error('emitEventToType listener error', error);
				}
			});
		}
	}

	clearAllSubscriptions(): void {
		this.listenersByEntityKey.clear();
		this.listenersByType.clear();
	}

	getActiveSubscriptionsCount(): number {
		let total = 0;

		this.listenersByEntityKey.forEach((listeners) => {
			total += listeners.size;
		});

		this.listenersByType.forEach((listeners) => {
			total += listeners.size;
		});

		return total;
	}

	getListenersByEntityKey(): ReadonlyMap<string, Set<CardEventListener>> {
		return this.listenersByEntityKey;
	}

	getActiveSubscriptionKeys(): string[] {
		const entityKeys = Array.from(this.listenersByEntityKey.keys());
		const typeKeys = Array.from(this.listenersByType.keys()).map((type) => `${type}-*`);

		return [...entityKeys, ...typeKeys];
	}

	getTypeSubscriptionsCount(entityType: string): number {
		return this.listenersByType.get(entityType)?.size ?? 0;
	}
}

export default new CardsByEvents();

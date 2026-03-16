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
	private readonly registeredEntities = new Set<string>();
	private readonly kanbanStages = new Map<string, Set<string>>();
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

	registerEntity(entityType: string, entityId: string): () => void {
		const entityKey = this.buildEntityKey(entityType, entityId);
		this.registeredEntities.add(entityKey);

		return () => {
			this.registeredEntities.delete(entityKey);
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

	registerKanbanStage(entityCode: string, stageId: string): () => void {
		const stages = this.kanbanStages.get(entityCode) ?? new Set<string>();
		stages.add(stageId);
		this.kanbanStages.set(entityCode, stages);

		return () => {
			const currentStages = this.kanbanStages.get(entityCode);
			if (!currentStages) return;

			currentStages.delete(stageId);
			if (currentStages.size === 0) {
				this.kanbanStages.delete(entityCode);
			}
		};
	}

	hasKanbanStageSubscriber(entityCode: string, stageId: string): boolean {
		return this.kanbanStages.get(entityCode)?.has(stageId) ?? false;
	}

	hasSubscribers(entityType: string, entityId: string): boolean {
		const entityKey = this.buildEntityKey(entityType, entityId);
		const hasListeners = (this.listenersByEntityKey.get(entityKey)?.size ?? 0) > 0;
		const isRegistered = this.registeredEntities.has(entityKey);

		return hasListeners || isRegistered;
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
		this.registeredEntities.clear();
		this.kanbanStages.clear();
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

	getAllSubscribers(): {
		registeredEntities: string[];
		entitySubscribers: Record<string, number>;
		typeSubscribers: Record<string, number>;
		kanbanStages: Record<string, string[]>;
	} {
		return {
			registeredEntities: Array.from(this.registeredEntities),
			entitySubscribers: Object.fromEntries(Array.from(this.listenersByEntityKey.entries()).map(([key, listeners]) => [key, listeners.size])),
			typeSubscribers: Object.fromEntries(Array.from(this.listenersByType.entries()).map(([type, listeners]) => [type, listeners.size])),
			kanbanStages: Object.fromEntries(Array.from(this.kanbanStages.entries()).map(([entityCode, stages]) => [entityCode, Array.from(stages)])),
		};
	}
}

export const cardsByEvents = new CardsByEvents();
export default cardsByEvents;

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CardEvent {
	entityType: string;
	entityId: string;
	action?: string;
	payload?: any;
	notifId?: string;
	prevPayload?: any;
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
	private readonly kanbanFilterParams = new Map<string, object>();
	private readonly tableFilterParams = new Map<string, object>();
	private readonly firstKanbanStageIds = new Map<string, string>();
	// entityType -> Map<parentEntityType, Set<parentEntityId>>
	private readonly relatedEntityWatchers = new Map<string, Map<string, Set<string>>>();
	// entityType -> Set<entityId> — pending items in ConnectedEntitiesTable
	private readonly activePendingRelatedIds = new Map<string, Set<string>>();
	// "entityType-entityId" -> listeners — timeline subscribers per parent entity
	private readonly timelineSubscribers = new Map<string, Set<CardEventListener>>();
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

	setKanbanFilterParams(entityCode: string, params: object): void {
		this.kanbanFilterParams.set(entityCode, params);
	}

	getKanbanFilterParams(entityCode: string): Record<string, unknown> | undefined {
		return this.kanbanFilterParams.get(entityCode) as Record<string, unknown> | undefined;
	}

	setTableFilterParams(entityCode: string, params: object | null): void {
		if (params === null) {
			this.tableFilterParams.delete(entityCode);
		} else {
			this.tableFilterParams.set(entityCode, params);
		}
	}

	getTableFilterParams(entityCode: string): Record<string, unknown> | undefined {
		return this.tableFilterParams.get(entityCode) as Record<string, unknown> | undefined;
	}

	hasTableSubscriber(entityCode: string): boolean {
		return this.tableFilterParams.has(entityCode);
	}

	registerRelatedEntityInterest(entityType: string, parentEntityType: string, parentEntityId: string): () => void {
		const byParent = this.relatedEntityWatchers.get(entityType) ?? new Map<string, Set<string>>();
		const ids = byParent.get(parentEntityType) ?? new Set<string>();
		ids.add(parentEntityId);
		byParent.set(parentEntityType, ids);
		this.relatedEntityWatchers.set(entityType, byParent);

		return () => {
			const currentByParent = this.relatedEntityWatchers.get(entityType);
			if (!currentByParent) return;
			const currentIds = currentByParent.get(parentEntityType);
			if (!currentIds) return;
			currentIds.delete(parentEntityId);
			if (currentIds.size === 0) currentByParent.delete(parentEntityType);
			if (currentByParent.size === 0) this.relatedEntityWatchers.delete(entityType);
		};
	}

	isRelatedEntityCreateRelevant(entityType: string, payload: Record<string, any>): boolean {
		const byParent = this.relatedEntityWatchers.get(entityType);
		if (!byParent || byParent.size === 0) return false;
		return Array.from(byParent.entries()).some(([parentType, ids]) => {
			const refValue = payload?.[parentType];
			if (!refValue) return false;
			if (Array.isArray(refValue)) return refValue.some((ref) => ids.has(String(ref?.id ?? ref)));
			if (typeof refValue === 'object') return ids.has(String((refValue as any).id));
			return ids.has(String(refValue));
		});
	}

	setActivePendingRelatedIds(entityType: string, ids: string[]): void {
		if (ids.length === 0) {
			this.activePendingRelatedIds.delete(entityType);
		} else {
			this.activePendingRelatedIds.set(entityType, new Set(ids));
		}
	}

	hasActivePendingRelatedEntity(entityType: string, entityId: string): boolean {
		return this.activePendingRelatedIds.get(entityType)?.has(entityId) ?? false;
	}

	subscribeToEntityTimeline(entityType: string, entityId: string, listener: CardEventListener): () => void {
		const key = this.buildEntityKey(entityType, entityId);
		const listeners = this.timelineSubscribers.get(key) ?? new Set<CardEventListener>();
		listeners.add(listener);
		this.timelineSubscribers.set(key, listeners);

		return () => {
			const current = this.timelineSubscribers.get(key);
			if (!current) return;
			current.delete(listener);
			if (current.size === 0) this.timelineSubscribers.delete(key);
		};
	}

	emitToEntityTimeline(entityType: string, entityId: string, event: CardEvent): void {
		const listeners = this.timelineSubscribers.get(this.buildEntityKey(entityType, entityId));
		if (!listeners?.size) return;
		Array.from(listeners).forEach((listener) => {
			try {
				listener(event);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('emitToEntityTimeline listener error', error);
			}
		});
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

	hasTimelineSubscriberInCrmEntities(...entitiesObjects: Array<Record<string, unknown>>): boolean {
		for (const entities of entitiesObjects) {
			for (const [tableName, items] of Object.entries(entities)) {
				if (!Array.isArray(items)) continue;
				for (const { id } of items as Array<{ id: number | string }>) {
					if (!id) continue;
					if ((this.timelineSubscribers.get(this.buildEntityKey(tableName, String(id)))?.size ?? 0) > 0) return true;
				}
			}
		}
		return false;
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
		this.kanbanFilterParams.clear();
		this.tableFilterParams.clear();
		this.relatedEntityWatchers.clear();
		this.activePendingRelatedIds.clear();
		this.timelineSubscribers.clear();
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
		timelineSubscribers: Record<string, number>;
	} {
		return {
			registeredEntities: Array.from(this.registeredEntities),
			entitySubscribers: Object.fromEntries(Array.from(this.listenersByEntityKey.entries()).map(([key, listeners]) => [key, listeners.size])),
			typeSubscribers: Object.fromEntries(Array.from(this.listenersByType.entries()).map(([type, listeners]) => [type, listeners.size])),
			kanbanStages: Object.fromEntries(Array.from(this.kanbanStages.entries()).map(([entityCode, stages]) => [entityCode, Array.from(stages)])),
			timelineSubscribers: Object.fromEntries(Array.from(this.timelineSubscribers.entries()).map(([key, listeners]) => [key, listeners.size])),
		};
	}
}

export const cardsByEvents = new CardsByEvents();
export default cardsByEvents;

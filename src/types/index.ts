/**
 * Item interface
 *
 * This describes the item.
 *
 * IT doesn't stores quantity or dynamic properties.
 */
export interface IItem {
	/**
	 * Get item id
	 */
	getId(): number;
}

/**
 * Slot item
 *
 * An slot with an item in the inventory.
 */
export interface ISlotItem {
	index: number;
	quantity: number;

	/**
	 * Get index
	 */
	getIndex(): number;

	/**
	 * Extract
	 *
	 * Remove a given quantity of items from the slot.
	 * If it's greater than the quantity, convert the slot to undefined.
	 */
	extract(q: number): void;

	/**
	 * Add a given quantity of the item
	 *
	 * Returns 0 if all items were added.
	 * Returns > 0 if there were remaining items.
	 */
	add(q: number): number;
}

/**
 * Game inventory
 */
export interface IInventory<T> {
	slots: Array<T | undefined>;

	/**
	 * Get inventory size
	 */
	size(): number;

	/**
	 * Get item at a given position
	 */
	getItem(index: number): T | undefined;

	/**
	 * Get items
	 *
	 * Filters out all empty slots
	 */
	getItems(): Array<T>;

	/**
	 * Map
	 *
	 * For every element of the inventory run the given function.
	 * Ignores empty slots.
	 */
	map<U>(fn: (item: T, index: number) => U): Array<U>;

	/**
	 * Filter
	 *
	 * Discards undefined items.
	 * Ignores empty slots.
	 */
	filter(fn: (item: T, index: number) => boolean): Array<T>;
}

export type Slot = (IItem & ISlotItem) | undefined;

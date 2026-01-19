/**
 * Item interface
 *
 * This describes the item.
 *
 * IT doesn't stores quantity or dynamic properties.
 */
export interface IItem {
	id: number;
	name: string;
	description: string;
	// How many of that item can be stored
	stackSize: number;

	/**
	 * Get item id
	 */
	getId(): number;

	/**
	 * Stack size
	 */
	getStackSize(): number;
}

/**
 * Slot item
 *
 * An slot with an item in the inventory.
 */
export interface ISlot<T extends IItem> {
	index: number;
	quantity: number;
	item: T | null;

	/**
	 * Get index position in an array
	 *
	 * Because an slot item is usually in an array
	 */
	getIndex(): number;

	/**
	 * Check if the slot has an item
	 */
	hasItem(): boolean;

	/**
	 * Check if the slot quantity is at the maximum item capacity
	 */
	isFilled(): boolean;

	/**
	 * Extract
	 *
	 * Extract a given quantity of items from the slot.
	 * Returns the item and the extracted quantity.
	 *
	 * If it's greater than or equal to the quantity, convert the slot to undefined and return
	 * the item and 0 as quantity.
	 */
	extract(q: number): ItemQuantity<T> | null;

	/**
	 * Add a given quantity of the item
	 *
	 * IF the slot is empty returns the given quantity.
	 * Returns 0 if all items were added.
	 * Returns > 0 if there were remaining items.
	 */
	add(q: number): number;
}

/**
 * Item quantity
 */
export interface ItemQuantity<T extends IItem> {
	item: T;
	quantity: number;
}

/**
 * Game inventory
 */
export interface IInventory<T extends ISlot<U>, U extends IItem> {
	slots: Array<T>;

	/**
	 * Get inventory size
	 */
	size(): number;

	/**
	 * Add slot
	 */
	addSlot(object: U | null): void;

	/**
	 * Resize the inventory
	 *
	 * New size is the new absolute size of the inventory
	 *
	 * Returns a list of slots with the remaining elements
	 */
	resize(newSize: number): Array<T | null>;

	/**
	 * Get item at a given position
	 */
	getItem(index: number): T | null;

	/**
	 * Take item
	 *
	 * Take item at a given slot index, different than getItem, this removes items from the slot
	 *
	 * Returns the item with the remaining quantity, if there were no items returns undefined.
	 */
	takeItem(index: number, quantity: number): ItemQuantity<U> | null;

	// /**
	//  * Add item
	//  *
	//  * Add item at the first empty slot or add them to an existing one.
	//  * If the existing one is filled, add them to the next empty slot.
	//  * If the inventory is full returns the quantity of items that couldn't be stored.
	//  */
	// addItem(item: T, quantity: number): ItemQuantity | undefined;

	// /**
	//  * Set item
	//  *
	//  * Set item at an index position
	//  */
	// setItem(item: T, quantity: number): ItemQuantity | undefined;

	/**
	 * Get items
	 *
	 * Filters out all empty slots
	 */
	getItems(): Array<T>;

	/**
	 * Map all slots of the inventory
	 */
	map<U>(fn: (slot: T, index: number) => U): Array<U>;

	/**
	 * Filter slots of the inventory
	 */
	filter(fn: (slot: T, index: number) => boolean): Array<T>;
}

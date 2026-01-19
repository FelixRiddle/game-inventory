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
export interface ISlot {
	index: number;
	quantity: number;
	item: IItem;

	/**
	 * Create ISlot
	 */
	create(index: number, quantity: number, item: IItem): ISlot;

	/**
	 * Get index position in an array
	 *
	 * Because an slot item is usually in an array
	 */
	getIndex(): number;

	/**
	 * Extract
	 *
	 * Remove a given quantity of items from the slot.
	 * Returns the remaining items quantity if there are.
	 *
	 * If it's greater than the quantity, convert the slot to undefined and return 0.
	 */
	extract(q: number): number;

	/**
	 * Add a given quantity of the item
	 *
	 * Returns 0 if all items were added.
	 * Returns > 0 if there were remaining items.
	 */
	add(q: number): number;
}

/**
 * Item quantity
 */
export interface ItemQuantity {
	item: IItem;
	quantity: number;
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
	 * Add slot
	 */
	addSlot(object: T | undefined): void;

	/**
	 * Resize the inventory
	 *
	 * New size is the new absolute size of the inventory
	 *
	 * Returns a list of slots with the remaining elements
	 */
	resize(newSize: number): Array<T | undefined>;

	/**
	 * Get item at a given position
	 */
	getItem(index: number): T | undefined;

	/**
	 * Take item
	 *
	 * Take item at a given slot index, different than getItem, this removes items from the slot
	 *
	 * Returns the item with the taken quantity, if there were no items returns undefined.
	 */
	takeItem(index: number, quantity: number): ItemQuantity | undefined;

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

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
	// This is the limit, like minecraft's common 64 stacks
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
	 * Set item
	 *
	 * If the item is different, don't do anything
	 * Returns the remaining quantity
	 */
	setItem(item: T, quantity: number): number;

	/**
	 * Swap item
	 */
	swapItem(item: T, quantity: number): ItemQuantity<T> | null;

	/**
	 * Swap or store
	 *
	 * Better than swap or set item as it either adds or swaps the item,
	 * make sure your cursor has a "temporal store".
	 *
	 * Pretty much like minecraft's inventory behavior when the user holds an item
	 * in the cursor and then clicks on a slot that has either the same item, another
	 * item(then swaps) or an empty slot.
	 */
	swapOrStore(item: T, quantity: number): ItemQuantity<T> | null;

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
 *
 * "event" field
 * What event happened?
 * "set": The item was set on an empty slot.
 * "swapped": The item was swapped with the item on the slot.
 * "merged": The item was merged with the item on the slot.
 * "rejected": Rejected could happen when swapping an item and the target slot has the same item with full quantity.
 * Or a "locked" slot(a slot that cannot change the item type).
 */
export interface ItemQuantity<T extends IItem> {
	item: T;
	quantity: number;
	// event: "set" | "swapped" | "merged" | "rejected";
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

	/**
	 * Add item
	 *
	 * Add item at the first empty slot or add them to an existing one.
	 * If the existing one is filled, add them to the next empty slot.
	 * If the inventory is full returns the quantity of items that couldn't be stored.
	 */
	addItem(item: U, quantity: number): ItemQuantity<U> | undefined;

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

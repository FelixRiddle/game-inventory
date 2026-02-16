import { IItem, ISlot } from "./types";

/**
 * Slot
 */
export default class Slot<T extends IItem> implements ISlot<T> {
	index: number;
	quantity: number;
	item: T | null;

	/**
	 * Create the ISlot
	 */
	constructor(index: number, quantity: number, item: T | null) {
		this.index = index;
		this.quantity = quantity;
		this.item = item;
	}

	/**
	 * Create ISlot
	 */
	static create<U extends IItem>(
		index: number,
		quantity: number,
		item: U | null
	): Slot<U> {
		return new Slot(index, quantity, item);
	}

	/**
	 * Get stored and remaining items
	 *
	 * @param currentQuantity The current quantity of the item
	 * @param addQuantity Quantity to add to the item
	 */
	getStoredItems(
		item: T,
		currentQuantity: number,
		addQuantity: number
	): { stored: number; remaining: number } {
		const stackSize = item.getStackSize();
		const freeSpace = stackSize - currentQuantity;

		// Use math.min to see how much we can actually take
		const amountToTake = Math.min(addQuantity, freeSpace);

		return {
			stored: currentQuantity + amountToTake,
			remaining: addQuantity - amountToTake,
		};
	}

	/**
	 * Set item
	 *
	 * If the item is different, don't do anything
	 * Returns the remaining quantity
	 */
	setItem(item: T, quantity: number): number {
		// If the slot is empty we will set the given item
		if (!this.item) {
			this.item = item;
			this.quantity = 0;
		}

		// If the item types are different then we can't set the item
		if (this.item.getId() !== item.getId()) {
			return quantity;
		}

		// Use the logic to calculate storage
		const { stored, remaining } = this.getStoredItems(
			item,
			this.quantity,
			quantity
		);

		this.quantity = stored;
		return remaining;
	}

	/**
	 * Get index position in an array
	 *
	 * Because an slot item is usually in an array
	 */
	getIndex(): number {
		return this.index;
	}

	/**
	 * Check if the slot has an item
	 */
	hasItem(): boolean {
		return !!this.item;
	}

	/**
	 * Check if the slot quantity is at the maximum item capacity
	 *
	 * If there's no item, returns false
	 */
	isFilled(): boolean {
		if (!this.item) {
			return false;
		}

		return this.item.getStackSize() === this.quantity;
	}

	/**
	 * Extract
	 *
	 * Extract a given quantity of items from the slot.
	 * Returns the remaining items quantity if there are.
	 *
	 * If it's greater than the quantity, convert the slot to undefined and return
	 * the item and 0 as quantity.
	 */
	extract(q: number) {
		if (!this.item) {
			return null;
		}

		if (q >= this.quantity) {
			// The quantity to extract is greater than the current quantity
			const item = this.item;
			const quantity = this.quantity;

			this.item = null;
			this.quantity = 0;
			return {
				item,
				quantity,
			};
		} else {
			// Q is less than quantity
			// Subtract the quantity
			this.quantity -= q;

			return {
				item: this.item,
				quantity: q,
			};
		}
	}

	/**
	 * Add a given quantity of the item
	 *
	 * IF the slot is empty returns the given quantity.
	 * Returns 0 if all items were added.
	 * Returns > 0 if there were remaining items.
	 */
	add(q: number): number {
		// If the slot is empty return the given quantity.
		if (!this.item) {
			return q;
		}

		// Check if it's filled
		if (this.isFilled()) {
			return q;
		}

		// Get how many items are going to be stored and how many will remain
		const { stored, remaining } = this.getStoredItems(
			this.item,
			this.quantity,
			q
		);

		this.quantity = stored;
		return remaining;
	}
}

import { IItem, ISlot, ItemQuantity } from "./types";

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

		// Get stack size
		const stackSize = this.item.getStackSize();
		// Calculate free space
		const freeSpace = stackSize - this.quantity;

		if (q < freeSpace) {
			// Add all up and return 0
			this.quantity += q;
			return 0;
		} else if (q > freeSpace) {
			// Add free space
			this.quantity += freeSpace;

			// Subract from the total
			return q - freeSpace;
		} else {
			// Q is equal to free space
			this.quantity += freeSpace;

			return 0;
		}
	}
}

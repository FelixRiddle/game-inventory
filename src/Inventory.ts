import { IInventory, IItem, Slot } from "./types";

/**
 * Game inventory
 */
export default class Inventory<T = Slot> implements IInventory<T> {
	slots: Array<T | undefined> = [];

	/**
	 * Create the inventory object
	 */
	constructor(inventorySize: number) {
		// Create the inventory without items
		for (let i = 0; i < inventorySize; i++) {
			this.slots.push(undefined);
		}
	}

	/**
	 * Get inventory size
	 */
	size() {
		return this.slots.length;
	}

	/**
	 * Get items
	 */
	getItems(): Array<T> {
		return this.slots.filter((item) => typeof item !== "undefined");
	}

	/**
	 * Get item at a given position
	 */
	getItem(index: number): T | undefined {
		return this.slots[index];
	}

	/**
	 * Map
	 *
	 * For every element of the inventory run the given function
	 */
	map<U>(fn: (item: T, index: number) => U) {
		let result = [];

		for (let i = 0; i < this.slots.length; i++) {
			// Get slot
			const slot = this.slots[i];
			if (slot) {
				// Run the function and store the result
				result.push(fn(slot, i));
			}
		}

		return result;
	}

	/**
	 * Filter
	 */
	filter(fn: (item: T, index: number) => boolean) {
		let result = [];

		for (let i = 0; i < this.slots.length; i++) {
			// Get slot
			const slot = this.slots[i];
			if (slot) {
				// Evaluate
				const evalResult = fn(slot, i);
				if (evalResult) {
					result.push(slot);
				}
			}
		}

		return result;
	}
}

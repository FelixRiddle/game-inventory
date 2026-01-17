import { Item, Slot } from "./types";

/**
 * Game inventory
 */
export default class Inventory<T = Slot> {
	private slots: Array<Slot> = [];

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
}

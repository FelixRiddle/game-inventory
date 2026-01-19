import { IInventory, ISlot } from "./types";

/**
 * Game inventory
 */
export default class Inventory<T extends ISlot> implements IInventory<T> {
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

	size() {
		return this.slots.length;
	}

	addSlot(object: T | undefined) {
		this.slots.push(object);
	}

	resize(newSize: number) {
		let remainingSlots: Array<T | undefined> = [];
		if (newSize < this.size()) {
			// The new size is smaller than the current size
			// We have to drop remaining items
			remainingSlots = this.slots.slice(newSize);

			// Update slots to have the new size
			this.slots = this.slots.slice(0, newSize);
		} else if (newSize > this.size()) {
			// The new size is greater than the current size
			// Add the remaining slots
			for (let i = 0; i < newSize; i++) {
				this.addSlot(undefined);
			}
		}

		return remainingSlots;
	}

	getItems(): Array<T> {
		return this.slots.filter((item) => typeof item !== "undefined");
	}

	getItem(index: number): T | undefined {
		return this.slots[index];
	}

	takeItem(index: number, quantity: number) {
		// Get slot
		const slot = this.slots[index];
		if (typeof slot !== "undefined") {
			// Remove the quantity of the item
			const remaining = slot.extract(quantity);

			return {
				item: slot.item,
				quantity: remaining,
			};
		}
	}

	addItem() {}

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

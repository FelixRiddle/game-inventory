import Slot from "./Slot";
import { IInventory, IItem, ISlot, ItemQuantity } from "./types";

/**
 * Game inventory
 */
export default class Inventory<U extends IItem>
	implements IInventory<ISlot<U>, U>
{
	slots: Array<ISlot<U>> = [];

	/**
	 * Create the inventory object
	 */
	constructor(inventorySize: number) {
		// Create the inventory without items
		for (let i = 0; i < inventorySize; i++) {
			this.slots.push();
		}
	}

	size() {
		return this.slots.length;
	}

	addSlot(object: U | null) {
		if (object) {
			// The index is the same as the length
			const index = this.slots.length;
			const quantity = 0;
			const slot = new Slot(index, quantity, object);

			this.slots.push(slot);
		} else {
		}
	}

	resize(newSize: number) {
		let remainingSlots: Array<ISlot<U> | null> = [];
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
				this.addSlot(null);
			}
		}

		return remainingSlots;
	}

	getItems(): Array<ISlot<U>> {
		return this.slots.filter((item) => typeof item !== "undefined");
	}

	getItem(index: number): ISlot<U> | null {
		return this.slots[index];
	}

	takeItem(index: number, quantity: number): ItemQuantity<U> | null {
		// Get slot
		const slot = this.slots[index];
		if (slot.item) {
			// Remove the quantity of the item
			const remaining = slot.extract(quantity);

			return remaining;
		}

		return null;
	}

	// /**
	//  * Add item
	//  *
	//  * Add item at the first empty slot or add them to an existing one.
	//  * If the existing one is filled, add them to the next empty slot.
	//  * If the inventory is full returns the quantity of items that couldn't be stored.
	//  */
	// addItem(item: T, quantity: number): ItemQuantity | undefined {

	// }

	map<V>(fn: (slot: ISlot<U>, index: number) => V) {
		let result = [];

		for (let i = 0; i < this.slots.length; i++) {
			// Get slot
			const slot = this.slots[i];

			// Run the function and store the result
			result.push(fn(slot, i));
		}

		return result;
	}

	filter(fn: (item: ISlot<U>, index: number) => boolean) {
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

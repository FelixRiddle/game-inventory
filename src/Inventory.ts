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

	/**
	 * Add item
	 *
	 * 1. Find slots that have the item
	 * 2. Fill slots that have the item until all items are drained
	 * 3. Fill empty slots until all items are drained
	 * 4. If there's still some remaining return them along with the item
	 */
	addItem(item: U, quantity: number): ItemQuantity<U> | undefined {
		// 1. Find the slots that have the same item
		const slots = this.getSlotsWithItem(item);

		// 2. Try to fill the slots with those items
		let remaining = quantity;
		for (const slot of slots) {
			remaining = slot.add(remaining);

			// Check if the remaining items are zero
			if (remaining === 0) {
				// Good, we drained all the items
				return;
			}
		}

		// 3. Fill empty slots until all items are drained
		const emptySlots = this.getEmptySlots();
		for (const emptySlot of emptySlots) {
			// Swap logic is not allowed here
			remaining = emptySlot.setItem(item, remaining);

			if (remaining === 0) {
				return;
			}
		}

		return {
			item,
			quantity: remaining,
		};
	}

	/**
	 * Get empty slots
	 */
	getEmptySlots() {
		return this.filter((slot) => {
			return !slot.hasItem();
		});
	}

	/**
	 * Get slots that have a given item
	 */
	getSlotsWithItem(item: U) {
		const slots = this.filter((slot) => {
			if (slot.item?.getId() === item.getId()) {
				return true;
			}
			return false;
		});

		return slots;
	}

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

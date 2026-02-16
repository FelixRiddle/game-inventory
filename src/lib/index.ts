import { IItem } from "@/types";

/**
 * Get stored and remaining items
 *
 * @param currentQuantity The current quantity of the item
 * @param addQuantity Quantity to add to the item
 */
export function getStoredItems<T extends IItem>(
	item: T,
	currentQuantity: number,
	addQuantity: number
): { stored: number; remaining: number } {
	// Get stack size
	const stackSize = item.getStackSize();
	// Calculate free space
	const freeSpace = stackSize - currentQuantity;
	if (addQuantity < freeSpace) {
		// Add all up and return 0
		const stored = currentQuantity + addQuantity;
		return {
			stored,
			remaining: 0,
		};
	} else if (addQuantity > freeSpace) {
		// Add the remaining space as we have filled the slot
		const stored = currentQuantity + freeSpace;

		// Subract from the total
		return {
			stored,
			remaining: addQuantity - freeSpace,
		};
	} else {
		// Q is equal to free space
		const stored = currentQuantity + freeSpace;
		return { stored, remaining: 0 };
	}
}

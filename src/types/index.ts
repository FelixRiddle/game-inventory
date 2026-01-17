/**
 * Item interface
 */
export interface Item {
	/**
	 * Get item id
	 */
	getId(): number;
}

export type Slot = Item | undefined;

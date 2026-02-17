import Inventory from "./Inventory";
import { IItem } from "./types";

describe("Inventory Class", () => {
	// Helper to create mock items
	const createMockItem = (id: number, stackSize: number = 64): IItem =>
		({
			getId: () => id,
			getStackSize: () => stackSize,
			name: `Item ${id}`,
			description: "Test Item",
			stackSize,
		} as IItem);

	describe("Initialization", () => {
		it("should initialize with the correct number of slots", () => {
			const inv = new Inventory(10);
			expect(inv.size()).toBe(10);
			expect(inv.getItem(0)).toBeDefined();
			expect(inv.getItem(9)).toBeDefined();
		});
	});

	describe("addItem()", () => {
		it("should add item to the first empty slot", () => {
			const inv = new Inventory(5);
			const item = createMockItem(1, 64);

			const remainder = inv.addItem(item, 10);

			expect(remainder).toBeUndefined();
			expect(inv.getItem(0)?.quantity).toBe(10);
			expect(inv.getItem(0)?.item?.getId()).toBe(1);
		});

		it("should merge items into existing stacks before using new slots", () => {
			const inv = new Inventory(5);
			const item = createMockItem(1, 64);

			inv.addItem(item, 20); // Slot 0: 20
			inv.addItem(item, 10); // Should merge into Slot 0

			expect(inv.getItem(0)?.quantity).toBe(30);
			expect(inv.getEmptySlots().length).toBe(4);
		});

		it("should overflow into a second slot if the first is full", () => {
			const inv = new Inventory(5);
			const item = createMockItem(1, 64);

			inv.addItem(item, 60); // Slot 0: 60
			inv.addItem(item, 10); // 4 go to Slot 0, 6 go to Slot 1

			expect(inv.getItem(0)?.quantity).toBe(64);
			expect(inv.getItem(1)?.quantity).toBe(6);
		});

		it("should return a remainder if the inventory is completely full", () => {
			const inv = new Inventory(1);
			const item = createMockItem(1, 10);

			const result = inv.addItem(item, 15);

			expect(result?.quantity).toBe(5);
			expect(inv.getItem(0)?.quantity).toBe(10);
		});
	});

	describe("resize()", () => {
		it("should increase size and add new empty slots", () => {
			const inv = new Inventory(2);
			inv.resize(5);

			expect(inv.size()).toBe(5);
			expect(inv.getItem(4)).toBeDefined();
			expect(inv.getItem(4)?.hasItem()).toBe(false);
		});

		it("should decrease size and return removed slots as overflow", () => {
			const inv = new Inventory(5);
			const item = createMockItem(1, 10);
			inv.addItem(item, 10); // Added to Slot 0

			// Move an item to the end manually for testing
			const lastItem = createMockItem(2, 10);
			inv.getItem(4)?.setItem(lastItem, 5);

			const removed = inv.resize(2);

			expect(inv.size()).toBe(2);
			expect(removed.length).toBe(3);
			expect(removed[2]?.item?.getId()).toBe(2); // The item from index 4
		});
	});

	describe("takeItem()", () => {
		it("should extract items from a specific slot", () => {
			const inv = new Inventory(5);
			const item = createMockItem(1, 64);
			inv.addItem(item, 50);

			const taken = inv.takeItem(0, 20);

			expect(taken?.quantity).toBe(20);
			expect(inv.getItem(0)?.quantity).toBe(30);
		});

		it("should return null if taking from an empty slot", () => {
			const inv = new Inventory(5);
			expect(inv.takeItem(0, 10)).toBeNull();
		});
	});

	describe("Filtering and Mapping", () => {
		it("getItems() should only return slots with items", () => {
			const inv = new Inventory(5);
			inv.addItem(createMockItem(1), 10);
			inv.addItem(createMockItem(2), 10);

			const activeItems = inv.getItems();
			expect(activeItems.length).toBe(2);
		});
	});
});

import Slot from "./Slot";
import { IItem } from "./types";

describe("Slot class", () => {
	// Helper to create a mock item
	const createMockItem = (id: number, stackSize: number = 64): IItem =>
		({
			id, // Property
			stackSize, // Property
			getId: jest.fn().mockReturnValue(id), // Method
			getStackSize: jest.fn().mockReturnValue(stackSize), // Method
			name: `Item ${id}`,
			description: "Test Item",
		} as unknown as IItem);

	describe("Initialization & Basics", () => {
		it("should initialize with correct values", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 10, item);

			expect(slot.getIndex()).toBe(0);
			expect(slot.quantity).toBe(10);
			expect(slot.item).toBe(item);
		});

		it("should create an instance via static create method", () => {
			const slot = Slot.create(5, 1, null);
			expect(slot).toBeInstanceOf(Slot);
			expect(slot.getIndex()).toBe(5);
			expect(slot.hasItem()).toBe(false);
		});

		it("should return true for hasItem when item is present", () => {
			const slot = new Slot(0, 1, createMockItem(10));
			expect(slot.hasItem()).toBe(true);
		});
	});

	describe("isFilled()", () => {
		it("should return false if slot is empty", () => {
			const slot = new Slot(0, 0, null);
			expect(slot.isFilled()).toBe(false);
		});

		it("should return true if quantity equals max stack size", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 64, item);
			expect(slot.isFilled()).toBe(true);
		});

		it("should return false if quantity is less than stack size", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 32, item);
			expect(slot.isFilled()).toBe(false);
		});
	});

	describe("extract()", () => {
		it("should return null if extracting from an empty slot", () => {
			const slot = new Slot(0, 0, null);
			expect(slot.extract(5)).toBeNull();
		});

		it("should extract partial quantity and update slot", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 20, item);
			const result = slot.extract(5);

			expect(result).toEqual({ item, quantity: 5 });
			expect(slot.quantity).toBe(15);
			expect(slot.item).not.toBeNull();
		});

		it("should clear the slot if requested quantity is >= current quantity", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 10, item);
			const result = slot.extract(10);

			expect(result).toEqual({ item, quantity: 10 });
			expect(slot.quantity).toBe(0);
			expect(slot.item).toBeNull();
		});
	});

	describe("add()", () => {
		it("should return the full quantity if the slot has no item", () => {
			const slot = new Slot(0, 0, null);
			const result = slot.add(10);
			expect(result).toBe(10);
			expect(slot.quantity).toBe(0);
		});

		it("should return the full quantity if the slot is already filled", () => {
			const item = createMockItem(1, 10);
			const slot = new Slot(0, 10, item); // Maxed out
			const result = slot.add(5);
			expect(result).toBe(5);
			expect(slot.quantity).toBe(10);
		});

		it("should add items if there is enough space and return 0", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 50, item);
			const result = slot.add(10);

			expect(result).toBe(0);
			expect(slot.quantity).toBe(60);
		});

		it("should fill the slot and return the remainder if adding more than free space", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 60, item);
			const result = slot.add(10); // only 4 spaces left

			expect(result).toBe(6);
			expect(slot.quantity).toBe(64);
		});

		it("should return 0 when adding exactly the remaining free space", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 60, item);
			const result = slot.add(4);

			expect(result).toBe(0);
			expect(slot.quantity).toBe(64);
		});
	});

	describe("setItem()", () => {
		it("should set item and quantity in an empty slot", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 0, null);
			const remainder = slot.setItem(item, 10);

			expect(slot.item).toBe(item);
			expect(slot.quantity).toBe(10);
			expect(remainder).toBe(0);
		});

		it("should reject and return full quantity if IDs don't match", () => {
			const itemA = { ...createMockItem(1, 64), getId: () => 1 } as IItem;
			const itemB = { ...createMockItem(2, 64), getId: () => 2 } as IItem;
			const slot = new Slot(0, 10, itemA);

			const remainder = slot.setItem(itemB, 5);
			expect(remainder).toBe(5);
			expect(slot.item).toBe(itemA);
			expect(slot.quantity).toBe(10);
		});

		it("should handle overflow when setting same item", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 60, item);
			const remainder = slot.setItem(item, 10);

			expect(slot.quantity).toBe(64);
			expect(remainder).toBe(6);
		});
	});

	describe("swapItem()", () => {
		it("should swap contents and return previous item", () => {
			const itemA = createMockItem(1, 64);
			const itemB = createMockItem(2, 64);
			const slot = new Slot(0, 10, itemA);

			const result = slot.swapItem(itemB, 5);

			expect(slot.item).toBe(itemB);
			expect(slot.quantity).toBe(5);
			expect(result).toEqual({ item: itemA, quantity: 10 });
		});

		it("should return null if swapping into an empty slot", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 0, null);
			const result = slot.swapItem(item, 10);

			expect(result).toBeNull();
		});

		it("should reject swap if quantity exceeds stack size", () => {
			const item = createMockItem(1, 10);
			const slot = new Slot(0, 0, null);
			const result = slot.swapItem(item, 50);

			expect(result).toEqual({ item, quantity: 50 });
			expect(slot.item).toBeNull();
		});
	});

	describe("swapOrStore()", () => {
		it("should store item if slot is empty", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 0, null);
			const result = slot.swapOrStore(item, 20);

			expect(slot.item).toBe(item);
			expect(slot.quantity).toBe(20);
			expect(result).toBeNull();
		});

		it("should merge if items are the same", () => {
			const item = createMockItem(1, 64);
			const slot = new Slot(0, 10, item);
			const result = slot.swapOrStore(item, 10);

			expect(slot.quantity).toBe(20);
			expect(result).toEqual({ item, quantity: 0 });
		});

		it("should swap if items are different", () => {
			const itemA = { ...createMockItem(1, 64), getId: () => 1 } as IItem;
			const itemB = { ...createMockItem(2, 64), getId: () => 2 } as IItem;
			const slot = new Slot(0, 10, itemA);

			const result = slot.swapOrStore(itemB, 5);

			expect(slot.item).toBe(itemB);
			expect(slot.quantity).toBe(5);
			expect(result).toEqual({ item: itemA, quantity: 10 });
		});
	});
});

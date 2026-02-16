import Slot from "./Slot";
import { IItem } from "./types";

describe("Slot class", () => {
	// Helper to create a mock item
	const createMockItem = (stackSize: number): IItem =>
		({
			getStackSize: jest.fn().mockReturnValue(stackSize),
			// Add other IItem properties if necessary
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
			const item = createMockItem(10);
			const slot = new Slot(0, 10, item); // Maxed out
			const result = slot.add(5);
			expect(result).toBe(5);
			expect(slot.quantity).toBe(10);
		});

		it("should add items if there is enough space and return 0", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 50, item);
			const result = slot.add(10);

			expect(result).toBe(0);
			expect(slot.quantity).toBe(60);
		});

		it("should fill the slot and return the remainder if adding more than free space", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 60, item);
			const result = slot.add(10); // only 4 spaces left

			expect(result).toBe(6);
			expect(slot.quantity).toBe(64);
		});

		it("should return 0 when adding exactly the remaining free space", () => {
			const item = createMockItem(64);
			const slot = new Slot(0, 60, item);
			const result = slot.add(4);

			expect(result).toBe(0);
			expect(slot.quantity).toBe(64);
		});
	});
});

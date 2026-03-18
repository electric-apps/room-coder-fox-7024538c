import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("todos collection insert validation", () => {
	it("validates a complete todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("validates an insert row with all required fields", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects insert with missing title", () => {
		const row = generateValidRow(todoInsertSchema)
		const withoutTitle = { ...row, title: undefined }
		const result = todoInsertSchema.safeParse(withoutTitle)
		expect(result.success).toBe(false)
	})

	it("JSON round-trip: parseDates correctly converts ISO strings back to Dates", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const parsed = parseDates(serialized)
		const result = todoSelectSchema.safeParse(parsed)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})

	it("validates completed field as boolean", () => {
		const row = generateValidRow(todoSelectSchema)
		const withCompleted = { ...row, completed: true }
		const result = todoSelectSchema.safeParse(withCompleted)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.completed).toBe(true)
		}
	})
})

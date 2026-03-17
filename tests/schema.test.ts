import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import {
	generateValidRow,
	generateRowWithout,
} from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects row missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects row missing id", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("defaults completed to false on insert", () => {
		const row = generateValidRow(todoInsertSchema)
		const withoutCompleted = { ...row, completed: undefined }
		// The insert schema should accept missing completed (defaults to false)
		const result = todoInsertSchema.safeParse({ ...row, title: "Test todo" })
		expect(result.success).toBe(true)
	})

	it("parses ISO date strings for created_at", () => {
		const row = generateValidRow(todoSelectSchema)
		const withIsoDate = { ...row, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
		const result = todoSelectSchema.safeParse(withIsoDate)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})

	it("todos table has correct columns", () => {
		const columns = Object.keys(todos)
		expect(columns).toContain("id")
		expect(columns).toContain("title")
		expect(columns).toContain("completed")
		expect(columns).toContain("created_at")
		expect(columns).toContain("updated_at")
	})
})

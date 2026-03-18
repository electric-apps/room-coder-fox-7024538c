import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { todoSelectSchema } from "@/db/zod-schemas";

async function apiRequest(method: string, path: string, body?: unknown) {
	const res = await fetch(path, {
		method,
		headers: body ? { "Content-Type": "application/json" } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json();
}

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (row) => row.id,
		shapeOptions: {
			url: new URL(
				"/api/todos",
				typeof window !== "undefined"
					? window.location.origin
					: "http://localhost:5173",
			).toString(),
			parser: {
				timestamptz: (date: string) => new Date(date),
			},
		},
		onInsert: async ({ transaction }) => {
			const { modified: newTodo } = transaction.mutations[0];
			const result = await apiRequest("POST", "/api/mutations/todos", {
				action: "insert",
				data: newTodo,
			});
			return { txid: result.txid };
		},
		onUpdate: async ({ transaction }) => {
			const { modified: updated } = transaction.mutations[0];
			const result = await apiRequest("POST", "/api/mutations/todos", {
				action: "update",
				data: updated,
			});
			return { txid: result.txid };
		},
		onDelete: async ({ transaction }) => {
			const { original: deleted } = transaction.mutations[0];
			const result = await apiRequest("POST", "/api/mutations/todos", {
				action: "delete",
				data: { id: deleted.id },
			});
			return { txid: result.txid };
		},
	}),
);

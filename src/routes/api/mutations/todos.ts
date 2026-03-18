import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

const serve = async ({ request }: { request: Request }) => {
	const body = parseDates(await request.json()) as {
		action: "insert" | "update" | "delete";
		data: Record<string, unknown>;
	};

	let txid = 0;

	if (body.action === "insert") {
		await db.transaction(async (tx) => {
			await tx.insert(todos).values({
				id: body.data.id as string,
				title: body.data.title as string,
				completed: (body.data.completed as boolean) ?? false,
				created_at: body.data.created_at as Date,
				updated_at: body.data.updated_at as Date,
			});
			txid = await generateTxId(tx);
		});
	} else if (body.action === "update") {
		await db.transaction(async (tx) => {
			await tx
				.update(todos)
				.set({
					title: body.data.title as string,
					completed: body.data.completed as boolean,
					updated_at: new Date(),
				})
				.where(eq(todos.id, body.data.id as string));
			txid = await generateTxId(tx);
		});
	} else if (body.action === "delete") {
		await db.transaction(async (tx) => {
			await tx.delete(todos).where(eq(todos.id, body.data.id as string));
			txid = await generateTxId(tx);
		});
	} else {
		return new Response(JSON.stringify({ error: "Invalid action" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ txid }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: serve,
		},
	},
});

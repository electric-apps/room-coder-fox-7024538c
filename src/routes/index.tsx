import {
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Separator,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

function TodoPage() {
	const [newTitle, setNewTitle] = useState("");
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

	const { data: todos, isLoading } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.orderBy(({ todo }) => todo.created_at, "desc"),
		[],
	);

	const activeTodos = todos?.filter((t) => !t.completed) ?? [];
	const completedTodos = todos?.filter((t) => t.completed) ?? [];

	const filteredTodos =
		filter === "all"
			? (todos ?? [])
			: filter === "active"
				? activeTodos
				: completedTodos;

	const handleAdd = () => {
		const title = newTitle.trim();
		if (!title) return;
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		setNewTitle("");
	};

	const handleToggle = (todo: Todo) => {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = (id: string) => {
		todosCollection.delete(id);
	};

	const handleClearCompleted = () => {
		for (const todo of completedTodos) {
			todosCollection.delete(todo.id);
		}
	};

	if (isLoading) {
		return (
			<Flex align="center" justify="center" py="9">
				<Spinner size="3" />
			</Flex>
		);
	}

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				{/* Header */}
				<Flex justify="between" align="center">
					<Flex direction="column" gap="1">
						<Heading size="7">Todo App</Heading>
						<Text size="2" color="gray">
							{activeTodos.length} task{activeTodos.length !== 1 ? "s" : ""}{" "}
							remaining
						</Text>
					</Flex>
					<Flex gap="2" align="center">
						<Badge variant="soft" color="violet">
							{todos?.length ?? 0} total
						</Badge>
						{completedTodos.length > 0 && (
							<Badge variant="soft" color="green">
								{completedTodos.length} done
							</Badge>
						)}
					</Flex>
				</Flex>

				{/* Add todo */}
				<Card>
					<Flex gap="2">
						<TextField.Root
							placeholder="What needs to be done?"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAdd()}
							style={{ flex: 1 }}
						/>
						<Button onClick={handleAdd} disabled={!newTitle.trim()}>
							<Plus size={16} />
							Add
						</Button>
					</Flex>
				</Card>

				{/* Filter tabs */}
				{(todos?.length ?? 0) > 0 && (
					<Flex gap="2">
						{(["all", "active", "completed"] as const).map((f) => (
							<Button
								key={f}
								variant={filter === f ? "solid" : "soft"}
								color={filter === f ? "violet" : "gray"}
								size="2"
								onClick={() => setFilter(f)}
							>
								{f.charAt(0).toUpperCase() + f.slice(1)}
							</Button>
						))}
					</Flex>
				)}

				{/* Todo list */}
				{filteredTodos.length === 0 ? (
					<Flex direction="column" align="center" gap="3" py="9">
						<CheckSquare size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							{filter === "completed"
								? "No completed tasks yet"
								: filter === "active"
									? "No active tasks — all done!"
									: "No tasks yet. Add one above!"}
						</Text>
					</Flex>
				) : (
					<Flex direction="column" gap="2">
						{filteredTodos.map((todo) => (
							<Card key={todo.id}>
								<Flex justify="between" align="center" gap="3">
									<Flex align="center" gap="3" style={{ flex: 1, minWidth: 0 }}>
										<Checkbox
											checked={todo.completed}
											onCheckedChange={() => handleToggle(todo)}
											size="2"
										/>
										<Text
											size="3"
											style={{
												textDecoration: todo.completed
													? "line-through"
													: "none",
												color: todo.completed
													? "var(--gray-9)"
													: "var(--gray-12)",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{todo.title}
										</Text>
									</Flex>
									<IconButton
										size="1"
										variant="ghost"
										color="red"
										onClick={() => handleDelete(todo.id)}
									>
										<Trash2 size={14} />
									</IconButton>
								</Flex>
							</Card>
						))}
					</Flex>
				)}

				{/* Footer actions */}
				{completedTodos.length > 0 && (
					<>
						<Separator size="4" />
						<Flex justify="end">
							<Button
								variant="soft"
								color="gray"
								size="2"
								onClick={handleClearCompleted}
							>
								<Trash2 size={14} />
								Clear completed ({completedTodos.length})
							</Button>
						</Flex>
					</>
				)}
			</Flex>
		</Container>
	);
}

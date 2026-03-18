import { createFileRoute } from "@tanstack/react-router";
import { proxyElectricRequest } from "@/lib/electric-proxy";

const serve = async ({ request }: { request: Request }) => {
	return proxyElectricRequest(request, "todos");
};

export const Route = createFileRoute("/api/todos")({
	server: {
		handlers: {
			GET: serve,
		},
	},
});

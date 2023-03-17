import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const baseUrl = new URL(process.env["API_BASE_URL"] || "http://localhost:4000");
const hostname = baseUrl.hostname;
const pathname = baseUrl.pathname;
const port = baseUrl.port;
const httpProtocol = baseUrl.protocol;
const wsProtocol = "wss:";

const webhooksApiUrl = `${httpProtocol}//${hostname}${
  port ? `:${port}` : ""
}${pathname}webhooks`;
const graphqlApiUrl = `${httpProtocol}//${hostname}${
  port ? `:${port}` : ""
}${pathname}graphql`;
const subscriptionsApiUrl = `${wsProtocol}//${hostname}${
  port ? `:${port}` : ""
}${pathname}subscriptions`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __WEBHOOKS_API_URL__: JSON.stringify(webhooksApiUrl),
    __GRAPHQL_API_URL__: JSON.stringify(graphqlApiUrl),
    __SUBSCRIPTIONS_API_URL__: JSON.stringify(subscriptionsApiUrl),
  },
});

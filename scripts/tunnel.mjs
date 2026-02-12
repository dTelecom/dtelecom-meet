import { spawn } from "child_process";

const port = process.env.PORT || "3000";

const child = spawn("cloudflared", ["tunnel", "--url", `http://localhost:${port}`], {
  stdio: ["ignore", "pipe", "pipe"],
});

child.stderr.on("data", (data) => {
  const line = data.toString();
  // cloudflared prints the URL to stderr
  const match = line.match(/https:\/\/[^\s]+\.trycloudflare\.com/);
  if (match) {
    console.log(`\n  Tunnel open → ${match[0]}`);
    console.log(`  Webhook URL → ${match[0]}/api/webhook\n`);
    console.log("  Set WEBHOOK_URL in .env.local to this URL and restart the dev server.\n");
  }
});

child.on("close", (code) => {
  console.log("Tunnel closed", code ? `(exit ${code})` : "");
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill());
process.on("SIGTERM", () => child.kill());

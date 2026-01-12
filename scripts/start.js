const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || "5000";
const env = { ...process.env, PORT: String(port) };

const standaloneServer = path.join(
  process.cwd(),
  ".next",
  "standalone",
  "server.js"
);

function run(cmd, args) {
  const child = spawn(cmd, args, { stdio: "inherit", env });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  child.on("error", () => {
    process.exit(1);
  });
}

if (fs.existsSync(standaloneServer)) {
  run(process.execPath, [standaloneServer]);
} else {
  const nextBin = path.join(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next"
  );
  run(process.execPath, [nextBin, "start", "-p", String(port)]);
}

const { readFile } = require("node:fs/promises");
let stage = "initialization";

module.exports = {
  onPreBuild() { stage = "application-build"; },
  onBuild() { stage = "adapter-and-bundling"; },
  onPostBuild() { stage = "post-build-validation"; },
  async onEnd({ error, utils }) {
    // Reports are public deploy metadata. Emit fixed labels only, never raw
    // errors, environment values, paths, or build output containing secrets.
    const message = String(error?.message || "");
    const categories = [
      ["secret-scan", /secret.{0,30}(scan|found|detect)/i],
      ["memory-limit", /out of memory|heap limit|SIGKILL/i],
      ["unsupported-module", /unsupported|cannot find module|could not resolve/i],
      ["edge-validation", /edge.{0,30}(valid|bundl|size)/i],
      ["function-size", /(function|bundle).{0,30}(large|limit|size)/i],
      ["build-command", /command failed|non.zero|exit code/i],
    ];
    const category = error ? categories.find(([, pattern]) => pattern.test(message))?.[0] || "unclassified" : "none";
    let detail = "";
    try {
      const report = JSON.parse(await readFile(".netlify/build-diagnostics.json", "utf8"));
      const allowed = new Set(["missing-test-dependency", "missing-dependency", "typescript", "invalid-url", "font-download", "database", "missing-auth-secret", "memory-limit"]);
      const labels = report.categories.filter((name) => allowed.has(name));
      const phase = ["prisma-generate", "next-build"].includes(report.stage) ? report.stage : "unknown";
      detail = `; command=${phase}; categories=${labels.join(",") || "unclassified"}`;
    } catch { /* No command failure report. */ }
    utils.status.show({
      title: "Build diagnostics",
      summary: `stage=${stage}; error=${category}${detail}`,
      text: "Only fixed diagnostic labels are published; credentials and raw logs are omitted.",
    });
  },
};

const { readFile, rm } = require("node:fs/promises");
const { spawnSync } = require("node:child_process");
let stage = "initialization";

module.exports = {
  async onPreBuild() {
    stage = "application-build";
    await rm(".netlify/build-diagnostics.json", { force: true });
  },
  onBuild() { stage = "adapter-and-bundling"; },
  onPostBuild() { stage = "post-build-validation"; },
  async onEnd({ error, utils }) {
    // Reports are public deploy metadata. Emit fixed labels only, never raw
    // errors, environment values, paths, or build output containing secrets.
    let runtimeOutput = "";
    if (error && stage === "adapter-and-bundling") {
      const probe = spawnSync(".netlify/plugins/deno-cli/deno", [
        "check", "--cached-only", "--no-config", "--node-modules-dir=false",
        "--import-map=.netlify/edge-functions-import-map.json",
        ".netlify/edge-functions/___netlify-edge-handler-node-middleware/___netlify-edge-handler-node-middleware.js",
      ], { encoding: "utf8", timeout: 20000, maxBuffer: 128000 });
      runtimeOutput = `${probe.stderr || ""}\n${probe.stdout || ""}`;
    }
    const message = `${runtimeOutput}\n${error?.message || ""}\n${error?.stack || ""}\n${error?.cause?.message || ""}`;
    const categories = [
      ["secret-scan", /secret.{0,30}(scan|found|detect)/i],
      ["memory-limit", /out of memory|heap limit|SIGKILL/i],
      ["unsupported-module", /unsupported|cannot find module|could not resolve/i],
      ["edge-validation", /edge.{0,30}(valid|bundl|size)/i],
      ["function-size", /(function|bundle).{0,30}(large|limit|size)/i],
      ["build-command", /command failed|non.zero|exit code/i],
      ["missing-file", /ENOENT|no such file or directory/i],
      ["permission", /EACCES|EPERM|permission denied|forbidden/i],
      ["native-addon", /C\+\+ Addon|\.node\b/],
      ["cache", /cache|ENOENT.{0,100}\.next/i],
      ["forms", /Netlify Forms|forms.*integration/i],
      ["network", /fetch failed|ECONNRESET|ENOTFOUND|ETIMEDOUT/i],
      ["invalid-manifest", /manifest|JSON|Unexpected token/i],
      ["invalid-path", /path.*(?:absolute|relative|string)|ERR_INVALID_ARG_TYPE/i],
    ];
    const matches = categories.filter(([, pattern]) => pattern.test(message)).map(([name]) => name);
    const category = error ? matches.join(",") || "unclassified" : "none";
    const vocabulary = new Set("error failed failure build bundle bundling edge function functions manifest invalid validation validate property required additional properties unexpected token json parse syntax import export module modules node prisma pg fs crypto wasm native addon addons unsupported supported not found cannot find resolve resolution runtime middleware proxy package dependency dependencies size large limit exceeds exceeded maximum compressed uncompressed memory timeout network fetch request response status permission denied unauthorized forbidden path file directory missing cache tar tarball archive included excluded matcher matchers pattern patterns regular expression regexp lookahead group capture capturing duplicate name names version bootstrap deno esbuild stack unexpected expected object string number boolean undefined null array format schema declaration declarations config configuration generator environment variable secret value values must should be is are was of the a an in on for from to with and or as at by only using contains does do has have during requires use implementation implemented bytes mb kb code eexist enoent enoent eacces eperm err_invalid_arg_type".split(" "));
    const hints = error ? [...new Set(message.toLowerCase().match(/[a-z_]+/g) || [])].filter((word) => vocabulary.has(word)).slice(0, 55).join(" ") : "none";
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
      summary: `stage=${stage}; error=${category}${detail}; hints=${hints}`,
      text: "Only fixed diagnostic labels are published; credentials and raw logs are omitted.",
    });
  },
};

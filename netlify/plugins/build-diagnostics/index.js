let stage = "initialization";

module.exports = {
  onPreBuild() { stage = "application-build"; },
  onBuild() { stage = "adapter-and-bundling"; },
  onPostBuild() { stage = "post-build-validation"; },
  onEnd({ error, utils }) {
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
    utils.status.show({
      title: "Build diagnostics",
      summary: `stage=${stage}; error=${category}`,
      text: "Only fixed diagnostic labels are published; credentials and raw logs are omitted.",
    });
  },
};

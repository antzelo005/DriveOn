import defaults from "../config/github-pages.json" with { type: "json" };

/** GitHub Actions supplies the actual owner/repository, preserving path casing. */
export function pagesConfig(repository = process.env.GITHUB_REPOSITORY) {
  const [owner, name] = (
    repository || `${defaults.owner}/${defaults.repository}`
  ).split("/");
  if (!owner || !name || !/^[a-zA-Z0-9_.-]+$/.test(name)) {
    throw new Error("Expected GITHUB_REPOSITORY in owner/repository format.");
  }
  const base =
    name.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? "/"
      : `/${name}/`;
  return {
    owner,
    repository: name,
    base,
    siteUrl: `https://${owner.toLowerCase()}.github.io${base}`,
  };
}

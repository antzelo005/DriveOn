import defaults from "../config/github-pages.json" with { type: "json" };
import business from "../src/data/business.json" with { type: "json" };

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
  const custom = business.seo.siteUrl ? new URL(business.seo.siteUrl) : null;
  if (
    custom &&
    (custom.protocol !== "https:" ||
      custom.search ||
      custom.hash ||
      !custom.pathname.endsWith("/"))
  )
    throw new Error(
      "seo.siteUrl must be an HTTPS URL with a trailing slash, no query or fragment.",
    );
  return {
    owner,
    repository: name,
    base: custom?.pathname || base,
    siteUrl: custom?.href || `https://${owner.toLowerCase()}.github.io${base}`,
  };
}

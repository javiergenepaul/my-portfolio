/**
 * Node can't `import` images/PDFs the way webpack can. The app's next.config.ts
 * maps those imports to plain URL strings (asset/resource); this mirrors that
 * so seed scripts can import the real content modules out of src/.
 *
 * The exact URL doesn't matter here — image fields get real URLs when media
 * moves to Supabase Storage. This just satisfies the import chain.
 */
const path = require("path");

const EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".pdf"];

for (const ext of EXTS) {
  require.extensions[ext] = (module, filename) => {
    module.exports = "/assets/" + path.basename(filename);
  };
}

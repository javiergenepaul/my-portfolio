module.exports = {
  plugins: {
    // Tailwind v4 ships its own PostCSS plugin.
    // autoprefixer is no longer needed — Tailwind v4 handles vendor prefixes.
    "@tailwindcss/postcss": {},
  },
};

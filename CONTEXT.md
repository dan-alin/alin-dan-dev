# Domain Glossary

## Theme variant

A theme has a **variant**: either `dark` or `light`. The settings module exposes `isDark` as a derived boolean so callers never inspect the theme value directly.

**Avoid:** checking `settings.theme === 'dark'` (or any specific theme value) at call sites — use `settings.isDark`.

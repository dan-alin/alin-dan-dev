# Domain Glossary

## Theme variant

A theme has a **variant**: either `dark` or `light`. The settings module exposes `isDark` as a derived boolean so callers never inspect the theme value directly.

**Avoid:** checking `settings.theme === 'dark'` (or any specific theme value) at call sites — use `settings.isDark`.

## Pattern

A **pattern** is the background visual style applied to the page. The three named patterns are `dots`, `lines`, and `grid`. Settings exposes `nextPattern()` to cycle through them in order.

## Settings dialog

The **settings dialog** (`SettingsDialog`) is the modal panel opened via ⌘K / Ctrl+K on desktop. It controls theme and pattern. On mobile the equivalent surface is the **mobile settings bar** (`MobileSettingsBar`) — a fixed header strip with theme-toggle and pattern-cycle buttons.

**Avoid:** the old name `CommandDialog`, which implied command-palette behaviour that does not exist.

## Settings shortcut

The **settings shortcut** (`registerSettingsShortcut` in `settingsTrigger.ts`) wires up the ⌘K / Ctrl+K global keydown listener that opens the settings dialog. It is registered on mount, desktop only.

**Avoid:** the old name `registerCommandShortcut` / `commandTrigger`.

## Profile

The **profile** is the user's professional identity block, containing `name`, `role`, and `location`. It is the primary content entity of the homepage.

**Does not include** `version` or the section label — those are separate concepts.

## Section label

A **section label** is the rotated, terminal-style identifier displayed at the edge of each section (e.g. `whoami`). It uses the `type` text effect and is styled with `text-command`. Each section of the site has its own section label.

## Version

The **version** is the standalone app version string sourced from `__APP_VERSION__`, displayed on the homepage and linked to the corresponding GitHub release tag (`v{version}`). It is not part of the profile.

## Text effects

**Text effects** are the named animations applied to text elements to reinforce the terminal aesthetic:

- **`scramble`** — randomises characters and resolves to the final text
- **`type`** — types out the text character by character

## Social links

**Social links** (`socialLinks`) is a grouped object containing the user's external profile URLs. Current members: `github`, `linkedin`. Provided by the layout server load function and consumed across the layout and page.

**Avoid:** flat fields like `githubUrl` / `linkedinUrl` at call sites — access via `data.socialLinks.github`, `data.socialLinks.linkedin`.

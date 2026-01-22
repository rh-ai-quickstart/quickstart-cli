# README

This repository provides a way to speed up development and save time when working with coding agents such as Cursor by using pre-written prompts called **Commands**.

Commands are saved prompts that can be reused. For example, if you are working with TypeScript or JavaScript and want to add JS Docs to each function and class, you can create a command called `add-docs` with the following prompt:

```
Please ad JS Docs where they are needed. Please do not add "fluff" and ensure no comments are to obvious.
```

You can define commands in Cursor in a couple of ways:
1. Through the code editor settings.
2. By creating a file in the repository's `.cursor/commands` folder.

---

Custom commands let you create reusable workflows triggered by a simple `/` prefix in the chat input box. This helps standardize processes and make common tasks more efficient for your team.

> **Note:** Commands are currently in beta. The feature and syntax may change as improvements are made.

## How commands work

Commands are defined as plain Markdown files and can be stored in three locations:

- **Project commands:** `.cursor/commands` directory in your project
- **Global commands:** `~/.cursor/commands` directory in your home
- **Team commands:** Created by team admins in the Cursor Dashboard for all team members

When you type `/` in the chat input box, Cursor will automatically display all available commands.

## Creating commands

1. Create a `.cursor/commands` directory in your project root.
2. Add Markdown files with descriptive names (e.g., `review-code.md`, `write-tests.md`).
3. Write plain Markdown content describing the command.

Commands will then automatically appear in the chat when you type `/`.

### Example directory structure

```
.cursor/
└── commands/
    ├── address-github-pr-comments.md
    ├── code-review-checklist.md
    ├── create-pr.md
    ├── light-review-existing-diffs.md
    ├── onboard-new-developer.md
    ├── run-all-tests-and-fix.md
    ├── security-audit.md
    └── setup-new-feature.md
```
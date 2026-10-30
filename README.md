# SplitSmart Lab 6 starter deliverables

This folder contains draft requirements artifacts based on the Lab 6 handout:
- `UserRequirement.md` — original customer request transcribed from the assignment; keep unchanged.
- `constitution.md` — proposed project principles.
- `requirements.md` — feature specification, requirements, acceptance criteria, MVP subset, and open questions.
- `clarification_questions.md` — questions to use with `/speckit-clarify`.

## Important
These are draft artifacts to review, not proof that Spec Kit has been initialized or that Copilot Agent has run. Follow the lab's required workflow in VS Code and compare the generated files with these drafts. Do not invent answers to the open questions.

## Required workflow in VS Code
1. Open this folder as a project in VS Code.
2. In the VS Code terminal, check `python --version` and `py --version`.
3. Install/check tools as needed: `uv tool install specify-cli`, then `specify --help`.
4. Run `specify init . --integration copilot`.
5. In GitHub Copilot Chat, select Agent mode and run `/speckit-constitution`, using the prompt from the lab handout.
6. Run `/speckit-specify`, using the prompt from the handout.
7. Run `/speckit-clarify`. Answer questions only when you know the intended decision; otherwise record them as unresolved.
8. Review all generated artifacts manually and make sure `UserRequirement.md` is unchanged.
9. Initialize/commit/push to your public GitHub repository and submit the repository URL on Canvas.

## Git commands (after creating a GitHub repository)
Use your own repository URL in place of `YOUR_REPOSITORY_URL`:
```powershell
git init
git add .
git commit -m "Complete CIS 285 Lab 6 requirements artifacts"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```
If this is an existing repository, do not run `git init` or add a second `origin` remote without checking the current Git status and remotes first.

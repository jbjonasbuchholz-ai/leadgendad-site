# Lead Gen Dad website

Live site files. Every change saved here goes live automatically through Netlify.

## Where things live

| What you want to change | File |
|---|---|
| Home page text | `index.html` |
| Playbook list (titles, build times, costs, "coming soon") | `assets/site.js` → `PLAYBOOKS` |
| Tool stack + affiliate links | `assets/site.js` → `TOOLS` |
| A single playbook's page | `playbooks/<name>/index.html` |
| Contact page | `contact/index.html` |
| Colors and fonts | `assets/style.css` → `:root` at the top |

## Fix a typo yourself

1. Open the file on GitHub.
2. Click the pencil icon.
3. Change the text. Don't touch anything inside `< >`.
4. Click **Commit changes**. It's live in about a minute.

## Add a new playbook

Ask Claude: "Add a playbook on ___ to the Lead Gen Dad site." It builds the page at `playbooks/<name>/` and switches its card from "Coming soon" to live.

The link you DM people from a comment keyword is `yourdomain.com/playbooks/<name>/`.


# Contributing to FoodMate

👋 Welcome! This guide is for team members contributing to **FoodMate**, our collaborative meal planning app developed as part of our SIT725 Unit. 

Please follow the steps below to keep our workflow clean and consistent.

## 🚀 Getting Started

1. **Clone the repository**  
   If you’ve been added as a collaborator:
   ```bash
   git clone git@github.com:apriilbee/foodmate.git
   cd foodmate
   ```

2. **Create your own branch**  
   Always work on a feature branch — never push directly to `master` or `release-*`.

   Use this format:
   ```
   git checkout -b feature-{trelloID}-{short-description}
   ```

   Example:
   ```
   git checkout -b feature-1-login-ui
   ```

3. **Push your branch**
   ```bash
   git push origin feature-{trelloID}-{short-description}
   ```

## 🔁 Pull Requests (PRs)

After pushing, GitHub will suggest opening a **Pull Request**.  
We require all changes to go through a PR — no direct pushes to `master` or `release-*`.

### PR Guidelines:
- Keep PRs focused on a single task or fix
- Add a brief but meaningful description
- Link any related issues or tasks
- Use clear titles like:  
  `Add dietary tag filtering to recipe search`

## ✅ Commit Messages

Use present tense and include a scope (e.g., `backend`, `ui`, `db`, `docs`). 

Examples:
```
backend: Add validation for login form  
ui: Fix mobile view overflow in dashboard  
db: Refactor recipe model to support categories  
```


## 🔒 Branch Protections

The following branches are protected:
- `master`
- Any `release-*` branches

This means:
- ✅ You can push to your own branches
- 🚫 You cannot push directly to protected branches
- 🔁 You must go through a Pull Request to merge

## 🧪 Testing & Review

Before creating a PR:
- Write clean, modular code using the MVC structure
- Test your changes locally or in a shared environment by merging your branch into the `dev` branch.<br/>
Ultimately, please make sure there are no critical bugs, console errors, or major issues before requesting a review.
- Ensure no console errors or major UI issues

After creating a PR:
- Add PR link to Trello ticket
- Request review
- Fix any feedback
- An authorized team member will merge once approved

P.S. If you are requested to be a reviewer, please review the code promptly and leave constructive feedback or approval to keep the workflow moving smoothly.

## 🙌 Thank You

If you have any questions, feel free to ask in the project chat or or relevant task threads (e.g., Trello, GitHub, or wherever we’re tracking work).
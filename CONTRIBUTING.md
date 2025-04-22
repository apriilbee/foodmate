
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
   Always work on a feature branch — never push directly to `main` or `release-*`.

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
We require all changes to go through a PR — no direct pushes to `main` or `release-*`.

### PR Guidelines:
- Keep PRs focused on a single task or fix
- Add a brief but meaningful description
- Link any related issues or tasks
- Use clear titles like:  
  `✨ Add dietary tag filtering to recipe search`

## ✅ Commit Messages

Use present tense, imperative tone. Examples:
```
Add validation for login form  
Fix mobile view overflow in dashboard  
Refactor recipe model to support categories  
```


## 🔒 Branch Protections

The following branches are protected:
- `main`
- Any `release-*` branches

This means:
- ✅ You can push to your own branches
- 🚫 You cannot push directly to protected branches
- 🔁 You must go through a Pull Request to merge

## 🧪 Testing & Review

Before creating a PR:
- Test your changes locally
- Ensure no console errors or major UI issues
- Write clean, modular code using the MVC structure


After creating a PR:
- Add PR link to Trello ticket
- Request review
- Fix any feedback
- An authorized team member will merge once approved


## 🙌 Thank You

If you have any questions, feel free to ask in the project chat or or relevant task threads (e.g., Trello, GitHub, or wherever we’re tracking work).
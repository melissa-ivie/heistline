# Heistline

Heistline is a high-stakes mission-planning game built with React and Vite. Players collaborate to hack, sneak, and expose corruption while racing against the clock.

## Getting Started (for Developers)

This guide explains how to set up the Heistline project locally using GitHub Desktop, Node.js, and npm.

---

## Prerequisites

1. **GitHub Desktop**  
   Download and install GitHub Desktop from:  
   https://desktop.github.com/

2. **Node.js and npm**  
   Download and install Node.js (LTS version recommended) from:  
   https://nodejs.org/

   This also installs `npm` (Node Package Manager), which you will use to install dependencies.

---

## Cloning the Repository

### Using GitHub Desktop

1. Open GitHub Desktop
2. Go to `File` > `Clone Repository`
3. Enter the repository URL:
   ```
   https://github.com/your-username/heistline.git
   ```
4. Choose a local folder for the project and clone it

### Or using the command line

```bash
git clone https://github.com/your-username/heistline.git
cd heistline
```

---

## Installing Dependencies

After cloning the repository, open a terminal and run:

```bash
npm install
```
In visual studio code, the terminal can be opened with View -> Terminal 
This installs all required libraries listed in `package.json`.

---

## Running the App Locally

To start the local development server, run:

```bash
npm run dev
```

After starting, you will see a message like:

```
  Local: http://localhost:5173/
```

Open that URL in your browser to use the app.

---

## Deployment

This project is configured to auto-deploy to IONOS using GitHub Actions via SFTP.

### Deployment Process

1. Any push to the `main` branch triggers the GitHub Action
2. The project builds using `vite build`
3. Output from `heistline/dist/` is uploaded to the `/htdocs/` directory on the IONOS server
4. The site is served at:
   ```
   https://heistline.com
   ```

---

### Branching Strategy 

### Step 1: Create a New Branch

1. Open **GitHub Desktop**
2. Make sure your current repository is open (e.g. `heistline`)
3. Click the **Current Branch** dropdown (top middle)
4. Select **"New Branch..."**
5. Name your branch (use lowercase and hyphens, like `add-mission-modal`)
6. Click **Create Branch**

GitHub Desktop will automatically switch you to the new branch.

---

### Step 2: Make Changes Locally

- Open the project in your code editor (e.g. VS Code)
- Make your changes
- Save files

---

### Step 3: Commit and Push

1. Go back to **GitHub Desktop**
2. You’ll see your changes listed
3. Write a short commit message (e.g. `Add mission briefing modal`)
4. Click **Commit to [your-branch-name]**
5. Click **Push origin** (top bar) to upload your changes to GitHub

---

### Step 4: Create a Pull Request (PR)

1. After pushing, GitHub Desktop will show a button:  
   **"Create Pull Request"** — click it  
   *(Or go to https://github.com/[your-username]/[repo]/pulls to create it manually)*

2. On GitHub:
   - Ensure the base branch is `main`
   - The compare branch is your new feature branch
   - Add a title and description of what you changed
   - Click **"Create pull request"**

---

### Step 5: Wait for Review

Once your PR is created, a project maintainer will review and approve or request changes.

You can continue to push more commits to your branch, and they’ll appear in the same PR.

---

### Notes

- Never commit directly to the `main` branch.
- Keep your branch focused (1 feature or fix per branch).
- Delete your branch after the PR is merged.
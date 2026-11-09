# SkillMap – Student Skill Gap Analyzer

SkillMap helps a student compare their current technical skills with the skills expected for a career they want to explore. It is a static website built with HTML, CSS, and beginner-friendly JavaScript. It stores data in the browser's IndexedDB database and keeps a LocalStorage fallback. There is no login screen, cloud service, or AI feature.

## Run the project

- **Replit:** create an HTML/CSS/JS Repl, add these files, and open the Webview/Preview.
- **VS Code:** open `index.html` in a browser, or use the Live Server extension for a local preview.
- **GitHub Pages:** publish the repository from its root. The pages use relative links, so they also work when hosted in a project subfolder.

The chart on the results page uses Chart.js from a CDN, so that chart needs an internet connection. If it cannot load, the skill comparison table still works. Inter is loaded from Google Fonts with a system-font fallback.

## Student flow

1. On the home page, choose **Get started** or select a career card.
2. Fill in the profile and select a career direction.
3. Rate each career skill from 1 (Beginner) to 5 (Expert).
4. Review the skill map, then open recommendations and mark activities as in progress or complete.
5. View the dashboard or print the student report. Use **Reset data** in the top navigation to start over.

Profile, ratings, and learning progress are stored in the browser's IndexedDB database under `SkillMapDatabase`. Data stays in the same browser and device; it is not shared across devices. The app also keeps a LocalStorage copy so it can migrate existing data and continue working if IndexedDB is unavailable. Use **Reset data** to clear both copies. Clearing browser site data also removes the database.

## Publish to GitHub

For a beginner-friendly push, open this project folder in GitHub Desktop using **File → Add local repository**, sign in if prompted, and choose **Push origin** to send your commits to GitHub. If starting with an online repository that already contains files, clone it first and copy the project files into that clone. Never put a GitHub password or access token in project files or chat.

To deploy with GitHub Pages after publishing, open the repository's **Settings → Pages**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save. The site uses relative file paths and is compatible with a repository subpath.

## How the calculations work

- **Skill gap:** `Math.max(targetLevel - currentLevel, 0)`
- **Career readiness:** `(sum of current skill levels / sum of target skill levels) * 100`
- **Learning progress:** `(completed skills / total career skills) * 100`

The readiness result follows the requested formula and is rounded to a whole percent. Because current skill levels can be higher than a career's target levels, the formula can produce a value above 100%.

## Project map

- `index.html` – landing page and career previews.
- `dashboard.html` – saved learning overview and dashboard empty state.
- `profile.html` – student details and career selection.
- `assessment.html` – career-specific skill ratings.
- `results.html` – readiness, gaps, comparison table, and chart.
- `recommendations.html` – suggested learning actions and links.
- `progress.html` – completed, in-progress, and remaining skills.
- `report.html` – printable student report.
- `css/style.css` and `css/responsive.css` – shared design and mobile layouts.
- `data/careers.js` – five careers, their target levels, and learning resources.
- `js/storage.js` – IndexedDB setup, LocalStorage migration, and fallback.
- `js/analyzer.js` – calculate skill gaps, readiness, and learning progress.
- `js/recommendations.js` – turn a gap into a suggested next activity.
- `js/app.js` – shared navigation, career previews, and small page helpers.
- `js/profile.js`, `js/assessment.js`, `js/results.js`, `js/recommendations-page.js`, `js/progress.js`, `js/dashboard.js`, and `js/report.js` – behavior for each page.

## A simple way to explain the code

The pages collect or display information. `storage.js` saves it in IndexedDB and maintains a LocalStorage fallback. `careers.js` holds the target skill levels. `analyzer.js` compares the student's ratings with those targets. The page scripts use those shared pieces to show recommendations, progress, and the report. This keeps the calculations in one place and the page behavior easy to follow.

For a three-person presentation, one person can explain the HTML/CSS and responsive layout, one can explain the career data and assessment flow, and one can explain the calculations, LocalStorage, and progress/report pages. All three should be comfortable describing the end-to-end student flow.
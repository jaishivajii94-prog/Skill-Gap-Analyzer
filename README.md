# SkillMap – Student Skill Gap Analyzer

SkillMap helps a student compare their current technical skills with the skills expected for a career they want to explore. It is a static website built with HTML, CSS, and beginner-friendly JavaScript. It works with LocalStorage by default and can optionally sync records to Supabase. There is no login screen or AI feature.

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

Profile, ratings, and learning progress are always saved in the browser's LocalStorage under `skillmapStudentData`. Without Supabase configuration, no information leaves the browser. With Supabase enabled, the app uses an anonymous session and row-level security so each session can access only its own analysis. Clearing browser data also clears that anonymous session, so it cannot be used to recover the account. The Reset data button deletes the current cloud row when connected.

## Optional Supabase database

1. Create a Supabase project.
2. In Authentication settings, enable anonymous sign-ins. SkillMap does not show a login screen; Supabase uses an anonymous session behind the scenes to protect each student's row.
3. Open the Supabase SQL Editor and run `supabase/schema.sql`. It creates the `student_analyses` table and row-level security policies.
4. In Supabase project API settings, copy the Project URL and the public anon/publishable key into `url` and `publishableKey` in `js/supabase-config.js`.
5. Reload SkillMap and complete an assessment. LocalStorage is updated first; a configured Supabase project then syncs the same profile, ratings, and progress.

Only use the public anon/publishable key in this browser app. Never put a Supabase `service_role` key, database password, or other secret in HTML or JavaScript. The public key is safe to publish because the SQL enables row-level security and requires each row's ID to match the signed-in anonymous user. Keep real student data out of a public class demonstration unless your team and instructor agree on the privacy handling.

## Publish to GitHub

This project folder is not currently a Git repository, and Git is not installed in the current workspace. For a beginner-friendly push, install GitHub Desktop, choose **File → Add local repository**, select this project folder, then publish it to the GitHub repository you created. If your online repository already contains files, clone it first and copy the project files into that clone before publishing. Do not share your GitHub password or access token in chat.

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
- `js/storage.js` – LocalStorage plus optional Supabase sync and anonymous sessions.
- `js/supabase-config.js` – public Supabase project URL and publishable key.
- `supabase/schema.sql` – database table and row-level security policies.
- `js/analyzer.js` – calculate skill gaps, readiness, and learning progress.
- `js/recommendations.js` – turn a gap into a suggested next activity.
- `js/app.js` – shared navigation, career previews, and small page helpers.
- `js/profile.js`, `js/assessment.js`, `js/results.js`, `js/recommendations-page.js`, `js/progress.js`, `js/dashboard.js`, and `js/report.js` – behavior for each page.

## A simple way to explain the code

The pages collect or display information. `storage.js` saves it. `careers.js` holds the target skill levels. `analyzer.js` compares the student's ratings with those targets. The page scripts use those shared pieces to show recommendations, progress, and the report. This keeps the calculations in one place and the page behavior easy to follow.

For a three-person presentation, one person can explain the HTML/CSS and responsive layout, one can explain the career data and assessment flow, and one can explain the calculations, LocalStorage, and progress/report pages. All three should be comfortable describing the end-to-end student flow.
# Founder Clarity Index (FCI)

A clean, modern, web-based diagnostic tool designed for aspiring entrepreneurs, students, and early-stage builders.

## Features
- **4 Assessment Pillars**: Problem Clarity, Person Clarity, Solution Clarity, and Action Readiness.
- **Scoring Logic**: Automated scoring (0-100) with stage-based feedback.
- **Pillar Analysis**: Identifies "Biggest Clarity Gap" and "Current Strength".
- **Actionable Advice**: Provides recommended next steps based on the lowest scoring pillar.
- **Modern UI**: Clean, mobile-responsive design with a Typeform-like flow.
- **Local Persistence**: Saves progress automatically using LocalStorage.
- **Exportable**: Print-friendly results summary.

## File Structure
- `index.html`: Main application structure and screens.
- `css/styles.css`: Visual styling, layout, and print rules.
- `js/questions.js`: Configuration file for questions, scoring ranges, and messages.
- `js/app.js`: Application logic, state management, and results calculation.

## Deployment to GitHub Pages
1. Create a new repository on GitHub.
2. Upload all files from this folder to the repository.
3. Go to **Settings** > **Pages**.
4. Under **Build and deployment**, set the source to **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then click **Save**.
6. Your site will be live at `https://<your-username>.github.io/<repository-name>/`.

## Customization
- **Branding**: Update the `title`, `subtitle`, and `description` in `js/questions.js`.
- **Colors**: Modify the CSS variables in `:root` within `css/styles.css`.
- **Questions**: Add or edit questions in `js/questions.js`.
- **CTA**: Update the `book-session-btn` link in `js/app.js`.

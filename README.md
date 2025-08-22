<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1lIjQXxFLW3pW7-GUoQCh3EdMLxV6KcR1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow that builds and publishes the app to GitHub Pages. Any push to the `main` branch triggers a deployment.

To enable GitHub Pages:
1. In your repository settings, under **Pages**, select **GitHub Actions** as the source.
2. Push to `main` or run the **Deploy to GitHub Pages** workflow manually from the **Actions** tab.
3. After the workflow completes, your site will be available at `https://<username>.github.io/<repository>/`.

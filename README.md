# AI Assistant Bot

This is a web-based AI chat application that allows users to interact with an AI model. Users can send text messages and upload files for the AI to process and discuss. The application is built with React, TypeScript, and Vite.

## Features

*   Interactive chat interface.
*   File uploads (images, text files currently supported for preview and basic processing by the AI).
*   Selection from multiple AI models (though some may be mocked in the current version).
*   Responsive design for chat messages.
*   Basic file preview for images and text.

## Project Setup

**Prerequisites:**

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   NPM (comes with Node.js) or Yarn

**Installation:**

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `yarn install` if you prefer Yarn)

**Environment Variables:**

1.  Create a new file named `.env.local` in the root of the project. You can copy `.env` if it exists and you want to preserve its structure:
    ```bash
    cp .env .env.local
    ```
    *(Note: Ensure `.env.local` is listed in your `.gitignore` file to prevent committing your API key).*
2.  Open `.env.local` and add your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key.

**Running the Development Server:**

1.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
    (or `yarn dev`)

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your console if different).

    **Troubleshooting Note:** If `npm run dev` fails with an error like `Cannot find module 'vite'`, you might need to run Vite directly from the `node_modules` folder or ensure your project's `node_modules/.bin` is in your PATH. The following commands can be used as alternatives in PowerShell or Command Prompt respectively:
    *   PowerShell: `.\node_modules\.bin\vite`
    *   CMD: `.\node_modules\.bin\vite.cmd`
    (The project also contains `start_dev.ps1` and `start_dev.bat` which might incorporate these direct paths.)


## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run preview`: Serves the production build locally for preview.

## Code Structure

*   **`/` (Root Directory):**
    *   `App.tsx`: Main application component, orchestrates the UI and state.
    *   `index.tsx`: Entry point for the React application.
    *   `constants.ts`: Defines application-wide constants (e.g., AI models, initial messages).
    *   `types.ts`: Contains TypeScript type definitions and interfaces.
    *   `vite.config.ts`: Vite build and development server configuration.
    *   `tsconfig.json`: TypeScript compiler options.
    *   `package.json`: Project metadata, dependencies, and scripts.
*   **`components/`**: Contains reusable React UI components.
    *   `icons/`: Specific SVG icon components.
    *   `ChatInput.tsx`: Component for user message input, file attachment, and model selection.
    *   `ChatWindow.tsx`: Component for displaying chat messages.
    *   `FilePreview.tsx`: Component for displaying previews of attached files.
*   **`services/`**: Contains modules for interacting with external services or handling complex logic.
    *   `fileHelper.ts`: Utility functions for file processing (e.g., getting preview type, converting data URLs).
    *   `geminiService.ts`: Module for interacting with the Gemini AI model (currently scaffolded with mock responses).

## Known Issues & Limitations

*   **Mocked AI Service:** The connection to the actual Gemini AI service in `geminiService.ts` is currently scaffolded. It returns mock responses and does not make real API calls. The `VITE_GEMINI_API_KEY` is checked, but not yet used by the mock service for actual authentication.
*   **File Preview Support:**
    *   Previews for images (PNG, JPG, etc.) and plain text files (.txt, .csv, .json) are supported.
    *   PDF file previews are not implemented (shows a message).
    *   Previews for other file types (e.g., `.doc`, `.docx`, `.xls`, `.xlsx`) are not supported and will show a generic "not supported" message.
*   **Error Handling:** While basic error handling is in place, it can be further improved for more specific error scenarios.

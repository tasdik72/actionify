# Actionify: AI-Powered Meeting Analysis

## Project Overview

Actionify is a web application designed to streamline meeting analysis by leveraging AI for transcription, content summarization, action item extraction, and sentiment analysis. It provides users with a comprehensive dashboard to review meeting insights and export them in various formats.

## Features

*   **Media Upload:** Upload audio/video files or paste text for analysis.
*   **AI Transcription:** Utilizes AssemblyAI for accurate transcription of audio/video, including speaker diarization.
*   **Content Analysis:** Employs OpenRouter (or a similar LLM service) to generate executive summaries, extract key points, action items, and decisions from meeting transcripts.
*   **Sentiment Analysis:** Provides overall meeting sentiment, sentiment over time, and speaker-specific sentiment insights.
*   **Interactive Dashboard:** A dynamic dashboard to view all analysis results, with different tabs for summary, transcript, action items, and sentiment.
*   **Export Functionality:** Export meeting analysis reports to PDF, Markdown, Plain Text, or JSON formats, with options to select specific sections to include.
*   **Progress Tracking:** Real-time progress updates during the analysis process.
*   **Responsive UI:** Built with a modern, responsive user interface using React and Tailwind CSS.

## Technologies Used

*   **Frontend:**
    *   React (with TypeScript)
    *   Vite (for fast development)
    *   Tailwind CSS (for styling)
    *   Lucide React (for icons)
    *   Recharts (for data visualization in sentiment analysis)
    *   React Hot Toast (for notifications)
    *   React Router DOM (for navigation)
    *   jsPDF (for client-side PDF generation)
*   **Backend/APIs (Interacted with via Frontend Services):**
    *   AssemblyAI (for audio transcription and speaker diarization)
    *   Cloudinary (for media file uploads)
    *   OpenRouter (for content and sentiment analysis using various LLM models)

## Setup and Installation

To get Actionify up and running on your local machine, follow these steps:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### 1. Clone the Repository

```bash
git clone <repository_url>
cd Actionify
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. Replace the placeholder values with your actual API keys and configurations:

```
VITE_CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET=YOUR_CLOUDINARY_UPLOAD_PRESET
VITE_ASSEMBLYAI_API_KEY=YOUR_ASSEMBLYAI_API_KEY
VITE_OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
```

*   **Cloudinary:** Used for uploading audio/video files. You'll need a Cloudinary account to get your `CLOUD_NAME` and create an `UPLOAD_PRESET`.
*   **AssemblyAI:** Used for transcribing audio/video. You'll need an AssemblyAI account to obtain an `API_KEY`.
*   **OpenRouter:** Used for AI-powered content and sentiment analysis. You'll need an OpenRouter account to get your `API_KEY`.

### 4. Run the Application

Using npm:

```bash
npm run dev
```

Or using Yarn:

```bash
yarn dev
```

The application will typically run on `http://localhost:5173` (or another available port). Open your browser and navigate to this address.

## Usage

1.  **Upload/Input:** On the home page, you can either upload an audio or video file, or paste text directly into the input area.
2.  **Processing:** Once submitted, the application will process the input through transcription (if media file), content analysis, and sentiment analysis. You will see a progress bar and status updates for each step.
3.  **View Results:** After processing is complete, a dashboard will display the analysis results, organized into tabs:
    *   **Summary:** Executive summary, key points, and topics.
    *   **Transcript:** Full meeting transcript with speaker diarization.
    *   **Action Items:** Extracted tasks, assignees, deadlines, and priorities.
    *   **Sentiment:** Overall sentiment, sentiment over time graph, and speaker sentiment analysis.
4.  **Export Results:** Click the "Export Results" button to open a modal where you can choose to download the analysis in PDF, Markdown, Plain Text, or JSON formats. You can also select which sections to include in the exported file.

## Folder Structure

```
.
├── public/                     # Public assets
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/             # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProcessingStatus.tsx
│   │   ├── ResultsDashboard.tsx # Main dashboard for displaying results
│   │   ├── UploadSection.tsx    # Component for file/text upload
│   │   └── results/            # Components specific to results display
│   │       ├── ActionItemsView.tsx
│   │       ├── ExportModal.tsx
│   │       ├── SentimentView.tsx
│   │       ├── SummaryView.tsx
│   │       └── TranscriptView.tsx
│   ├── index.css               # Global CSS
│   ├── main.tsx                # Entry point for React app
│   ├── pages/                  # Page-level components
│   │   ├── AboutPage.tsx
│   │   ├── AppPage.tsx         # The core page handling upload and results
│   │   ├── FeaturesPage.tsx
│   │   ├── HomePage.tsx
│   │   └── PricingPage.tsx
│   ├── services/               # API interaction and utility services
│   │   ├── assemblyAIService.ts
│   │   ├── cloudinaryService.ts
│   │   ├── exportService.ts    # Contains PDF, Markdown, Text, JSON export logic
│   │   ├── huggingFaceService.ts
│   │   └── openRouterService.ts
│   └── vite-env.d.ts           # TypeScript declaration for Vite env
├── .env.example                # Example environment variables
├── index.html                  # HTML template
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## Copyright
Open for everyone. Enjoy your coding!

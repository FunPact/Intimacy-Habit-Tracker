# Intimacy-Habit-Tracker
**A full-stack Next.js app built to help users develop meaningful emotional and intimacy self-care habits. Easily track daily habits, monitor streak progress, and celebrate milestones.**
## Features
- User authentication via email/password
- Dashboard with habit list and daily completion checkboxes
- Streak meter visualization with badges and confetti for milestone achievements
- Responsive design for mobile and desktop
- Offline support using local storage caching
- Placeholder button for future Flow blockchain token rewards integration
## Technologies Used
- React with React Router for navigation
- Tailwind CSS for styling
- Custom hooks for authentication (`useAuth`)
- Lucide-react icons
## Tools Used
- **Lovable AI** for rapid full-stack scaffold of the habit tracker app via natural language prompts.
- **Perplexity AI** to generate structured JSON-based prompts that guided the precise specifications for Lovable AI & Cursor AI. This helped ensure clear, consistent, and machine-readable instructions for building the app's features efficiently.
  
- **Cursor AI** played a crucial role in integrating Flow blockchain functionalities into this repository. By connecting directly to the GitHub repository, Cursor AI:
1. Automatically added and committed Flow Client Library (FCL) setup and configuration.
2. Created React wallet connection components and hooks for seamless Flow wallet integration.
3. Generated Cadence smart contract templates and deployment scripts for token minting.
4. Implemented efficient minting logic triggered by habit streak milestones with real-time transaction feedback.
5. Enhanced existing UI components with blockchain interaction features.
6. Managed environment configuration and provided detailed code comments for maintainability.

This end-to-end AI-assisted development approach accelerated implementation, ensured adherence to best practices, and facilitated a smooth blockchain integration workflow. Cursor’s ability to understand repository context and make precise code changes directly on GitHub made it an indispensable tool for this project.
### Prerequisites
- Node.js (v16+ recommended)
- Yarn or npm
### Installation
1. Clone the repository

git clone:https://github.com/FunPact/intimacy-habit-tracker.git

2. Install dependencies
npm install or yarn install

4. Configure environment variables for auth and database connections

5. Run the development server
   
6. Open your browser at http://localhost:3000

## Future Plans
- Integrating Flow Blockchain (Testnet) to mint token rewards using Flow Client Library (FCL)
- Deploying Cadence smart contracts for on-chain milestone tracking

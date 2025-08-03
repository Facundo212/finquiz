# Finquiz

Finquiz is an intelligent educational quiz platform built with React and TypeScript, designed to help students learn through interactive questionnaires and AI-generated questions.

## Table of Contents

- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🎯 Key Concepts](#-key-concepts)
- [🔧 Configuration](#-configuration)
- [🎨 Styling](#-styling)
- [📊 Data Flow](#-data-flow)
- [🏗️ Project Structure](#-project-structure)

## 🛠️ Tech Stack

- **Main**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Variables for theming
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v7

## 🚀 Getting Started

### Prerequisites

Before running this project, you need to have Node.js and npm installed on your system.

#### Installing Node.js and npm

**Option 1: Download from official website (Recommended)**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version (v18 or higher)
3. Run the installer and follow the setup wizard
4. npm comes bundled with Node.js

**Option 2: Using a package manager**

**macOS (using Homebrew):**
```bash
brew install node
```

**Windows (using Chocolatey):**
```bash
choco install nodejs
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify installation:**
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show npm version
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finquiz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Key Concepts

### Questionnaires
Students can create questionnaires by selecting specific course units. The system generates questions dynamically based on the selected topics, with AI-powered explanations for each answer.

### Course Structure
- **Courses**: Top-level educational content
- **Units**: Logical groupings within courses
- **Topics**: Specific subjects within units
- **Questions**: AI-generated questions based on topics

### User Roles
- **Students**: Take questionnaires, view results, access learning materials
- **Teachers**: Manage courses, view student reports, export data

## 🔧 Configuration

### Required Environment Variables

1. **Copy the example environment file**
   ```bash
   cp .env.example .env
   ```

## 🎨 Styling

The application uses a modern design system with:
- Tailwind CSS for utility-first styling
- CSS custom properties for theming
- Radix UI primitives for accessible components
- Responsive design patterns

## 📊 Data Flow

1. Students select course units to create a questionnaire
2. The system generates questions based on selected topics
3. Students answer questions with real-time feedback
4. Results are analyzed and presented with detailed breakdowns
5. Teachers can view comprehensive reports and analytics

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── modals/         # Modal components
│   └── forms/          # Form components
├── containers/         # Page-level components
├── services/           # API services and data fetching
├── reducers/           # Redux store configuration
├── constants/          # App constants and Pascal facts
├── lib/               # Utility functions
├── layouts/           # Layout components
└── hocs/              # Higher-order components
```

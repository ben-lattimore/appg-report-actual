# APPG Comparison Tool

A Next.js application for comparing All-Party Parliamentary Group (APPG) funding data across different years. This tool visualizes and analyzes APPG registration data to help track funding patterns and changes over time.

## Features

- **Year-by-year comparison**: View APPG data for different registration periods
- **Interactive data visualization**: Browse funding information in an organized, searchable format
- **Historical data tracking**: Compare funding patterns across multiple years (2020-2025)
- **Responsive design**: Built with Tailwind CSS for optimal viewing on all devices

## Data Sources

The application uses APPG registration data from:
- 2020-05-20 register
- 2021-06-02 register  
- 2022-05-04 register
- 2023-05-17 register
- 2024-05-30 register
- 2025-05-07 register

Data is stored in both PDF format (original documents) and JSON format (processed data) in the `assets/` directory.

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Data Processing**: Custom transformation scripts
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd appg-comparison-tool-actual
2. Install dependencies:
```
npm install
```
3. Run the development server:
```
npm run dev
```
4. Open http://localhost:3000 in your browser
## Project Structure
```
├── assets/                 # Raw PDF files and processed JSON 
data
├── components/            # React components
│   └── YearlyFundingColumns.tsx
├── data/                  # Processed data files
│   ├── cache/            # Cached aggregated data
│   └── raw/              # Raw JSON data files
├── lib/                   # Utility functions and data 
transformation
├── pages/                 # Next.js pages
│   ├── [year]/           # Dynamic year-based routes
│   ├── api/              # API routes
│   └── index.tsx         # Home page
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── README.md
```
## Available Scripts
- npm run dev - Start development server
- npm run build - Build for production
- npm run start - Start production server
- npm run lint - Run ESLint
## Data Processing
The application includes data transformation utilities in the lib/ directory to process raw APPG registration data into a format suitable for web display.

## Contributing
1. Fork the repository
2. Create a feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request
## License
[Add your license here]

## Contact
[Add your contact information here]

This tool is designed to provide transparency and analysis of APPG funding data for research and public interest purposes.
dashboard-react/
├── public/              # Static assets (logo, favicon)
├── src/
│   ├── assets/          # Images and global styles (Tailwind base)
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Sidebar, Navbar, Footer
│   │   ├── ui/          # Buttons, Inputs, Cards, Modals
│   │   └── charts/      # Recharts/Chart.js wrappers
│   ├── context/         # Global State Management
│   │   ├── ThemeContext.jsx   # Light/Dark mode logic
│   │   └── AuthContext.jsx    # User login & API Key state
│   ├── hooks/           # Custom React hooks (e.g., useLocalStorage)
│   ├── pages/           # Full page views
│   │   ├── Dashboard.jsx      # Overview with memory stats
│   │   ├── Login.jsx          # Auth page
│   │   ├── Signup.jsx         # Auth page
│   │   ├── AppSettings.jsx    # API Key generation & management
│   │   └── MemoryExplorer.jsx # Table for viewing/deleting data
│   ├── services/        # API communication logic (Axios instances)
│   │   ├── api.js             # Base config with x-api-key headers
│   │   ├── auth.service.js    # Login/Signup calls
│   │   └── memory.service.js  # Retrieval & Deletion calls
│   ├── utils/           # Helper functions (date formatting, etc.)
│   ├── App.jsx          # Main routing and Context Providers
│   └── main.jsx         # Entry point
├── .env                 # VITE_API_GATEWAY_URL=http://localhost:4000
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json
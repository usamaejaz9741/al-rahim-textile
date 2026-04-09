# Al-Rahim Textile Industries - Static Website

This repository contains the source code for the official website of **Al-Rahim Textile Industries**, one of Pakistan's largest vertically integrated home textile manufacturers.

## Project Overview

The website is a multi-page static site designed to showcase the company's manufacturing capabilities, product range, sustainability initiatives, and global reach. It provides a professional interface for potential clients and partners to learn about Al-Rahim's operations and request quotes.

### Key Features

- **Responsive Design:** Built with Bootstrap 5.3.3 for seamless viewing across mobile, tablet, and desktop devices.
- **Dynamic Counter Animations:** Interactive counters on the homepage showcasing production scale.
- **Form Validation:** Integrated inquiry and contact forms with real-time validation.
- **Smooth Navigation:** Scroll effects and smooth anchor transitions for an enhanced user experience.
- **SEO Optimized:** Meta tags and semantic HTML for improved search engine visibility.

## Directory Structure

```text
.
├── assets/
│   ├── css/
│   │   ├── styles.css     # Component and layout styles
│   │   └── tokens.css     # Design tokens and CSS variables
│   ├── images/            # Brand assets and product photography
│   └── js/
│       └── main.js        # Main JavaScript logic (interactivity, counters, forms)
├── about.html             # Company history and mission
├── capabilities.html      # Manufacturing processes and infrastructure
├── clients.html           # Global partners and export markets
├── contact.html           # Contact information and office locations
├── index.html             # Homepage
├── inquiry.html           # Request a quote form
├── leadership.html        # Executive team profiles
├── policies.html          # Corporate and compliance policies
├── privacy.html           # Data protection and privacy policy
├── products.html          # Detailed product catalog
└── sustainability.html    # Environmental and social responsibility initiatives
```

## Getting Started

### Prerequisites

No special environment is required to run this project as it consists of static HTML, CSS, and JS files. You only need a modern web browser.

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run locally:**
   You can open `index.html` directly in your browser. However, for the best development experience (including proper path handling), it is recommended to use a local development server:
   - If you have **Node.js** installed:
     ```bash
     # Install a simple server globally
     npm install -g serve
     # Run the server
     serve .
     ```
   - If you have **Python** installed:
     ```bash
     python3 -m http.server 8000
     ```

## Documentation

The project follows standard documentation practices:
- **JavaScript:** All functions and logic in `assets/js/main.js` are documented using **JSDoc**.
- **CSS:** Variables and layout sections are commented for maintainability in `tokens.css` and `styles.css`.

## License

© 2026 Al-Rahim Textile Industries. All rights reserved.

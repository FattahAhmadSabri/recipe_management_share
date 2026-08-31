# Frontend Workflow Documentation

## Overview
This document outlines the structure and workflow of the Recipe Management Sharing Platform frontend.

## Architecture

### Project Structure
```
frontend/
├── index.html              # Main homepage/registration page
├── index.js                # User registration handler
├── css/
│   └── index.css          # Global styles
├── js/
│   ├── config.js          # Centralized API configuration
│   └── layout.js          # Component loading system
├── login/
│   ├── login.html         # Login page
│   └── login.js           # Login handler
├── components/            # Reusable HTML components
│   ├── header/
│   │   └── header.html
│   ├── navbar/
│   │   └── navbar.html
│   ├── recipe-form/
│   │   └── recipe-form.html
│   ├── sidebar/
│   │   ├── sidebar.html
│   │   └── sidebar.js     # Sidebar logic (fetches ingredients/types)
│   └── footer/
│       └── footer.html
└── page/                   # Independent pages
    ├── share-recipe/
    │   └── share-recipe.html
    ├── cuisines/
    │   └── cuisine.html
    ├── authors/
    │   └── author.html
    ├── search/
    │   └── search.html
    └── links/
        └── links.html
```

## Key Components

### 1. **Centralized API Configuration** (`js/config.js`)
- **Purpose**: Single source of truth for API endpoints
- **Base URL**: `http://localhost:4500`
- **Endpoints**:
  - `USER_CREATE`: `/user/create` - User registration
  - `USER_LOGIN`: `/user/login` - User login
  - `MAIN_INGREDIENTS`: `/recipe/main-ingredients` - Fetch ingredients
  - `RECIPE_TYPES`: `/recipe/types` - Fetch recipe types

### 2. **Component Loading System** (`js/layout.js`)
- **Purpose**: Dynamically load HTML components with error handling
- **Features**:
  - Loads all components (header, navbar, recipe-form, sidebar, footer)
  - Includes error handling for failed requests
  - Logs success/failure messages to console
  - Auto-initializes when page loads

### 3. **Sidebar Component** (`components/sidebar/sidebar.js`)
- Fetches main ingredients from API
- Fetches recipe types from API
- Populates lists dynamically
- Handles DOM ready state properly

### 4. **Authentication Pages**
- **Registration** (`index.html`): User registration form
- **Login** (`login/login.html`): User login form

## Workflow Flow

### Page Load Flow
```
1. User opens index.html
2. Browser loads:
   - CSS (index.css)
   - Axios library
   - API config (config.js)
   - Layout.js (component loader)
3. Layout.js loads components:
   - Header (displays welcome message)
   - Navbar (navigation)
   - Recipe Form (for posting recipes)
   - Sidebar (shows ingredients & recipe types)
   - Footer
4. Sidebar.js initializes:
   - Fetches main ingredients from API
   - Fetches recipe types from API
   - Populates sidebar lists
```

### Navigation Flow
- **Home** → `./index.html` - Main page
- **Share a Recipe** → `./page/share-recipe/share-recipe.html`
- **Cuisines** → `./page/cuisines/cuisine.html`
- **Authors** → `./page/authors/author.html`
- **Search** → `./page/search/search.html`
- **Links** → `./page/links/links.html`

### Authentication Flow
1. User fills registration form on homepage
2. Submits to `/user/create` endpoint
3. On success: Shows confirmation, resets form
4. User navigates to login page or logs in
5. Login submits to `/user/login` endpoint
6. On success: Can proceed to use app

## Recent Fixes Applied

### ✅ Fixed Issues
1. **Duplicate Component Loading**
   - Removed inline loading from index.html
   - Centralized in layout.js with better error handling

2. **Inconsistent API URLs**
   - Created `config.js` with centralized API configuration
   - Updated sidebar.js, login.js, and index.js to use config

3. **Broken Navigation Links**
   - Changed from absolute paths (`/frontend/...`) to relative paths
   - Updated navbar.html links to use `./page/...`

4. **Script Path Issues**
   - Fixed sidebar.html script reference
   - Fixed all page files to load scripts from correct paths

5. **Missing CSS Paths**
   - Fixed CSS links in all page files
   - Changed from `../css/index.css` to `../../css/index.css`

6. **Missing Error Handling**
   - Added try-catch blocks to all API calls
   - Added DOM existence checks
   - Added console logging for debugging

7. **Missing Axios Library**
   - Added to index.html, login.html, and all page files

## Required Backend Endpoints

### User Management
- **POST** `/user/create` - Register new user
  - Request: `{ name, email, password }`
  - Response: User data with confirmation

- **POST** `/user/login` - Authenticate user
  - Request: `{ email, password }`
  - Response: User data with token (optional)

### Recipe Data
- **GET** `/recipe/main-ingredients` - List all ingredients
  - Response: `{ data: [{ name: "..." }, ...] }`

- **GET** `/recipe/types` - List all recipe types
  - Response: `{ data: [{ name: "..." }, ...] }`

- **POST** `/recipe/create` - Create new recipe (TO BE IMPLEMENTED)
  - Request: Form data with title, description, image, etc.

## Debugging Tips

### Console Messages
- Look for `✓ Loaded component: ...` for successful loads
- Look for `✗ Error loading component ...` for failures
- Check network tab for API call failures

### Common Issues
1. **Components not showing**: Check browser console for loading errors
2. **API errors**: Verify backend is running on `localhost:4500`
3. **CSS not loading**: Check that paths are correct relative to HTML file
4. **Sidebar empty**: Ensure `/recipe/main-ingredients` and `/recipe/types` endpoints exist

## Next Steps / TODO

- [ ] Add recipe submission handler and form validation
- [ ] Implement token-based authentication (localStorage)
- [ ] Add logout functionality
- [ ] Implement search functionality
- [ ] Add user profile page
- [ ] Add delete/edit recipe functionality
- [ ] Add commenting system
- [ ] Add image upload to S3
- [ ] Implement responsive design improvements
- [ ] Add loading spinners during API calls
- [ ] Add success/error notification system

## File Manifest

| File | Purpose | Status |
|------|---------|--------|
| config.js | API configuration | ✅ Created |
| layout.js | Component loader | ✅ Fixed |
| navbar.html | Navigation | ✅ Fixed |
| sidebar.js | Data fetching | ✅ Fixed |
| index.html | Homepage | ✅ Fixed |
| index.js | Registration handler | ✅ Fixed |
| login.html | Login page | ✅ Fixed |
| login.js | Login handler | ✅ Fixed |
| All page files | Sub-pages | ✅ Fixed |


# Frontend Quick Reference & Testing Guide

## 🚀 Quick Start

### Step 1: Start Backend
```bash
cd d:\Sharpner\Recipe_Management_Sharing_Platform\backend
node server.js
# or
nodemon server.js
```
Should show: Server running on port 4500

### Step 2: Open Frontend
```
http://localhost:5500/frontend/index.html
# (or your web server's port number)
```

### Step 3: Check Browser Console
Press `F12` → Console tab
Should see messages starting with ✓

---

## ✅ What Should Happen

### On Page Load
```
✓ Loaded component: ./components/header/header.html
✓ Loaded component: ./components/navbar/navbar.html
✓ Loaded component: ./components/recipe-form/recipe-form.html
✓ Loaded component: ./components/sidebar/sidebar.html
✓ Loaded component: ./components/footer/footer.html
✓ Main ingredients loaded
✓ Recipe types loaded
✓ Recipe form handler attached
```

### No Errors Should Appear
- No `✗` messages
- No `404` errors
- No `CORS` errors
- No `Cannot find element` messages

---

## 🧪 Test Scenarios

### Test 1: Component Loading
1. Open http://localhost:5500/frontend/index.html
2. Check Console → Should see 8 ✓ messages
3. Visual check → Should see:
   - Header with "Share Recipes" title
   - Navigation menu
   - Recipe form
   - Sidebar with ingredients
   - Footer

### Test 2: Navigation
1. Click "Share a Recipe" → Opens share-recipe.html
2. Click "Cuisines" → Opens cuisine.html
3. Click "Authors" → Opens author.html
4. Click "Search" → Opens search.html
5. Click "Links" → Opens links.html
6. Click "Home" on any page → Back to index.html

### Test 3: Registration
1. On homepage, fill registration form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
2. Click Register
3. Console should show: `✓ Registration successful`
4. Alert should appear: "Registration successful! Please log in."

### Test 4: Login
1. Go to http://localhost:5500/frontend/login/login.html
2. Fill form:
   - Email: john@example.com
   - Password: password123
3. Click Login
4. Console should show: `✓ Login successful`
5. Alert should appear: "Login successful!"

### Test 5: Recipe Form
1. Go to "Share a Recipe" page
2. Fill all fields:
   - Recipe Name: Pasta Carbonara
   - Description: Classic Italian pasta
   - Main Ingredients: Pasta, Eggs, Bacon, Cheese
   - Recipe Type: Lunch
   - Method: Boil pasta, mix with eggs...
   - Image: (optional)
3. Click "Share Recipe"
4. Console should show: `✓ Recipe created successfully` OR error message
5. Alert should appear with result

### Test 6: Sidebar Data
1. Check sidebar on any page
2. Should see:
   - Search box
   - List of ingredients (fetched from API)
   - List of recipe types (fetched from API)

---

## 🔍 Debugging Tips

### Issue: Components not showing
**Solution**: 
- Check Console for ✗ errors
- Verify backend is running
- Check file paths are correct
- Verify HTML files exist in components/ folder

### Issue: API errors (✗ Error)
**Solution**:
- Verify backend is running: `http://localhost:4500`
- Check endpoints exist in backend routes
- Check API_CONFIG in console:
  ```javascript
  console.log(API_CONFIG)
  ```

### Issue: 404 errors
**Solution**:
- Check file paths in error message
- Verify CSS path: `href="../../css/index.css"` for pages
- Verify script path: `src="../../js/layout.js"` for pages

### Issue: CORS errors
**Solution**:
- Not usually an issue if backend is on localhost:4500
- Check backend has CORS enabled
- Check origin header matches

### Issue: Form not submitting
**Solution**:
- Check Recipe form handler attached message
- Fill all required fields
- Check console for validation errors
- Verify recipe/create endpoint exists

---

## 📋 API Configuration

### API Base URL
```javascript
http://localhost:4500
```

### Available Endpoints
```javascript
// Registration
POST /user/create
{ name, email, password }

// Login
POST /user/login
{ email, password }

// Ingredients
GET /recipe/main-ingredients
Response: { data: [{ name: "..." }, ...] }

// Recipe Types
GET /recipe/types
Response: { data: [{ name: "..." }, ...] }

// Create Recipe
POST /recipe/create
{ title, description, mainIngredients, recipeType, method, file }
```

### To Use Different API URL
Edit `frontend/js/config.js`:
```javascript
const API_CONFIG = {
  BASE_URL: "http://your-new-url:port",  // Change this
  ENDPOINTS: { /* ... */ }
};
```

---

## 🛠️ Common Tasks

### Add New API Endpoint
1. Add to `frontend/js/config.js` ENDPOINTS
2. Update any handlers using it
3. Example:
   ```javascript
   ENDPOINTS: {
     USER_CREATE: "/user/create",
     NEW_ENDPOINT: "/path/to/endpoint",  // Add here
   }
   ```
4. Use: `getApiUrl("NEW_ENDPOINT")`

### Add New Page
1. Create `frontend/page/mypage/mypage.html`
2. Copy structure from existing page
3. Make sure paths are relative: `../../css/index.css`, `../../js/layout.js`
4. Add link to navbar.html: `href="./page/mypage/mypage.html"`

### Update Component
1. Edit HTML file in `frontend/components/`
2. Component loads automatically via layout.js
3. Add any scripts in corresponding .js file

### Modify Styling
Edit `frontend/css/index.css` - applies to all pages

---

## 📊 File Structure Summary

```
frontend/
├── index.html ...................... Homepage
├── index.js ........................ Registration handler
├── login/
│   ├── login.html .................. Login page
│   └── login.js .................... Login handler
├── css/
│   └── index.css ................... Styles
├── js/
│   ├── config.js ................... API configuration
│   ├── layout.js ................... Component loader
│   └── recipe-handler.js ........... Recipe form handler
├── components/
│   ├── header/header.html
│   ├── navbar/navbar.html
│   ├── recipe-form/recipe-form.html
│   ├── sidebar/
│   │   ├── sidebar.html
│   │   └── sidebar.js
│   └── footer/footer.html
└── page/
    ├── share-recipe/share-recipe.html
    ├── cuisines/cuisine.html
    ├── authors/author.html
    ├── search/search.html
    └── links/links.html
```

---

## ⚠️ Important Notes

1. **Backend Must Be Running**: Ensure backend is on port 4500
2. **Paths Are Relative**: Don't use absolute paths like `/frontend/`
3. **Check Console**: Always check browser console for errors
4. **API Endpoints**: Must match between frontend config and backend routes
5. **File Uploads**: Recipe form includes file upload, ensure backend handles multipart/form-data

---

## 🔗 Related Documentation

- Full workflow: See `FRONTEND_WORKFLOW.md`
- All fixes applied: See `FRONTEND_FIXES_SUMMARY.md`
- Backend routes: Check `backend/routes/`

---

## ✨ Summary

All frontend components are now:
✅ Properly loading  
✅ Error handling in place  
✅ Using centralized API config  
✅ Correctly styled  
✅ Ready for testing  

Just start the backend and open in browser!


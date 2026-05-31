# Food Calories Tracker

Food Calories Tracker is a full-stack web application for searching foods from a nutrition dataset and calculating calories, macros, minerals, and other nutrition values based on the number of grams entered by the user.

The app uses the **MyFoodData / USDA Nutrition Facts dataset** and allows users to browse foods, filter by food category, search by product name, and calculate nutrition values for custom gram amounts.

---

## Features

- Search foods by name
- Browse foods by category
- Category menu based on the dataset's `Food Group` column
- View nutrition information per 100g
- Enter grams and calculate:
  - Calories
  - Protein
  - Fat
  - Carbohydrates
  - Sugars
  - Fiber
  - Cholesterol
  - Saturated fats
  - Sodium
  - Calcium
  - Iron
  - Potassium
  - Magnesium
- SQLite database storage
- Excel dataset import script
- REST API backend
- React frontend
- Responsive modern UI

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js
- SQLite
- xlsx
- cors
- dotenv
- nodemon

### Database

- SQLite

### Dataset

- MyFoodData Nutrition Facts Spreadsheet
- USDA-based nutrition data

---

## Project Structure

```text
FoodCaloriesTracker/
│
├── backend/
│   ├── data/
│   │   ├── .gitkeep
│   │   └── MyFoodData-Nutrition-Facts-SpreadSheet-Release-1-4.xlsx
│   │
│   ├── database/
│   │   ├── .gitkeep
│   │   └── foods.db
│   │
│   ├── scripts/
│   │   ├── importExcel.js
│   │   └── debugExcel.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── foodsApi.js
│   │   │
│   │   ├── components/
│   │   │   ├── FoodCard.jsx
│   │   │   └── FoodList.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
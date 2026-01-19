# Foodi3

Foodi3 is a modern web application for discovering food recipes and cocktails. It allows users to search, browse, and eventually save their favourite meals and drinks, with a focus on clean UX, performance, and scalability.

This project is currently in its early development phase. The initial focus is on setting up a solid technical foundation and implementing recipe and cocktail search and listings.

---

## Tech Stack

* **Next.js** (App Router, SSR)
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Redux Toolkit** (state management)
* **Appwrite** (authentication, database – planned)

### External APIs

* [TheMealDB](https://www.themealdb.com/api.php) – meal and recipe data
* [TheCocktailDB](https://www.thecocktaildb.com/api.php) – cocktail and drink data

---

## Planned Features

* Search meals and cocktails
* View recipe and cocktail details
* User authentication (Appwrite)
* Save favourite recipes and drinks
* Create custom user recipes

---

## Project Structure

```
src/
├── app/            # Next.js App Router pages
├── components/     # Reusable UI components
├── services/       # API and service clients
├── store/          # Redux store and slices
├── types/          # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

* Node.js (18+ recommended)
* npm or yarn

### Installation

```bash
git clone https://github.com/goncalofm90/foodi3.git
cd foodi3
npm install
```

### Development

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## Status

🚧 **Work in progress** – core setup and search functionality under active development. Obviously the UX/UI is also very placeholder. That is the last thing I'll work on probably.

---

## License

This project is for personal and educational use. API data is provided by TheMealDB and TheCocktailDB.

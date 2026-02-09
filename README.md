# Foodi3

Foodi3 is a modern web application for discovering food recipes and cocktails. It allows users to search, browse, and save their favourite meals and drinks, with a focus on clean UX, performance, and scalability.

---

## Tech Stack

* **Next.js** (App Router, SSR)
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Appwrite** (authentication, database )

### External APIs

* [TheMealDB](https://www.themealdb.com/api.php) – meal and recipe data
* [TheCocktailDB](https://www.thecocktaildb.com/api.php) – cocktail and drink data

---

## Planned Features

* Search meals and cocktails - ✅ 
* View recipe and cocktail details - ✅ 
* User authentication and google auth (Appwrite) - ✅ 
* Save favourite recipes and drinks - ✅
* Create/manage custom user recipes - not in MVP

---

## Project Structure

```
src/
├── app/            # Next.js App Router pages
├── components/     # Reusable UI components
├── services/       # API and service clients
├── types/          # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

* Node.js (version 20+)
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

🚧 **MVP Done** – core setup and search functionality developed as well as UX/UI  . Custom recipe creation and management might be worked on eventually .

---

## License

This project is for personal and educational use. API data is provided by TheMealDB and TheCocktailDB.

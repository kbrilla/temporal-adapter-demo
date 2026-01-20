# Temporal Adapter Demo

This project demonstrates the **Angular Material Temporal Date Adapter**, which allows using the [TC39 Temporal API](https://tc39.es/proposal-temporal/docs/index.html) (`Temporal.PlainDate`, etc.) with Angular Material components (`mat-datepicker`, `mat-date-range-picker`).

## 🚀 Live Demo

**[View Storybook Deployment](https://kbrilla.github.io/temporal-adapter-demo/)**

## ✨ Features Demonstrated

*   **Custom Calendars**: Full support for non-Gregorian calendars powered by the `temporal-polyfill`, including:
    *   **Japanese** (with Era support, e.g., Reiwa 令和)
    *   **Hebrew**
    *   **Chinese** (Lunisolar with leap months like "Sixth Monthbis")
    *   **Ethiopic** (13 months)
    *   **Persian** (Jalaali)
    *   **Buddhist**, **Indian**, **Coptic**, **Islamic**
*   **Dual-Calendar Pattern**:
    *   **Storage**: Keep dates in ISO-8601 (e.g., `2026-01-20`) for backend compatibility (`calendar: 'iso8601'`).
    *   **Display**: Show dates in the user's preferred locale and calendar (e.g., "Jan 8 Reiwa") using `outputCalendar`.
*   **Temporal API Integration**: Native support for `Temporal.PlainDate`, `Temporal.PlainDateTime`, and `Temporal.ZonedDateTime`.

## 🛠️ Development

### Prerequisites

*   Node.js 20+
*   pnpm 9+

### Setup

```bash
pnpm install
```

### Running the Demo

To run the full Angular application:

```bash
pnpm start
# or
npx nx serve temporal-adapter-demo
```

To run the **Storybook** (recommended for exploring the components and calendar matrix):

```bash
pnpm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

### Building

To build the Storybook for deployment:

```bash
pnpm run build-storybook
```

## 🧪 Matrix Testing

This repository includes a comprehensive **Matrix Test Suite** in Storybook that validates:
*   **10+ Calendar systems**
*   **3 Modes**: `PlainDate`, `PlainDateTime`, `ZonedDateTime`
*   **Output Calendar Transformations**: Verifies that dates calculated in one calendar (e.g., ISO) can be correctly formatted and displayed in another (e.g., Japanese).

## Project Structure

*   `src/app/demos`: Contains the individual demo components and their Storybook stories.
*   `vendor`: Contains the local build of the `angular-material-temporal-adapter` package.
*   `.github/workflows`: CI/CD configuration for deploying Storybook to GitHub Pages.

---
This project was generated using [Nx](https://nx.dev).

# Invoice Management App

A fully functional, responsive Invoice Management Application built with **React 19** and **Vite**. Features complete CRUD operations, status filtering, light/dark theme support, and a pixel-perfect UI matching the provided design system specifications.

## 🚀 Setup Instructions

1. **Prerequisites**: Make sure you have Node.js installed.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 🏗 Architecture Explanation

The application follows a streamlined, component-driven architecture:

- **State Management**: Built entirely on React Context API (`InvoiceContext`, `ThemeContext`). This avoids the overhead of external libraries like Redux.
- **Persistence**: Data is saved locally using a custom `useLocalStorage` hook. All invoices and theme preferences remain across browser reloads.
- **Routing**: Because the app essentially consists of two main views ("List" and "Detail"), routing is managed locally within `App.jsx` using state (`currentView` and `selectedInvoiceId`). This removes the need for `react-router-dom`, keeping the bundle small.
- **Styling**: Vanilla CSS utilizing CSS Custom Properties (Variables) and BEM methodology. Theme switching (Light/Dark) is achieved instantly by switching CSS variables at the `:root` level based on a `[data-theme]` attribute.

## ⚖️ Trade-offs

During development, several technical trade-offs were made to balance speed, simplicity, and performance:

- **Context API vs. Redux**: For an app of this size, Redux or Zustand would introduce unnecessary boilerplate. Context API provides sufficient performance and makes the overall logic easier to read.
- **State-based Routing vs. React Router**: Bypassing a dedicated router makes deep-linking to a specific invoice harder (e.g. you can't bookmark `url.com/invoice/RT3080`). This was traded for a much simpler, dependency-free application core. Adding an external router would be the number one priority if the app scaled.
- **Vanilla CSS vs. Tailwind / CSS-in-JS**: Chose Vanilla CSS to strictly follow the provided build instructions from HNG Mentors and exact visual specifications without relying on utility classes or runtime CSS processing.

## ♿ Accessibility Notes

Accessibility was prioritized to ensure the app is usable by everyone:

- **Keyboard Navigation**: Implemented keyboard event listeners for all interactive components. Users can use `Escape` to close the sliding form panel, the filter dropdown, and the delete confirmation modal. `Enter` and Spacebar can interact with custom dropdown items.
- **Modal Focus Trapping**: The `<DeleteModal />` traps keyboard focus inside itself while open, preventing users from tabbing outside the dialog. Focus is returned securely when the modal closes.
- **Semantic HTML & ARIA**: Extensive use of `aria-expanded`, `aria-label`, `aria-hidden`, and `role="dialog"` throughout the app. Visually hidden labels are provided for screen readers, and decorative SVG icons are marked `aria-hidden="true"`.
- **Color Contrast**: Maintained the high legibility of the Design System's colors.

## ✨ Improvements Beyond Requirements

To create a truly premium experience, several enhancements were added:

1. **Enhanced Invoice Date UX**: When creating a "New Invoice", the design system had the Date field default to a muted date and only changes when the user selects, rather than auto-filling with the current date. This was changed to auto-fill with the current date to make it more user-friendly; This forces intentional selection and prevents mistaken date submissions. The placeholder styling seamlessly transitions back to primary text once a date is chosen.
2. **Fully Custom Form Controls**: Instead of relying on native, unstylable `<input type="date">` and `<select>` elements (which look vastly different on Windows, macOS, iOS, and Android), fully custom React components (`<CustomDatePicker />` and `<CustomSelect />`) were engineered from scratch. They look exactly like the design specs across all platforms.
3. **Micro-Interactions**: Added smooth CSS animations, such as `panelSlideIn` for the invoice form, `overlayFadeIn` for background modals, and dynamic hover states on buttons and list rows to make the application feel reactive and modern.

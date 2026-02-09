/**
 * Main App Component
 * Sets up routing and context providers
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerProvider, BarberProvider } from './context';
import { ErrorBoundary, ToastContainer } from './components';
import { WelcomePage, QueuePage, SlotsPage, DashboardPage } from './pages';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <BarberProvider>
          <CustomerProvider>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/queue" element={<QueuePage />} />
              <Route path="/slots" element={<SlotsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
            <ToastContainer />
          </CustomerProvider>
        </BarberProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

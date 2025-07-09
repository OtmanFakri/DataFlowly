import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {LandingPage} from "./pages/LandingPage.tsx";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import {DashboardPage} from "./pages/DashboardPage.tsx";
import {BuyPointsPage} from "./pages/BuyPointsPage.tsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.tsx";
import AuthGuard from "./components/AuthGuard.tsx";
import TermsConditions from "./pages/TermsConditions.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/app/:id" element={<App/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/buy-points" element={<BuyPointsPage/>}/>
                <Route path="/terms" element={<TermsConditions/>}/>
                <Route path="/success" element={
                    <AuthGuard>
                        <PaymentSuccessPage/>
                    </AuthGuard>
                }/>
                {/* Add more routes here as needed */}
            </Routes>
        </BrowserRouter>
    </StrictMode>
);

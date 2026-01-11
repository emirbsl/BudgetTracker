import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages (We will create these next)
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Dashboard from './pages/dashboard/Dashboard'
import Transactions from './pages/transactions/Transactions' // List
import AddTransaction from './pages/transactions/AddTransaction' // Form
import Subscriptions from './pages/subscriptions/Subscriptions'
import Budgets from './pages/budgets/Budgets'
import Analytics from './pages/analytics/Analytics'
import Savings from './pages/savings/Savings'
import Split from './pages/split/Split'
import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/transactions/add" element={<AddTransaction />} />
                            <Route path="/subscriptions" element={<Subscriptions />} />
                            <Route path="/budgets" element={<Budgets />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/savings" element={<Savings />} />
                            <Route path="/split" element={<Split />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App

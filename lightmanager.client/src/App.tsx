import { Route } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
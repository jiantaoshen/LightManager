import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import KanbanBoard from './pages/kanbanboard';
import IntroPage from './pages/intro';
import Profile from './pages/profile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/projects/:projectId" element={<KanbanBoard />}/>
                    <Route path="/" element={<IntroPage />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
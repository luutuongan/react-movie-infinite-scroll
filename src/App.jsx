import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Home from './components/MovieList/MovieList';

function App() {
  return (
    <TaskProvider>
      <Router>
        <nav className="p-4 bg-gray-800 text-white flex gap-4">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/about" className="hover:text-blue-400">About</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div className="p-10 text-center">Version 1.0 - Created with React & Vite</div>} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
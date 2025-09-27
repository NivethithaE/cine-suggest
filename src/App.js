import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import SearchPage from './pages/Searchpage';
import Result from './pages/result';
import ExplorePage from './pages/Explorepage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header /> {/* ✅ USE IT */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/result/:query" element={<Result />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
      <Footer /> {/* ✅ USE IT */}
    </Router>
  );
}

export default App;

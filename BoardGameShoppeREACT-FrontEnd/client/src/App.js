import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from 'react-router-dom'
import AllGames from "./components/AllGames"
import ShoppingCart from "./components/ShoppingCart"
import GameDetail from './components/GameDetail';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import SearchResult from './components/SearchResult'
import Category from './components/Category';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/store" element={<AllGames />} />
        <Route path="/shop" element={<ShoppingCart />} />
        <Route path="/details/:id" element={<GameDetail />} />
        <Route path="/search/:searchValue" element={<SearchResult />} />
        <Route path="/categories/:category" element={<Category />} />
      </Routes>
    </div>
  );
}

export default App;

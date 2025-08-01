import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './layout/Dashboard';
import Dash from './pages/dash';

function App() {
  return (
    <Router>
      <Dashboard>
        <Routes>
          <Route path="/" element={<Dash />} />
        </Routes>
      </Dashboard>
    </Router>
  );
}

export default App;

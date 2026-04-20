import { Navigate, Route, Routes } from 'react-router-dom';
import ResourcesPage from './pages/resources/ResourcesPage';
import CreateResourcePage from './pages/resources/CreateResourcePage';
import EditResourcePage from './pages/resources/EditResourcePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/resources" replace />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/create" element={<CreateResourcePage />} />
      <Route path="/resources/edit/:id" element={<EditResourcePage />} />
    </Routes>
  );
}

export default App;
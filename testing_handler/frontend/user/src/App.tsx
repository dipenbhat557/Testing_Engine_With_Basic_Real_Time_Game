import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SignInPage from './pages/SigninPage';
import ProtectedRoute from './components/ProtectedRoute';
import TestUploadPage from './pages/TestUploadPage';
import TestsListPage from './pages/TestListPage';
import TestResultsPage from './pages/TestResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectListPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/signin" element={<SignInPage/>}/> 
        <Route path='/test-upload' element={<ProtectedRoute><TestUploadPage/></ProtectedRoute>}/>
        <Route path="/tests" element={<ProtectedRoute><TestsListPage/></ProtectedRoute>}/>
        <Route path='/test-results' element={<ProtectedRoute><TestResultsPage/></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;

import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; 

function App() {
  return (
    <>
      <Layout />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

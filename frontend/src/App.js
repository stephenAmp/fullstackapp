import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from "./components/Login";
import './App.css';
import AddTodo from "./components/AddTodo";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';


export default function App(){
    return(
<Router>
  <Routes>
    <Route path='/login/' element={<Login />} />
    <Route path='/activities/' element={<ProtectedRoute><AddTodo/></ProtectedRoute>}/>
    <Route path='/' element={<SignUp />} />
  </Routes>
</Router>
    )
}
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";

function App() {
  return(
    <div>
       <Navbar/>

       <div className="app-layout">
        <Sidebar/>
        <Dashboard/>
       </div>

    </div>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastProvider } from './components/Toast/ToastProvider';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastProvider>
      <Navigation/>
      <main>
        <Outlet/>
      </main>
      </ToastProvider>
    </>
  );
};

export default App;
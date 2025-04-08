import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "../src/styles/override.scss"
import GlobalRouter from "./routes/globalRouter";
import ProtectedRouter from "./routes/protectedRouter";
import store from "./redux/store";
import { Provider } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalRouter />
        <ProtectedRouter />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "../src/styles/override.scss"
import GlobalRouter from "./routes/globalRouter";
import ProtectedRouter from "./routes/protectedRouter";

function App() {
  return (
    <BrowserRouter>
      <GlobalRouter />
      <ProtectedRouter/>
    </BrowserRouter>
  );
}

export default App;

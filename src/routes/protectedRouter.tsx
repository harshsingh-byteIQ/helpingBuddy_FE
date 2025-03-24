import { Route, Routes } from "react-router-dom";
import { proctectedRoutes } from "./routes";
import ProtectedLayout from "../layouts/ProtectedLayout";


const ProtectedRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedLayout></ProtectedLayout>}>
        {proctectedRoutes?.map(({ path, element }) => (
          <Route path={path} element={<>{element}</>} key={path} />
        ))}
      </Route>
    </Routes>
  );
};

export default ProtectedRouter;

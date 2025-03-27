import { useNavigate } from "react-router-dom";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goTo = (path: string, state?: object, replace: boolean = false) => {
    navigate(path, { state, replace });
  };

  return { goTo };
};

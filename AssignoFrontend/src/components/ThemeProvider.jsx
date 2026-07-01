import { useEffect } from "react";

import {
  useAppDispatch,
  useAppSelector
} from "../app/reduxHooks";

import {
  setTheme
} from "../features/theme/themeSlice";

const ThemeProvider = ({ children }) => {

  const dispatch = useAppDispatch();

  const { mode } = useAppSelector(
    (state) => state.theme
  );

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme) {

      dispatch(setTheme(savedTheme));

    } else {

      const systemDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

      dispatch(
        setTheme(
          systemDark
            ? "dark"
            : "light"
        )
      );

    }

  }, [dispatch]);

  useEffect(() => {

    const root =
      document.documentElement;

    if (mode === "dark") {

      root.classList.add("dark");

    } else {

      root.classList.remove("dark");

    }

    localStorage.setItem(
      "theme",
      mode
    );

  }, [mode]);

  useEffect(() => {

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemTheme = (
      e
    ) => {

      const savedTheme =
        localStorage.getItem("theme");

      if (!savedTheme) {

        dispatch(
          setTheme(
            e.matches
              ? "dark"
              : "light"
          )
        );

      }

    };

    mediaQuery.addEventListener(
      "change",
      handleSystemTheme
    );

    return () => {

      mediaQuery.removeEventListener(
        "change",
        handleSystemTheme
      );

    };

  }, [dispatch]);

  return <>{children}</>;
};

export default ThemeProvider;
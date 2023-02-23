import en from "@i18n/en.json";
import ru from "@i18n/ru.json";
import i18next, { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import React from "react";
import { render } from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

const app = (
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

render(app, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./App.module.css";

function App() {
	const { t } = useTranslation();

	return (
		<div>
			<h1 className={styles.title}>{t("app.example.title")}</h1>
		</div>
	);
}

export default App;

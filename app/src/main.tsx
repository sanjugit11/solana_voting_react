import React from "react"
import ReactDOM from "react-dom/client"
import { Providers } from "@/context/index.tsx"
import App from "./App.tsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Providers>
			<App />
		</Providers>
	</React.StrictMode>
)

import "../lib/oprc.server";

import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./SessionProvider";

export const metadata: Metadata = {
	title: "Regras do GPMecatrônica",
	description: "Aplicativo de gerenciamento de cards do GPMecatrônica",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}

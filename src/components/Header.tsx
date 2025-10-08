"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface HeaderProps {
	onAddCard: () => void;
	session: Session | null;
}

const navLinks = [
	{ href: "/warnings", label: "Avisos" },
	{ href: "/rules", label: "Regras" },
	{ href: "/", label: "Links" },
];

export function Header({ onAddCard, session }: HeaderProps) {
	const pathname = usePathname();
	return (
		<header className="sticky top-0 z-10 bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-sm">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div className="flex items-center gap-8">
					<h1 className="text-2xl font-bold text-primary">
						GPMecatrônica - Cards
					</h1>
					<nav className="flex items-center gap-4">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={
									pathname === link.href
										? "text-primary"
										: "text-muted-foreground hover:text-primary"
								}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-4">
					{session ? (
						<>
							{session.user?.role === "ADMIN" && (
								<Button onClick={onAddCard}>
									<Plus className="w-4 h-4 mr-2" />
									Adicionar Card
								</Button>
							)}
							<Button onClick={() => signOut()}>Logout</Button>
						</>
					) : (
						<Button onClick={() => signIn()}>Login</Button>
					)}
				</div>
			</div>
		</header>
	);
}

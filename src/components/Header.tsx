"use client";

import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-10 bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-sm">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div className="flex items-center gap-8">
					<h1 className="hidden md:block text-2xl font-bold text-primary">
						GPMecatrônica - Cards
					</h1>
					<nav className="hidden md:flex items-center gap-4">
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
									<Plus className="w-4 h-4 md:mr-2" />
									<span className="hidden md:inline">Adicionar Card</span>
								</Button>
							)}
							<Button onClick={() => signOut()}>Logout</Button>
						</>
					) : (
						<Button onClick={() => signIn()}>Login</Button>
					)}
					<div className="md:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setIsMenuOpen(!isMenuOpen)}
								>
									<Menu className="h-6 w-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="mr-4">
								{navLinks.map((link) => (
									<DropdownMenuItem key={link.href} asChild>
										<Link href={link.href}>{link.label}</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}

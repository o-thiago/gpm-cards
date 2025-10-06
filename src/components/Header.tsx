import { Plus } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
	onAddCard: () => void;
	session: Session | null;
}

export function Header({ onAddCard, session }: HeaderProps) {
	return (
		<header className="sticky top-0 z-10 bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-sm">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div className="flex items-center gap-8">
					<h1 className="text-2xl font-bold text-primary">
						GPMecatrônica - Cards
					</h1>
					<nav className="flex items-center gap-4">
						<Link
							href="/warnings"
							className="text-muted-foreground hover:text-primary"
						>
							Avisos
						</Link>
						<Link
							href="/rules"
							className="text-muted-foreground hover:text-primary"
						>
							Regras
						</Link>
						<Link href="/" className="text-muted-foreground hover:text-primary">
							Links
						</Link>
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

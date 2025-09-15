import { Plus } from "lucide-react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
	onAddCard: () => void;
	session: Session | null;
}

export function Header({ onAddCard, session }: HeaderProps) {
	return (
		<header className="bg-card shadow-sm border-b">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold text-primary">
					GPMecatrônica - Cards
				</h1>
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

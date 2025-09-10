"use client";

import type { ValidationError } from "joi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { client } from "@/lib/orpc";
import { signupSchema } from "@/lib/validators";

function isValidationError(error: unknown): error is ValidationError {
	const err = error as ValidationError;
	return err?.isJoi === true && Array.isArray(err.details);
}

function getErrorMessage(error: unknown): string {
	if (isValidationError(error)) {
		const { details } = error;
		const [detail] = details;
		if (detail.path.includes("password")) {
			return `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.`;
		}
		if (detail.path.includes("email")) {
			return "Por favor, insira um e-mail válido.";
		}
		return "Por favor, preencha todos os campos corretamente.";
	}

	return "Ocorreu um erro inesperado.";
}

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const { error: validationError } = signupSchema.validate({
			name,
			email,
			password,
		});

		if (validationError) {
			setError(getErrorMessage(validationError));
			return;
		}

		try {
			await client.auth.signup({ name, email, password });
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
				return;
			}
		}

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (result?.ok) {
			router.push("/");
		} else {
			setError("Credenciais inválidas. Verifique seu e-mail e senha.");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Criar Conta</CardTitle>
					<CardDescription>
						Digite suas informações abaixo para criar sua conta.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="grid gap-4 m-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Nome</Label>
							<Input
								id="name"
								type="text"
								placeholder="Seu Nome"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">E-mail</Label>
							<Input
								id="email"
								type="email"
								placeholder="email@exemplo.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<p className="text-sm text-muted-foreground">
								A senha deve ter no mínimo {PASSWORD_MIN_LENGTH} caracteres.
							</p>
						</div>
						{error && <p className="text-red-500 text-sm">{error}</p>}
					</CardContent>
					<CardFooter className="flex flex-col gap-4">
						<Button type="submit" className="w-full">
							Criar Conta
						</Button>
						<div className="text-center text-sm">
							Já tem uma conta?{" "}
							<Link href="/login" className="underline">
								Entrar
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

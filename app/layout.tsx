import type { Metadata } from "next";
import { ClerkProvider, SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import "@/styles/dashboard.css";

export const metadata: Metadata = {
  title: "LinkedIn AI Idea Bank",
  description: "Encontre e organize ideias de conteúdo de IA para LinkedIn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body>
          <header className="top-nav" style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            padding: '1rem 2rem', 
            background: '#fff', 
            borderBottom: '1px solid #eee' 
          }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary">Entrar</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

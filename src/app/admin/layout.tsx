import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';
import { adminAuth } from '@/lib/firebase-admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('hooke-admin-token')?.value || cookieStore.get('__session')?.value;
    
    // Se não há token no cookie, redireciona para login
    if (!token) {
        redirect('/login');
    }
    
    // Decodifica o token usando o Firebase Admin no servidor para obter os dados do usuário.
    // Isso remove totalmente a necessidade de carregar o SDK Client do Firebase e o "onAuthStateChanged" no layout,
    // garantindo renderização SSR instantânea sem spinners.
    let email = "admin@hooke.com.br";
    
    if (adminAuth) {
        try {
            const decoded = await adminAuth.verifyIdToken(token);
            email = decoded.email || email;
        } catch (e) {
            console.error("Token inválido no SSR, redirecionando para login.");
            redirect('/login');
        }
    }

    return (
        <AdminLayoutClient userEmail={email}>
            {children}
        </AdminLayoutClient>
    );
}

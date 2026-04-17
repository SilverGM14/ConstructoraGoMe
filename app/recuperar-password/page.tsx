'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Se ha enviado un enlace de recuperación a tu correo.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h1>
        {message && (
          <div className={`p-3 mb-4 text-sm ${message.type === 'success' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Email</label>
            <input type="email" required className="input-cyber" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          <Link href="/login" className="text-accent hover:underline">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}

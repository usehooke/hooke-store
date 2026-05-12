"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Lock, RefreshCw, FileJson, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function AdminConfigPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'backup' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Placeholder para salvar configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    try {
      toast.success('Exportação iniciada. Verifique seus downloads.');
    } catch (error) {
      toast.error('Erro ao exportar dados');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Toaster position="bottom-right" theme="light" richColors />
      
      {/* Header */}
      <header className="border-b-2 border-black p-8">
        <Link href="/admin" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-xs font-bold tracking-widest mb-6">
          <ArrowLeft size={14} /> Voltar ao Dashboard
        </Link>
        <h1 className="text-4xl font-black tracking-tighter mb-2">Configurações do Sistema</h1>
        <p className="text-zinc-500 text-sm">Gerencie preferências, integrações e backup de dados.</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex border-b-2 border-black sticky top-0 bg-white z-40">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 ${
            activeTab === 'general' 
              ? 'border-black text-black' 
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          Geral
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 ${
            activeTab === 'integrations' 
              ? 'border-black text-black' 
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          Integrações
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 ${
            activeTab === 'backup' 
              ? 'border-black text-black' 
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          Backup
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 ${
            activeTab === 'security' 
              ? 'border-black text-black' 
              : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          Segurança
        </button>
      </div>

      {/* Content */}
      <main className="p-8 md:p-16 max-w-4xl mx-auto">
        
        {/* GERAL */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <section className="border-2 border-black p-8 bg-zinc-50">
              <h2 className="text-lg font-black tracking-tighter mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                Informações da Loja
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="store-name" className="block text-xs font-black uppercase tracking-widest mb-2">Nome da Loja</label>
                  <input 
                    id="store-name"
                    type="text" 
                    defaultValue="Hooke Store" 
                    className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-yellow-100"
                  />
                </div>
                <div>
                  <label htmlFor="store-email" className="block text-xs font-black uppercase tracking-widest mb-2">Email de Contato</label>
                  <input 
                    id="store-email"
                    type="email" 
                    defaultValue="contato@hooke.store" 
                    className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-yellow-100"
                  />
                </div>
                <div>
                  <label htmlFor="store-phone" className="block text-xs font-black uppercase tracking-widest mb-2">Telefone</label>
                  <input 
                    id="store-phone"
                    type="tel" 
                    placeholder="+55 (11) 99999-9999" 
                    className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-yellow-100"
                  />
                </div>
              </div>
            </section>

            <section className="border-2 border-black p-8 bg-zinc-50">
              <h2 className="text-lg font-black tracking-tighter mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                Preferências
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-black/10 hover:bg-black/5 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-bold">Notificações por Email</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-black/10 hover:bg-black/5 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-bold">Modo Dark no Dashboard</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-black/10 hover:bg-black/5 transition-colors">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm font-bold">Analytics Avançado</span>
                </label>
              </div>
            </section>
          </div>
        )}

        {/* INTEGRAÇÕES */}
        {activeTab === 'integrations' && (
          <div className="space-y-8">
            <section className="border-2 border-black p-8 bg-zinc-50">
              <h2 className="text-lg font-black tracking-tighter mb-6">Firebase</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-black/10 bg-white">
                  <div>
                    <p className="font-bold text-sm">Status de Conexão</p>
                    <p className="text-xs text-zinc-500">Firestore • Realtime Database</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-500 rounded-none text-xs font-black text-green-900">
                    <CheckCircle2 size={14} />
                    Conectado
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 border-black p-8 bg-zinc-50">
              <h2 className="text-lg font-black tracking-tighter mb-6">Integrações Disponíveis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black p-4 bg-white hover:bg-zinc-50 transition-colors">
                  <p className="font-bold text-sm mb-2">Tiny ERP</p>
                  <p className="text-xs text-zinc-500 mb-4">Sincronizar pedidos e inventário</p>
                  <button className="bg-black text-white px-4 py-2 text-xs font-black tracking-widest hover:bg-zinc-800">
                    Conectar
                  </button>
                </div>
                <div className="border-2 border-black p-4 bg-white hover:bg-zinc-50 transition-colors">
                  <p className="font-bold text-sm mb-2">Stripe</p>
                  <p className="text-xs text-zinc-500 mb-4">Processamento de pagamentos</p>
                  <button className="bg-black text-white px-4 py-2 text-xs font-black tracking-widest hover:bg-zinc-800">
                    Conectar
                  </button>
                </div>
                <div className="border-2 border-black p-4 bg-white hover:bg-zinc-50 transition-colors opacity-50">
                  <p className="font-bold text-sm mb-2">Shopify</p>
                  <p className="text-xs text-zinc-500 mb-4">Sincronizar loja online</p>
                  <button disabled className="bg-zinc-300 text-zinc-500 px-4 py-2 text-xs font-black tracking-widest cursor-not-allowed">
                    Em breve
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* BACKUP */}
        {activeTab === 'backup' && (
          <div className="space-y-8">
            <section className="border-2 border-black p-8 bg-blue-50">
              <div className="flex items-start gap-4 mb-6">
                <Database size={24} className="text-blue-900 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-black tracking-tighter">Fazer Backup de Dados</h2>
                  <p className="text-xs text-zinc-600 mt-1">Exportar todos os dados da loja em JSON</p>
                </div>
              </div>
              <button 
                onClick={handleExportData}
                className="bg-blue-900 text-white px-6 py-3 text-xs font-black tracking-widest hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <FileJson size={14} />
                Exportar Agora
              </button>
            </section>

            <section className="border-2 border-black p-8 bg-yellow-50">
              <div className="flex items-start gap-4">
                <AlertTriangle size={24} className="text-yellow-900 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-black tracking-tighter">Restaurar Backup</h2>
                  <p className="text-xs text-zinc-600 mt-1">Importar dados de um arquivo JSON (use com cuidado!)</p>
                  <label htmlFor="backup-file" className="block text-xs font-black uppercase tracking-widest mt-4 mb-2">Selecione arquivo JSON</label>
                  <input 
                    id="backup-file"
                    type="file" 
                    accept=".json" 
                    className="border-2 border-yellow-900 p-3 w-full text-xs"
                    aria-label="Upload de arquivo de backup em JSON"
                  />
                </div>
              </div>
            </section>

            <section className="border-2 border-black p-8">
              <h2 className="text-lg font-black tracking-tighter mb-4">Histórico de Backups</h2>
              <p className="text-xs text-zinc-500">Nenhum backup realizado ainda.</p>
            </section>
          </div>
        )}

        {/* SEGURANÇA */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <section className="border-2 border-black p-8 bg-red-50">
              <div className="flex items-start gap-4 mb-6">
                <Lock size={24} className="text-red-900 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-black tracking-tighter">Alterar Senha</h2>
                  <p className="text-xs text-zinc-600 mt-1">Atualize sua senha de acesso ao admin</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="current-pwd" className="block text-xs font-black uppercase tracking-widest mb-2">Senha Atual</label>
                  <input 
                    id="current-pwd"
                    type="password" 
                    className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-red-100"
                  />
                </div>
                <div>
                  <label htmlFor="new-pwd" className="block text-xs font-black uppercase tracking-widest mb-2">Nova Senha</label>
                  <input 
                    id="new-pwd"
                    type="password" 
                    className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-red-100"
                  />
                </div>
                <button className="bg-red-900 text-white px-6 py-3 text-xs font-black tracking-widest hover:bg-red-800 transition-colors">
                  Atualizar Senha
                </button>
              </div>
            </section>

            <section className="border-2 border-black p-8">
              <h2 className="text-lg font-black tracking-tighter mb-4">Permissões & Roles</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-black/10 bg-white">
                  <span className="text-sm font-bold">Admin</span>
                  <span className="text-xs bg-black text-white px-3 py-1">Você</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-4">Gerenciar usuários e permissões em breve.</p>
            </section>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-6 md:p-8 flex justify-end gap-4 z-50">
        <Link 
          href="/admin" 
          className="px-6 py-3 border-2 border-black text-xs font-black tracking-widest hover:bg-zinc-100 transition-colors"
        >
          Cancelar
        </Link>
        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="px-6 py-3 bg-black text-white text-xs font-black tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : null}
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}

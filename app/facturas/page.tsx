'use client'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Building2, Calendar, DollarSign, FileText, CheckCircle, XCircle,Printer } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'

type Factura = {
  id: number
  obraid: number | null
  numero_factura: string | null
  fecha: string
  monto: number
  concepto: string
  estado: string
  fecha_pago: string | null
  obras?: { nombre: string } | null
}

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pagadas: 0, pendientes: 0, totalMonto: 0 })

  useEffect(() => {
    cargarFacturas()
  }, [])

  const cargarFacturas = async () => {
    const { data, error } = await supabase
      .from('facturas')
      .select('*, obras(nombre)')
      .order('fecha', { ascending: false })

    if (!error && data) {
      setFacturas(data as Factura[])
      const pagadas = data.filter(f => f.estado === 'Pagada')
      const pendientes = data.filter(f => f.estado === 'Pendiente')
      setStats({
        total: data.length,
        pagadas: pagadas.length,
        pendientes: pendientes.length,
        totalMonto: data.reduce((sum, f) => sum + f.monto, 0)
      })
    }
    setLoading(false)
  }

  const cambiarEstado = async (id: number, nuevoEstado: string, fechaPago?: string) => {
    const updateData: any = { estado: nuevoEstado }
    if (nuevoEstado === 'Pagada') updateData.fecha_pago = fechaPago || new Date().toISOString().slice(0,10)
    const { error } = await supabase.from('facturas').update(updateData).eq('id', id)
    if (error) alert('Error: ' + error.message)
    else cargarFacturas()
  }

  const eliminarFactura = async (id: number) => {
    if (!confirm('¿Eliminar esta factura?')) return
    await supabase.from('facturas').delete().eq('id', id)
    cargarFacturas()
  }

  if (loading) return <div className="flex justify-center p-8">Cargando...</div>

  return (
    <ProtectedRoute>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="glitch font-display font-bold text-4xl" data-text="Facturas">Facturas</h1>
            <p className="text-muted font-mono text-sm">REGISTRO DE FACTURACIÓN A CLIENTES</p>
          </div>
          <Link href="/facturas/nueva" className="btn-primary flex items-center gap-2"><Plus size={16} /> Nueva Factura</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="kpi-card"><p className="kpi-label">Total Facturas</p><p className="kpi-value">{stats.total}</p></div>
          <div className="kpi-card"><p className="kpi-label">Pagadas</p><p className="kpi-value">{stats.pagadas}</p></div>
          <div className="kpi-card card-alert"><p className="kpi-label">Pendientes</p><p className="kpi-value">{stats.pendientes}</p></div>
          <div className="kpi-card"><p className="kpi-label">Monto Total</p><p className="kpi-value">RD$ {stats.totalMonto.toLocaleString()}</p></div>
        </div>

        {facturas.length === 0 ? (
          <div className="card p-12 text-center">No hay facturas registradas.</div>
        ) : (
          <div className="grid gap-4">
            {facturas.map(f => (
              <div key={f.id} className="card p-5">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold">{f.concepto}</h2>
                      <span className={`badge ${f.estado === 'Pagada' ? 'badge-active' : 'badge-pending'}`}>{f.estado}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 text-sm">
                      {f.numero_factura && <div><span className="text-muted">N° Factura:</span> {f.numero_factura}</div>}
                      <div><span className="text-muted">Fecha:</span> {new Date(f.fecha).toLocaleDateString()}</div>
                      <div><span className="text-muted">Obra:</span> {f.obras?.nombre || 'Sin obra'}</div>
                      {f.fecha_pago && <div><span className="text-muted">Fecha pago:</span> {new Date(f.fecha_pago).toLocaleDateString()}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: 'var(--red-core)' }}>RD$ {f.monto.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                    {f.estado !== 'Pagada' && (
                        <button onClick={() => cambiarEstado(f.id, 'Pagada')} className="btn-ghost text-sm">
                        <CheckCircle size={14} /> Marcar Pagada
                        </button>
                    )}
                    
                    <Link href={`/facturas/editar/${f.id}`} className="btn-ghost text-sm">
                        <Edit size={14} /> Editar
                    </Link>
                    
                    <Link href={`/facturas/imprimir/${f.id}`} target="_blank" className="btn-ghost text-sm">
                        <Printer size={14} /> Imprimir
                    </Link>
                    
                    <button onClick={() => eliminarFactura(f.id)} className="btn-danger text-sm">
                        <Trash2 size={14} /> Eliminar
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </ProtectedRoute>
  )
}
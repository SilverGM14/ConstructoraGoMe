// app/facturas/editar/[id]/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X, Building2, Calendar, DollarSign, FileText, Hash } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'

type Obra = { id: number; nombre: string }

export default function EditarFactura() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [obras, setObras] = useState<Obra[]>([])
  const [form, setForm] = useState({
    obraid: '',
    numero_factura: '',
    fecha: '',
    monto: '',
    concepto: '',
    estado: 'Pendiente'
  })

  useEffect(() => {
    const fetchData = async () => {
      const [facturaRes, obrasRes] = await Promise.all([
        supabase.from('facturas').select('*').eq('id', id).single(),
        supabase.from('obras').select('id, nombre')
      ])

      if (facturaRes.data) {
        const f = facturaRes.data
        setForm({
          obraid: f.obraid?.toString() || '',
          numero_factura: f.numero_factura || '',
          fecha: f.fecha,
          monto: f.monto.toString(),
          concepto: f.concepto,
          estado: f.estado
        })
      }
      if (obrasRes.data) setObras(obrasRes.data)
    }
    fetchData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.concepto || !form.monto) {
      alert('Completa los campos obligatorios')
      return
    }
    setLoading(true)

    const payload = {
      obraid: form.obraid ? parseInt(form.obraid) : null,
      numero_factura: form.numero_factura || null,
      fecha: form.fecha,
      monto: parseFloat(form.monto),
      concepto: form.concepto,
      estado: form.estado,
      fecha_pago: form.estado === 'Pagada' ? form.fecha : null
    }

    const { error } = await supabase
      .from('facturas')
      .update(payload)
      .eq('id', parseInt(id))

    if (error) {
      alert('Error: ' + error.message)
    } else {
      router.push('/facturas')
    }
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="card p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold glitch" data-text="Editar Factura">Editar Factura</h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ID: {id} · ACTUALIZAR INFORMACIÓN
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="input-label"><Building2 size={12} className="inline mr-1" /> OBRA (opcional)</label>
              <select
                name="obraid"
                value={form.obraid}
                onChange={handleChange}
                className="input-cyber"
              >
                <option value="">Sin obra</option>
                {obras.map(o => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label"><Hash size={12} className="inline mr-1" /> NÚMERO FACTURA (opcional)</label>
              <input
                name="numero_factura"
                value={form.numero_factura}
                onChange={handleChange}
                className="input-cyber"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label"><Calendar size={12} className="inline mr-1" /> FECHA *</label>
                <input
                  name="fecha"
                  type="date"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                  className="input-cyber"
                />
              </div>
              <div>
                <label className="input-label"><DollarSign size={12} className="inline mr-1" /> MONTO (RD$) *</label>
                <input
                  name="monto"
                  type="number"
                  step="0.01"
                  value={form.monto}
                  onChange={handleChange}
                  required
                  className="input-cyber"
                />
              </div>
            </div>

            <div>
              <label className="input-label"><FileText size={12} className="inline mr-1" /> CONCEPTO *</label>
              <input
                name="concepto"
                value={form.concepto}
                onChange={handleChange}
                required
                className="input-cyber"
              />
            </div>

            <div>
              <label className="input-label">ESTADO</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="input-cyber"
              >
                <option>Pendiente</option>
                <option>Pagada</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Save size={16} /> {loading ? 'Guardando...' : 'Actualizar Factura'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/facturas')}
                className="btn-ghost flex items-center gap-2"
              >
                <X size={16} /> Cancelar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}
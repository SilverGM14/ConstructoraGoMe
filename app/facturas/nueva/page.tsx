'use client'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Building2, Calendar, DollarSign, FileText, Hash } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'

type Obra = { id: number; nombre: string }

export default function NuevaFactura() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [obras, setObras] = useState<Obra[]>([])
  const [form, setForm] = useState({
    obraid: '',
    numero_factura: '',
    fecha: new Date().toISOString().slice(0,10),
    monto: '',
    concepto: '',
    estado: 'Pendiente'
  })

  useEffect(() => {
    supabase.from('obras').select('id, nombre').then(res => {
      if (res.data) setObras(res.data)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.concepto || !form.monto) return alert('Completa los campos obligatorios')
    setLoading(true)
    const { error } = await supabase.from('facturas').insert({
      obraid: form.obraid ? parseInt(form.obraid) : null,
      numero_factura: form.numero_factura || null,
      fecha: form.fecha,
      monto: parseFloat(form.monto),
      concepto: form.concepto,
      estado: form.estado,
      fecha_pago: form.estado === 'Pagada' ? form.fecha : null
    })
    if (error) alert('Error: ' + error.message)
    else router.push('/facturas')
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="card p-6 md:p-8">
          <h1 className="text-2xl font-bold glitch">Nueva Factura</h1>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label className="input-label"><Building2 size={12} /> OBRA (opcional)</label>
              <select name="obraid" value={form.obraid} onChange={handleChange} className="input-cyber">
                <option value="">Sin obra</option>
                {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label"><Hash size={12} /> NÚMERO FACTURA (opcional)</label>
              <input name="numero_factura" value={form.numero_factura} onChange={handleChange} className="input-cyber" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="input-label"><Calendar size={12} /> FECHA *</label><input name="fecha" type="date" value={form.fecha} onChange={handleChange} required className="input-cyber" /></div>
              <div><label className="input-label"><DollarSign size={12} /> MONTO *</label><input name="monto" type="number" step="0.01" value={form.monto} onChange={handleChange} required className="input-cyber" /></div>
            </div>
            <div>
              <label className="input-label"><FileText size={12} /> CONCEPTO *</label>
              <input name="concepto" value={form.concepto} onChange={handleChange} required className="input-cyber" />
            </div>
            <div>
              <label className="input-label">ESTADO</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input-cyber">
                <option>Pendiente</option>
                <option>Pagada</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="btn-primary"><Save size={16} /> Guardar Factura</button>
              <button type="button" onClick={() => router.push('/facturas')} className="btn-ghost"><X size={16} /> Cancelar</button>
            </div>
          </form>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}
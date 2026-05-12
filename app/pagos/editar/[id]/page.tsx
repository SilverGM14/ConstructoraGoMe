// app/pagos/editar/[id]/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X, User, Building2, Calendar, DollarSign, FileText, AlertCircle, Tag, WifiOff } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

type Empleado = { id: number; nombre: string }
type Obra = { id: number; nombre: string; obrapadreid: number | null }
type Categoria = { id: number; nombre: string; color: string }

export default function EditarPago() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [form, setForm] = useState({
    empleadoid: '',
    obraid: '',
    categoriaid: '',
    fecha: '',
    monto: '',
    concepto: '',
    estado: 'Pendiente',
    notas: ''
  })

  const isOnline = useNetworkStatus()

  useEffect(() => {
    const fetchData = async () => {
      const [pagoRes, empRes, obrasRes, catRes] = await Promise.all([
        supabase.from('pagos').select('*').eq('id', id).single(),
        supabase.from('empleados').select('id, nombre'),
        supabase.from('obras').select('id, nombre, obrapadreid'),
        supabase.from('pago_categorias').select('id, nombre').order('nombre')
      ])

      if (pagoRes.data) {
        const p = pagoRes.data
        setForm({
          empleadoid: p.empleadoid.toString(),
          obraid: p.obraid?.toString() || '',
          categoriaid: p.categoriaid?.toString() || '',
          fecha: p.fecha,
          monto: p.monto.toString(),
          concepto: p.concepto,
          estado: p.estado,
          notas: p.notas || ''
        })
      }
      if (empRes.data) setEmpleados(empRes.data)
      if (obrasRes.data) setObras(obrasRes.data)
      if (catRes.data) setCategorias(catRes.data)
    }
    fetchData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.empleadoid || !form.monto || !form.concepto) {
      alert('Completa campos obligatorios')
      return
    }
    setLoading(true)

    const payload = {
      empleadoid: parseInt(form.empleadoid),
      obraid: form.obraid ? parseInt(form.obraid) : null,
      categoriaid: form.categoriaid ? parseInt(form.categoriaid) : null,
      fecha: form.fecha,
      monto: parseFloat(form.monto),
      concepto: form.concepto,
      estado: form.estado,
      notas: form.notas || null
    }

    const { error } = await supabase
      .from('pagos')
      .update(payload)
      .eq('id', parseInt(id))

    if (error) {
      alert('Error: ' + error.message)
    } else {
      router.push('/pagos')
    }
    setLoading(false)
  }

  // Construir lista jerárquica de obras
  const obrasJerarquicas = () => {
    const mapa = new Map<number, any>()
    obras.forEach(o => mapa.set(o.id, { ...o, hijos: [] }))
    const raices: any[] = []
    obras.forEach(o => {
      if (o.obrapadreid) {
        const padre = mapa.get(o.obrapadreid)
        if (padre) padre.hijos.push(mapa.get(o.id))
      } else {
        raices.push(mapa.get(o.id))
      }
    })
    const resultado: { id: number; nombre: string }[] = []
    const recorrer = (nodo: any, nivel: number) => {
      resultado.push({ id: nodo.id, nombre: '— '.repeat(nivel) + nodo.nombre })
      nodo.hijos.forEach((h: any) => recorrer(h, nivel + 1))
    }
    raices.forEach(r => recorrer(r, 0))
    return resultado
  }

  return (
    <ProtectedRoute>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        {!isOnline && (
          <div className="mb-3 p-2 card-alert flex items-center gap-2 text-sm">
            <WifiOff size={16} /> Modo sin conexión — los cambios se guardarán localmente
          </div>
        )}

        <div className="card p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold glitch" data-text="Editar Pago" style={{ color: 'var(--text-primary)' }}>
              Editar Pago
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ID: {id} · ACTUALIZAR INFORMACIÓN
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="input-label"><User size={12} className="inline mr-1" /> EMPLEADO *</label>
              <select
                name="empleadoid"
                value={form.empleadoid}
                onChange={handleChange}
                required
                className="input-cyber"
              >
                <option value="">Selecciona un empleado</option>
                {empleados.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label"><Building2 size={12} className="inline mr-1" /> OBRA / FASE</label>
              <select name="obraid" value={form.obraid} onChange={handleChange} className="input-cyber">
                <option value="">Sin obra asignada</option>
                {obrasJerarquicas().map(o => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label"><Tag size={12} className="inline mr-1" /> CATEGORÍA DE GASTO</label>
              <select name="categoriaid" value={form.categoriaid} onChange={handleChange} className="input-cyber">
                <option value="">Sin categoría</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
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
              <label className="input-label"><AlertCircle size={12} className="inline mr-1" /> ESTADO</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input-cyber">
                <option>Pendiente</option>
                <option>Pagado</option>
                <option>Anulado</option>
              </select>
            </div>

            <div>
              <label className="input-label"><FileText size={12} className="inline mr-1" /> NOTAS</label>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                rows={2}
                className="input-cyber"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Save size={16} /> {loading ? 'Guardando...' : 'Actualizar Pago'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/pagos')}
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
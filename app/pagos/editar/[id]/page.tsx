'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X, User, Building2, Calendar, DollarSign, FileText, AlertCircle, FolderOpen, WifiOff } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'
import { useOfflineMutation } from '@/hooks/useOfflineMutation'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

type Empleado = { id: number; nombre: string }
type Obra = { id: number; nombre: string; obrapadreid: number | null }
type Presupuesto = {
  id: number
  concepto: string
  montoasignado: number
  montogastado: number
  obras: { nombre: string }[] | null
}

type ObraConHijos = Obra & { hijos: ObraConHijos[] }

export default function EditarPago() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [form, setForm] = useState({
    empleadoid: '',
    obraid: '',
    presupuestoid: '',
    fecha: '',
    monto: '',
    concepto: '',
    estado: 'Pendiente',
    notas: ''
  })

  const isOnline = useNetworkStatus()
  const { mutate } = useOfflineMutation('pagos')

  useEffect(() => {
    const fetchData = async () => {
      const [pagoRes, empRes, obrasRes] = await Promise.all([
        supabase.from('pagos').select('*').eq('id', id).single(),
        supabase.from('empleados').select('id, nombre'),
        supabase.from('obras').select('id, nombre, obrapadreid')
      ])

      if (pagoRes.data) {
        const p = pagoRes.data
        setForm({
          empleadoid: p.empleadoid.toString(),
          obraid: p.obraid?.toString() || '',
          presupuestoid: p.presupuestoid?.toString() || '',
          fecha: p.fecha,
          monto: p.monto.toString(),
          concepto: p.concepto,
          estado: p.estado,
          notas: p.notas || ''
        })
      }
      if (empRes.data) setEmpleados(empRes.data)
      if (obrasRes.data) setObras(obrasRes.data)
    }
    fetchData()
  }, [id])

  const cargarPresupuestosHeredados = async (obraId: number) => {
    const { data, error } = await supabase
      .from('presupuestos')
      .select('id, concepto, montoasignado, montogastado, obras(nombre)')
      .eq('obraid', obraId)

    if (error) {
      console.error('Error al cargar presupuestos:', error)
      setPresupuestos([])
      return
    }

    if (data && data.length > 0) {
      setPresupuestos(data as Presupuesto[])
      return
    }

    const { data: obra } = await supabase
      .from('obras')
      .select('obrapadreid')
      .eq('id', obraId)
      .single()

    if (obra?.obrapadreid) {
      await cargarPresupuestosHeredados(obra.obrapadreid)
    } else {
      setPresupuestos([])
    }
  }

  useEffect(() => {
    if (!form.obraid) {
      setPresupuestos([])
      return
    }
    cargarPresupuestosHeredados(parseInt(form.obraid))
  }, [form.obraid])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.empleadoid) {
      alert('Selecciona un empleado')
      return
    }
    setLoading(true)

    const payload = {
      empleadoid: parseInt(form.empleadoid),
      obraid: form.obraid ? parseInt(form.obraid) : null,
      presupuestoid: form.presupuestoid ? parseInt(form.presupuestoid) : null,
      fecha: form.fecha,
      monto: parseFloat(form.monto),
      concepto: form.concepto,
      estado: form.estado,
      notas: form.notas || null
    }

    const result = await mutate('update', payload, parseInt(id))

    if (result.error) {
      alert('Error: ' + result.error.message)
    } else {
      if (!isOnline) {
        alert('Pago actualizado localmente. Se sincronizará al recuperar la conexión.')
      }
      router.push('/pagos')
    }
    setLoading(false)
  }

  const obrasJerarquicas = () => {
    const mapa = new Map<number, ObraConHijos>()
    obras.forEach(o => mapa.set(o.id, { ...o, hijos: [] }))
    const raices: ObraConHijos[] = []
    obras.forEach(o => {
      if (o.obrapadreid) {
        const padre = mapa.get(o.obrapadreid)
        if (padre) padre.hijos.push(mapa.get(o.id)!)
      } else {
        raices.push(mapa.get(o.id)!)
      }
    })
    const resultado: { id: number; nombre: string }[] = []
    const recorrer = (nodo: ObraConHijos, nivel: number) => {
      resultado.push({ id: nodo.id, nombre: '— '.repeat(nivel) + nodo.nombre })
      nodo.hijos.forEach(h => recorrer(h, nivel + 1))
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
              <select name="empleadoid" value={form.empleadoid} onChange={handleChange} required className="input-cyber">
                <option value="">Selecciona un empleado</option>
                {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="input-label"><Building2 size={12} className="inline mr-1" /> OBRA (opcional)</label>
              <select name="obraid" value={form.obraid} onChange={handleChange} className="input-cyber">
                <option value="">Sin obra asignada</option>
                {obrasJerarquicas().map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="input-label"><FolderOpen size={12} className="inline mr-1" /> PARTIDA PRESUPUESTARIA</label>
              <select
                name="presupuestoid"
                value={form.presupuestoid}
                onChange={handleChange}
                className="input-cyber"
                disabled={!form.obraid}
              >
                <option value="">Sin partida</option>
                {presupuestos.map(p => {
                  const disponible = p.montoasignado - p.montogastado
                  const nombreObra = p.obras?.[0]?.nombre
                  const obraInfo = nombreObra ? ` (de ${nombreObra})` : ''
                  return (
                    <option key={p.id} value={p.id}>
                      {p.concepto}{obraInfo} (Disp: RD$ {disponible.toLocaleString()})
                    </option>
                  )
                })}
              </select>
              {form.obraid && presupuestos.length === 0 && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  No hay presupuestos para esta obra ni sus ancestros.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label"><Calendar size={12} className="inline mr-1" /> FECHA *</label>
                <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required className="input-cyber" />
              </div>
              <div>
                <label className="input-label"><DollarSign size={12} className="inline mr-1" /> MONTO (RD$) *</label>
                <input name="monto" type="number" step="0.01" value={form.monto} onChange={handleChange} required className="input-cyber" />
              </div>
            </div>

            <div>
              <label className="input-label"><FileText size={12} className="inline mr-1" /> CONCEPTO *</label>
              <input name="concepto" value={form.concepto} onChange={handleChange} required className="input-cyber" />
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
              <textarea name="notas" value={form.notas} onChange={handleChange} rows={2} className="input-cyber" />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Save size={16} /> {loading ? 'Guardando...' : 'Actualizar Pago'}
              </button>
              <button type="button" onClick={() => router.push('/pagos')} className="btn-ghost flex items-center gap-2">
                <X size={16} /> Cancelar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}
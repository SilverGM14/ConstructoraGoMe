// app/facturas/imprimir/[id]/page.tsx
'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  obras?: { nombre: string; cliente?: string; ubicacion?: string } | null
}

export default function ImprimirFactura() {
  const params = useParams()
  const id = params.id as string
  const [factura, setFactura] = useState<Factura | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('facturas')
        .select('*, obras(nombre, cliente, ubicacion)')
        .eq('id', id)
        .single()
      if (data) setFactura(data as Factura)
      setLoading(false)
    }
    cargar()
  }, [id])

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!factura) return <div className="p-8 text-center">Factura no encontrada</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>CONSTRUCTORA GoMe</h1>
          <p style={{ margin: 0 }}>RNC: 123-456789-0 | Tel: (809) 555-1234</p>
          <p style={{ margin: 0 }}>Santo Domingo, Rep. Dominicana</p>
        </div>

        {/* Datos de la factura */}
        <div style={{ marginBottom: '2rem' }}>
          <h2>FACTURA</h2>
          <p><strong>N° Factura:</strong> {factura.numero_factura || 'Sin número'}</p>
          <p><strong>Fecha de emisión:</strong> {new Date(factura.fecha).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {factura.estado}</p>
          {factura.fecha_pago && <p><strong>Fecha de pago:</strong> {new Date(factura.fecha_pago).toLocaleDateString()}</p>}
        </div>

        {/* Datos del cliente / obra */}
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Información de la Obra</h3>
          <p><strong>Obra:</strong> {factura.obras?.nombre || 'No especificada'}</p>
          <p><strong>Cliente:</strong> {factura.obras?.cliente || '—'}</p>
          <p><strong>Ubicación:</strong> {factura.obras?.ubicacion || '—'}</p>
        </div>

        {/* Detalle de la factura */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Concepto</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Monto (RD$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>{factura.concepto}</td>
              <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ccc' }}>{factura.monto.toLocaleString()}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>TOTAL</td>
              <td style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>RD$ {factura.monto.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        {/* Notas y footer */}
        <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <p>Gracias por su confianza. Este documento es una representación impresa de la factura electrónica.</p>
          <p>GoMe WebApp - Gestión de Obras</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={() => window.print()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          🖨️ Imprimir / Guardar como PDF
        </button>
      </div>
    </div>
  )
}
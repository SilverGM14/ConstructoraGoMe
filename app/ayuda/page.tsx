'use client'
import { motion } from 'framer-motion'
import { BookOpen, Building2, DollarSign, FileText, Receipt, TrendingUp, HelpCircle, Printer } from 'lucide-react'
import ProtectedRoute from '@/lib/ProtectedRoute'

export default function AyudaPage() {
  return (
    <ProtectedRoute>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="glitch font-display font-bold text-4xl" data-text="Centro de Ayuda">Centro de Ayuda</h1>
          <p className="text-muted font-mono text-sm">Guía rápida para usar GoMe - Gestión de Obras</p>
        </div>

        {/* Flujo principal */}
        <div className="card p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><BookOpen size={20} /> Flujo de trabajo recomendado</h2>
          <ol className="list-decimal list-inside space-y-3 font-mono text-sm">
            <li><strong>Crear Obras</strong> – Registra cada proyecto o subproyecto. Asigna un presupuesto total (planificado).</li>
            <li><strong>Registrar Pagos a Empleados</strong> – En <strong>Pagos</strong>, asigna montos a una obra. Estos gastos se reflejarán automáticamente en el gasto total de la obra.</li>
            <li><strong>Facturar a Clientes</strong> – En <strong>Facturas</strong>, crea una factura asociada a una obra (opcional). Al marcarla como <strong>Pagada</strong>, se generará un ingreso automático en Contabilidad.</li>
            <li><strong>Consultar Contabilidad</strong> – En <strong>Contabilidad</strong> verás todos los ingresos (facturas pagadas) y gastos (pagos), con gráficos y filtros.</li>
            <li><strong>Documentos</strong> – Sube archivos relacionados (planos, contratos) y vincúlalos a una obra.</li>
          </ol>
        </div>

        {/* Sección de Obras */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-bold flex items-center gap-2"><Building2 size={18} /> Obras y Subobras</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Crea una obra principal (sin padre).</li>
              <li>Desde una obra, puedes crear <strong>subobras</strong> usando el botón "Subobra".</li>
              <li>Cada obra tiene su propio presupuesto y seguimiento de gastos.</li>
              <li>El campo <strong>total_gastado</strong> se actualiza automáticamente con los pagos confirmados.</li>
              <li>Usa el filtro "Obra principal" para ver solo una obra y sus descendientes.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-bold flex items-center gap-2"><DollarSign size={18} /> Presupuesto y Gastos</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>El presupuesto de una obra es manual (lo defines al crear/editar).</li>
              <li>No se modifica automáticamente; si editas, reemplazas el valor.</li>
              <li>Cada pago registrado en <strong>Pagos</strong> con estado "Pagado" suma al gasto total de esa obra.</li>
              <li>El gráfico "Gastado vs Restante" te muestra el porcentaje ejecutado.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-bold flex items-center gap-2"><Receipt size={18} /> Facturación</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Crea facturas para tus clientes (puedes asignar número de factura, concepto, obra).</li>
              <li>Al marcar una factura como <strong>Pagada</strong>, se registra un ingreso automático.</li>
              <li>Las facturas pagadas aparecen en Contabilidad como "Ingreso".</li>
              <li>Puedes <strong>imprimir</strong> la factura desde la lista (botón "Imprimir") para darla física al cliente.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> Contabilidad</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Muestra el balance: Ingresos (facturas pagadas) - Gastos (pagos).</li>
              <li>Evolución mensual, gráfico de gastos por categoría y tabla de movimientos.</li>
              <li>Puedes exportar a Excel los movimientos filtrados.</li>
            </ul>
          </div>
        </div>

        {/* Botón de acceso rápido a impresión de factura */}
        <div className="card p-4 text-center bg-elevated">
          <p className="font-mono text-sm">Para imprimir una factura, ve a <strong>Facturas</strong> y haz clic en el botón 🖨️ de la fila correspondiente.</p>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}
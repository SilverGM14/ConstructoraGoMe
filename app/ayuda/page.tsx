// app/ayuda/page.tsx
'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, Building2, DollarSign, FileText, Receipt, TrendingUp, 
  HelpCircle, Printer, WifiOff, Database, Users, LayoutDashboard,
  CheckCircle, AlertCircle, ArrowRight, Zap, Settings
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/lib/ProtectedRoute'

export default function AyudaPage() {
  return (
    <ProtectedRoute>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-4xl mx-auto space-y-10 pb-12"
      >
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <h1 className="glitch font-display font-bold text-5xl" data-text="Centro de Ayuda">Centro de Ayuda</h1>
          <p className="text-muted font-mono text-sm flex items-center justify-center gap-2">
            <Zap size={16} /> GoMe - Gestión de Obras v2.0 <Zap size={16} />
          </p>
          <p className="text-muted max-w-2xl mx-auto">
            Aquí encontrarás todo lo que necesitas para dominar el sistema. 
            Sigue el flujo paso a paso y convierte tu negocio en una máquina bien aceitada.
          </p>
        </div>

        {/* Índice rápido */}
        <div className="card p-6 bg-elevated">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><BookOpen size={20} /> ¿Qué quieres hacer?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <a href="#obras" className="btn-ghost justify-center">🏗️ Crear Obras</a>
            <a href="#pagos" className="btn-ghost justify-center">💰 Registrar Pagos</a>
            <a href="#facturas" className="btn-ghost justify-center">🧾 Facturar Clientes</a>
            <a href="#contabilidad" className="btn-ghost justify-center">📊 Ver Contabilidad</a>
            <a href="#documentos" className="btn-ghost justify-center">📁 Documentos</a>
            <a href="#configuracion" className="btn-ghost justify-center">⚙️ Configuración</a>
            <a href="#offline" className="btn-ghost justify-center">📴 Modo offline</a>
            <a href="#faq" className="btn-ghost justify-center">❓ Preguntas Frecuentes</a>
          </div>
        </div>

        {/* ========================= SECCIONES ========================= */}

        {/* 1. OBRAS */}
        <div id="obras" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><Building2 size={24} /> 1. Obras y Subobras</h2>
          <p className="mb-4">Las obras son el corazón del sistema. Cada proyecto de construcción se registra como una <strong>obra</strong>. Puedes crear subobras (por ejemplo: “Zapata”, “Paredes”, “Acabados”) para desglosar el trabajo.</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold flex items-center gap-1">📌 Crear una obra principal</h3>
              <ul className="list-disc list-inside ml-4 text-muted">
                <li>Ve a <strong>Obras → Nueva Obra</strong>.</li>
                <li>Completa: nombre, cliente, ubicación, <strong>presupuesto total</strong> (el dinero que planeas gastar en esa obra).</li>
                <li>Guarda. ¡Listo!</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-1">🌿 Crear una subobra</h3>
              <ul className="list-disc list-inside ml-4 text-muted">
                <li>Desde la lista de obras, haz clic en <strong>“Subobra”</strong> en la tarjeta de la obra padre.</li>
                <li>Rellena su propio presupuesto (por defecto se asigna a la obra padre automáticamente).</li>
                <li>La subobra aparecerá indentada en la vista jerárquica.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-1">📈 Seguimiento de gastos</h3>
              <ul className="list-disc list-inside ml-4 text-muted">
                <li>Cada obra muestra: <strong>Presupuesto</strong> (lo que planificaste), <strong>Gastado</strong> (suma de pagos confirmados) y <strong>Restante</strong>.</li>
                <li>El progreso (%) lo actualizas manualmente según avance físico.</li>
                <li>El <strong>selector de obra principal</strong> te permite ver solo una obra y todas sus subobras (filtra KPIs y lista).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. PAGOS */}
        <div id="pagos" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><DollarSign size={24} /> 2. Pagos a Empleados</h2>
          <p>Aquí registras cada desembolso a trabajadores, contratistas o proveedores. Los pagos con estado <strong>“Pagado”</strong> se restan automáticamente del presupuesto de la obra asociada.</p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-elevated p-3 rounded">
              <p className="font-bold">✅ Paso a paso</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Ve a <strong>Pagos → Nuevo Pago</strong>.</li>
                <li>Selecciona empleado (si es mano de obra) o deja el campo para gastos generales.</li>
                <li>Asigna una <strong>obra</strong> (para que el gasto se descuente de su presupuesto).</li>
                <li>Elige una <strong>categoría</strong> (Materiales, Mano de obra, etc.) – útil para gráficos.</li>
                <li>Ingresa fecha, monto, concepto y estado (“Pagado” si ya se entregó el dinero).</li>
                <li>Guarda. El gasto aparecerá en Contabilidad y en la tarjeta de la obra.</li>
              </ol>
            </div>
            <div className="bg-elevated p-3 rounded">
              <p className="font-bold">💡 Consejos</p>
              <ul className="list-disc list-inside text-sm">
                <li>Puedes editar un pago para cambiar el monto o la obra; el sistema recalcula todo automáticamente.</li>
                <li>Si anulas un pago (estado “Anulado”), se reverte el gasto.</li>
                <li>Usa <strong>“Pendiente”</strong> para pagos aún no confirmados (no afectan presupuesto).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. FACTURAS */}
        <div id="facturas" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><Receipt size={24} /> 3. Facturación a Clientes</h2>
          <p>Registra los <strong>ingresos</strong> de tu negocio. Cada factura representa dinero que recibes del cliente, asociada o no a una obra.</p>
          <div className="space-y-3">
            <div>
              <p className="font-bold">📄 Crear una factura</p>
              <ul className="list-disc list-inside ml-4 text-muted">
                <li><strong>Facturas → Nueva Factura</strong>.</li>
                <li>Ingresa número de factura (opcional), fecha, concepto, monto y obra (opcional).</li>
                <li>Si la factura ya está pagada, marca “Pagada” de una vez; si no, déjala en “Pendiente”.</li>
              </ul>
            </div>
            <div>
              <p className="font-bold">💵 Cobrar una factura</p>
              <ul className="list-disc list-inside ml-4 text-muted">
                <li>En el listado de facturas, haz clic en <strong>“Marcar Pagada”</strong>.</li>
                <li>Automáticamente se creará un <strong>ingreso</strong> en Contabilidad y se sumará al balance.</li>
                <li>Si necesitas la factura física, usa el botón <strong>🖨️ Imprimir</strong> y guárdala como PDF o papel.</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 bg-red-ghost p-3 rounded text-sm flex items-start gap-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span><strong>Nota importante:</strong> El presupuesto de una obra NO es un ingreso. Es una estimación de gastos. Los ingresos reales solo vienen de facturas pagadas o transacciones manuales de ingreso.</span>
          </div>
        </div>

        {/* 4. CONTABILIDAD */}
        <div id="contabilidad" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><TrendingUp size={24} /> 4. Contabilidad Automática</h2>
          <p>El sistema genera automáticamente el libro mayor. No necesitas asientos contables manuales.</p>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold">📊 ¿Qué ves?</p>
              <ul className="list-disc list-inside text-sm">
                <li>Ingresos totales (suma de facturas pagadas + ingresos manuales).</li>
                <li>Gastos totales (suma de pagos con estado “Pagado”).</li>
                <li>Balance = Ingresos - Gastos.</li>
                <li>Evolución mensual (gráfico de áreas).</li>
                <li>Gráfico de gastos por categoría.</li>
                <li>Tabla detallada con filtros (obra, fecha, tipo).</li>
                <li>Exportación a Excel.</li>
              </ul>
            </div>
            <div>
              <p className="font-bold">🔍 Filtros útiles</p>
              <ul className="list-disc list-inside text-sm">
                <li><strong>Buscar:</strong> por concepto, obra, empleado.</li>
                <li><strong>Tipo:</strong> solo Ingresos o solo Gastos.</li>
                <li><strong>Obra:</strong> movimientos de una obra específica.</li>
                <li><strong>Rango de fechas:</strong> para ver un período concreto.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. DOCUMENTOS */}
        <div id="documentos" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><FileText size={24} /> 5. Gestión Documental</h2>
          <p>Adjunta planos, contratos, facturas de proveedores o cualquier archivo relevante.</p>
          <ul className="list-disc list-inside ml-6 space-y-1">
            <li><strong>Subir:</strong> Ve a Documentos → Subir Documento, selecciona archivo y asigna una obra (opcional).</li>
            <li><strong>Descargar:</strong> Haz clic en el botón “Descargar” del documento.</li>
            <li><strong>Editar:</strong> Puedes cambiar el nombre, descripción u obra asociada.</li>
            <li><strong>Eliminar:</strong> Borra tanto el registro como el archivo físico del almacenamiento.</li>
            <li><strong>Modo offline:</strong> Los documentos no se pueden subir sin conexión, pero sí ver los ya descargados.</li>
          </ul>
        </div>

        {/* 6. CONFIGURACIÓN */}
        <div id="configuracion" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><Settings size={24} /> 6. Configuración y Backup</h2>
          <ul className="list-disc list-inside ml-6 space-y-1">
            <li><strong>Tema oscuro/claro:</strong> Cambia con el interruptor en el menú lateral.</li>
            <li><strong>Exportar backup:</strong> Descarga un archivo JSON con todos los datos (obras, pagos, facturas, etc.).</li>
            <li><strong>Importar backup:</strong> Restaura un backup previo (reemplaza los datos actuales).</li>
            <li><strong>Limpiar archivos huérfanos:</strong> Elimina del storage los archivos que ya no están referenciados en la base de datos.</li>
          </ul>
        </div>

        {/* 7. MODO OFFLINE */}
        <div id="offline" className="card p-6 scroll-mt-20 border-red">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><WifiOff size={24} /> 7. Modo sin conexión (Offline)</h2>
          <p>GoMe funciona incluso sin internet. Los cambios se guardan localmente y se sincronizan cuando vuelves a tener conexión.</p>
          <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
            <div className="bg-elevated p-3 rounded">
              <p className="font-bold">✅ Qué puedes hacer offline</p>
              <ul className="list-disc list-inside">
                <li>Ver todas las obras, pagos y facturas que ya estaban cargados.</li>
                <li>Crear/editar/eliminar obras, pagos, facturas (se encolan).</li>
                <li>Trabajar normalmente, la sincronización es automática al reestablecerse la red.</li>
              </ul>
            </div>
            <div className="bg-elevated p-3 rounded">
              <p className="font-bold">⚠️ Limitaciones offline</p>
              <ul className="list-disc list-inside">
                <li>No se pueden subir documentos (requieren conexión).</li>
                <li>No se exporta backup (requiere conexión).</li>
                <li>Las imágenes del dashboard o reportes en tiempo real no se actualizan.</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-muted text-sm flex items-center gap-1"><CheckCircle size={14} /> Cuando vuelvas a internet, todos los cambios pendientes se sincronizarán sin que tengas que hacer nada.</p>
        </div>

        {/* 8. FAQ */}
        <div id="faq" className="card p-6 scroll-mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3"><HelpCircle size={24} /> Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <details>
              <summary className="font-bold cursor-pointer">¿Cómo puedo ver el dinero restante de una obra?</summary>
              <p className="text-muted mt-2">En la lista de obras, cada tarjeta muestra tres valores: <strong>Presupuesto</strong> (lo planeado), <strong>Gastado</strong> (lo pagado hasta ahora) y <strong>Restante</strong> (diferencia). Además, en el KPI "Gastado vs Restante" ves el total acumulado de la obra seleccionada.</p>
            </details>
            <details>
              <summary className="font-bold cursor-pointer">¿Por qué una factura pagada no aparece en Contabilidad?</summary>
              <p className="text-muted mt-2">Revisa que el estado de la factura sea <strong>"Pagada"</strong>. El trigger crea el ingreso automáticamente al cambiar el estado. Si no ocurre, verifica que la tabla <code>transacciones</code> tenga el campo <code>origen</code> y <code>origen_id</code> correctos y que el trigger esté activo.</p>
            </details>
            <details>
              <summary className="font-bold cursor-pointer">¿Puedo eliminar una obra si tiene pagos o facturas asociadas?</summary>
              <p className="text-muted mt-2">Sí, pero la base de datos tiene restricciones (<code>ON DELETE RESTRICT</code> en pagos). Primero deberías eliminar o reasignar los pagos/facturas de esa obra. Para facilitarlo, puedes usar la opción de eliminar obra, pero si da error, hazlo manualmente desde gestión de pagos.</p>
            </details>
            <details>
              <summary className="font-bold cursor-pointer">¿Cómo imprimir una factura?</summary>
              <p className="text-muted mt-2">En el listado de facturas, haz clic en el botón <strong>🖨️ Imprimir</strong> (icono de impresora). Se abrirá una vista optimizada para papel; puedes guardar como PDF o imprimir directamente.</p>
            </details>
            <details>
              <summary className="font-bold cursor-pointer">El dashboard se ve lento o se queda cargando, ¿qué hago?</summary>
              <p className="text-muted mt-2">Prueba a limpiar la caché del navegador o usar el modo incógnito. También puedes recargar la página. Si el problema persiste, verifica tu conexión a internet y que Supabase esté activo. Revisa la consola (F12) por errores.</p>
            </details>
          </div>
        </div>

        {/* Footer: atajo al inicio */}
        <div className="text-center">
          <a href="#" className="btn-ghost inline-flex items-center gap-2">
            <ArrowRight size={16} /> Volver arriba
          </a>
        </div>
      </motion.div>
    </ProtectedRoute>
  )
}
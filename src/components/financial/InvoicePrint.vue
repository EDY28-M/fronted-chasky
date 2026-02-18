<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:bg-white print:static print:block">
    <div class="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg relative print:shadow-none print:w-full print:max-w-none print:p-0">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 print:hidden">
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="print-content text-black" id="invoice-print">
        <!-- Header -->
        <div class="grid grid-cols-[1fr_auto] gap-8 items-start pb-6 border-b border-gray-300">
          <div class="flex items-start gap-4">
            <img src="/logo.svg" alt="Logo" class="h-20 w-auto grayscale object-contain" />
            <div class="pt-1">
              <h1 class="text-2xl font-bold uppercase tracking-wide leading-tight mb-1">ZEN DOJO</h1>
              <div class="text-sm text-gray-600 space-y-0.5">
                <p>Av. Siempre Viva 123, Lima</p>
                <p>Tel: 999-999-999</p>
                <p>Email: contacto@zendojo.com</p>
                <p class="font-medium mt-1">Sede: {{ invoice.sucursal?.nombre || 'Principal' }}</p>
              </div>
            </div>
          </div>
          
          <div class="border-2 border-gray-800 rounded-sm w-[300px] text-center bg-white">
            <div class="py-3 px-2">
              <h2 class="text-lg font-bold text-gray-900 mb-2">R.U.C. 20601234567</h2>
              <h3 class="text-lg font-bold bg-gray-100 py-2 border-y border-gray-200 uppercase tracking-wide">
                {{ invoice.tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA' }}
              </h3>
              <p class="text-lg font-mono mt-2 font-medium">N° {{ invoice.serie || 'F001' }}-{{ String(invoice.numero || 0).padStart(8, '0') }}</p>
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="mt-6 border border-gray-200 rounded-sm overflow-hidden">
          <div class="grid grid-cols-[1fr_auto] divide-x divide-gray-200">
            <!-- Client Info -->
            <div class="p-4 space-y-2">
              <h4 class="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Datos del Cliente</h4>
              <div class="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 text-sm">
                <span class="text-gray-500">Cliente:</span>
                <span class="font-medium uppercase">{{ invoice.cliente_nombre }}</span>
                
                <span class="text-gray-500">{{ invoice.tipo_documento_cliente === 'RUC' ? 'R.U.C.' : 'D.N.I.' }}:</span>
                <span class="font-medium font-mono">{{ invoice.cliente_documento || '—' }}</span>
                
                <span class="text-gray-500">Dirección:</span>
                <span class="truncate">{{ invoice.cliente_direccion || '—' }}</span>
              </div>
            </div>

            <!-- Emission Info -->
            <div class="p-4 bg-gray-50 min-w-[300px] space-y-2">
               <h4 class="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Detalles de Emisión</h4>
               <div class="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-sm">
                <span class="text-gray-500">Fecha:</span>
                <span class="font-medium">{{ new Date(invoice.fecha_emision).toLocaleDateString('es-PE') }}</span>
                
                <span class="text-gray-500">Moneda:</span>
                <span>{{ invoice.moneda === 'USD' ? 'Dólares' : 'Soles' }}</span>
                
                <span class="text-gray-500">Pago:</span>
                <span class="uppercase">{{ invoice.condicion_pago || 'Contado' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mt-6">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-800 text-xs text-gray-600 uppercase tracking-wider">
                <th class="py-2 px-3 text-center w-16 font-bold">Cant.</th>
                <th class="py-2 px-3 text-center w-24 font-bold">Unidad</th>
                <th class="py-2 px-3 text-left font-bold">Descripción</th>
                <th class="py-2 px-3 text-right w-32 font-bold">P. Unitario</th>
                <th class="py-2 px-3 text-right w-32 font-bold">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, i) in (invoice.items || [])" :key="i">
                <td class="py-3 px-3 text-center font-mono text-gray-700">{{ item.cantidad }}</td>
                <td class="py-3 px-3 text-center text-xs text-gray-500">{{ item.unidad_medida || 'UND' }}</td>
                <td class="py-3 px-3 font-medium">{{ item.descripcion }}</td>
                <td class="py-3 px-3 text-right font-mono text-gray-700">{{ formatMoney(item.precio_unitario) }}</td>
                <td class="py-3 px-3 text-right font-mono font-bold">{{ formatMoney(item.total || item.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer / Totals -->
        <div class="mt-6 border-t border-gray-800 pt-6">
          <div class="flex justify-between items-start gap-8">
            
            <!-- Left: QR and Notes -->
            <div class="flex items-start gap-4 flex-1">
               <div class="w-24 h-24 bg-white border-2 border-gray-800 flex items-center justify-center p-1 shrink-0">
                  <div class="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-center text-gray-400 font-mono leading-tight">
                    QR CODE<br>VALIDATION
                  </div>
               </div>
               <div class="text-xs text-gray-500 space-y-1 mt-1">
                  <p class="font-medium text-black">Observaciones:</p>
                  <p class="italic">{{ invoice.observaciones || 'Sin observaciones.' }}</p>
                  <p class="mt-4 border-t w-full opacity-50"></p>
                  <p>Representación impresa de la {{ invoice.tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA' }}, consulte en www.zendojo.com</p>
               </div>
            </div>

            <!-- Right: Totals -->
            <div class="w-80">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>Op. Gravada</span>
                  <span class="font-mono">{{ formatMoney(invoice.subtotal) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>I.G.V. (18%)</span>
                   <span class="font-mono">{{ formatMoney(invoice.total_impuestos || (invoice.total - invoice.subtotal)) }}</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-t-2 border-gray-800 mt-2 text-lg font-bold">
                  <span>IMPORTE TOTAL</span>
                  <span class="font-mono">{{ formatMoney(invoice.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-lg print:hidden">
        <button @click="$emit('close')" class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
          Cancelar
        </button>
        <button @click="print" class="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">print</span>
          Imprimir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  invoice: { type: Object, required: true },
  visible: Boolean
})

defineEmits(['close'])

function formatMoney(value) {
  if (value == null) return '0.00'
  return new Intl.NumberFormat('es-PE', { style: 'decimal', minimumFractionDigits: 2 }).format(value)
}

function print() {
  window.print()
}
</script>

<style>
@media print {
  @page { 
    size: A4; 
    margin: 0; 
  }
  
  /* Global reset */
  body, html {
    background-color: white !important;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    width: 100% !important;
  }

  /* ...except existing modals/overlays if they contain our print target */
  /* But since we want to be specific, let's just use visibility hidden for everything which preserves layout but hides content */
  body * {
    visibility: hidden;
  }

  /* Invoice Container - A4 Specification */
  #invoice-print, #invoice-print * {
    visibility: visible;
  }

  #invoice-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm; /* Exact A4 width */
    min-height: 297mm; /* Exact A4 height */
    margin: 0 auto;
    padding: 15mm; /* Comfortable print margins */
    background-color: white;
    z-index: 9999;
    box-sizing: border-box;
    font-family: Arial, sans-serif; /* Safe print font */
    -webkit-print-color-adjust: exact !important; /* Force background colors */
    print-color-adjust: exact !important;
  }
  
  /* Ensure grids don't collapse */
  .grid {
    display: grid !important;
  }

  /* Utility to hide screen-only buttons */
  .print\:hidden {
    display: none !important;
  }
  
  .no-print {
    display: none !important;
  }
}
</style>

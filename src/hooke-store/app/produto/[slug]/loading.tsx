export default function Loading() {
  return (
    // MUDANÇA: w-full e px-6 md:px-12 (Sem max-w-7xl)
    <div className="w-full px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Esqueleto da Foto (Gigante) */}
      <div className="w-full h-[80vh] bg-gray-100 animate-pulse rounded-none" />
      
      {/* Esqueleto dos Textos (Lateral) */}
      <div className="space-y-6 pt-12">
        <div className="h-12 w-3/4 bg-gray-100 animate-pulse rounded-none" />
        <div className="h-8 w-1/4 bg-gray-100 animate-pulse rounded-none" />
        <div className="h-40 w-full bg-gray-100 animate-pulse rounded-none mt-12" />
        <div className="h-12 w-full bg-gray-900 animate-pulse rounded-none mt-8" />
      </div>
    </div>
  )
}
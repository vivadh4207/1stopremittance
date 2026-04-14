export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" />
        </div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

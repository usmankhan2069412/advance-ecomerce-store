export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-24 h-24 border-t-4 border-b-4 border-black rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-medium">Loading Aetheria...</p>
    </div>
  );
}

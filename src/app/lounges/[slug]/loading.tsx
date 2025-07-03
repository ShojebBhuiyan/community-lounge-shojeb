export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg h-48 w-full mb-4" />
        <div className="bg-gray-200 rounded h-8 w-3/4 mb-2" />
        <div className="bg-gray-200 rounded h-4 w-1/2 mb-4" />
        <div className="bg-gray-200 rounded h-10 w-full" />
      </div>

      <section className="mt-8">
        <div className="bg-gray-200 rounded h-6 w-24 mb-4" />
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-4 w-3/4" />
          <div className="bg-gray-200 rounded h-4 w-1/2" />
        </div>
      </section>
    </main>
  );
}

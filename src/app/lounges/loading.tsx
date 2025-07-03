export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <section className="mb-10 text-center">
        <div className="bg-gray-200 rounded h-12 w-96 mx-auto mb-2 animate-pulse" />
        <div className="bg-gray-200 rounded h-6 w-80 mx-auto mb-4 animate-pulse" />
        <div className="bg-gray-200 rounded-full h-8 w-48 mx-auto animate-pulse" />
      </section>
      <section>
        <div className="bg-gray-200 rounded h-8 w-32 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <section className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Food Delivery CQRS Demo</h1>
          <p className="mt-2 text-gray-500">
            Static frontend prototype before connecting Kafka and Spring Boot.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/orders/new" className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-bold">Client</h2>
            <p className="mt-2 text-sm text-gray-500">Place a new order</p>
          </Link>

          <Link
            href="/workers/orders"
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="font-bold">Worker</h2>
            <p className="mt-2 text-sm text-gray-500">Monitor restaurant orders</p>
          </Link>

          <Link href="/deliveries" className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-bold">Deliverer</h2>
            <p className="mt-2 text-sm text-gray-500">Track active deliveries</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
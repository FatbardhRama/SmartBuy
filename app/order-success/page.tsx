export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Order placed successfully 🎉
        </h1>

        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been
          received and is being processed.
        </p>

        <a
          href="/"
          className="inline-block rounded-md bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </a>
      </div>
    </main>
  );
}
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PropertyPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Property Details</h1>
          <p className="text-muted-foreground">Property ID: {params.id}</p>
          <p className="mt-4">Property details will be displayed here.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}


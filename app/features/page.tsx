import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Features } from "@/components/features"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Features />
      </div>
      <Footer />
    </main>
  )
}


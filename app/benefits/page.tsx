import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Benefits } from "@/components/benefits"

export default function BenefitsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Benefits />
      </div>
      <Footer />
    </main>
  )
}


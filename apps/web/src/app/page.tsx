import Link from 'next/link';
import { Dog, Heart, Shield, Stethoscope, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-lg">
            <Dog className="h-7 w-7" />
            Portal Canino
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-orange-600 transition-colors"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-background -z-10" />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground mb-6">
                🐾 Tu compañero, toda su vida
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Gestiona el ciclo de vida completo de tu perro
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Desde su nacimiento hasta su memorial. Salud, vacunas, nutrición, crecimiento,
                recuerdos y más — todo en un solo lugar.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Comenzar gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">Todo lo que necesitas</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: 'Perfil completo',
                desc: 'Registra origen, bautizo, gustos y momentos especiales.',
              },
              {
                icon: Stethoscope,
                title: 'Salud y vacunas',
                desc: 'Calendario de vacunas con alertas de vencimiento.',
              },
              {
                icon: Dog,
                title: 'Nutrición y crecimiento',
                desc: 'Planes alimenticios y gráficas de peso.',
              },
              {
                icon: Shield,
                title: 'Roles especializados',
                desc: 'Dueños, veterinarios y administradores con acceso seguro.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Portal Canino. Todos los derechos reservados.
      </footer>
    </div>
  );
}

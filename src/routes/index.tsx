import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Users } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-cream mb-6 leading-tight">
            Учебный центр
            <span className="block text-gold italic">KOROCHEK.NET</span>
          </h1>

          <p className="text-xl md:text-2xl text-cream/70 font-body max-w-3xl mx-auto mb-10 leading-relaxed">
            Зарегистрируйтесь на один из курсов 
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold">
                3
              </div>
              <div className="text-cream/50 text-sm uppercase tracking-wider">
                курса
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold">
                2
              </div>
              <div className="text-cream/50 text-sm uppercase tracking-wider">
                варианта оплаты
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-copper to-copper-dark text-charcoal font-semibold text-lg transition-all hover:shadow-lg hover:shadow-copper/30 hover:scale-[1.02]"
            >
              <Users className="w-5 h-5" />
              Зарегистрироваться
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gold/50 text-gold font-semibold text-lg transition-all hover:bg-gold/10 hover:border-gold"
            >
              Войти
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

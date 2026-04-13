import { UserPlus, Calculator, Send, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in under 2 minutes with just your email. Complete KYC to unlock full features.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Calculator,
    title: 'Enter Amount',
    description: 'Choose your recipient country, enter the amount, and see the exact exchange rate and fees instantly.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Send,
    title: 'Send Money',
    description: 'Pay with debit card, credit card, bank transfer, or wallet balance. Choose delivery method.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: CheckCircle,
    title: 'Money Delivered',
    description: 'Your recipient gets the money via bank deposit, mobile wallet, or cash pickup within minutes.',
    color: 'bg-orange-100 text-orange-600',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Sending money abroad has never been easier. Just 4 simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gray-200" />
              )}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.color} mb-6`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="absolute -top-2 -right-2 md:static md:hidden w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

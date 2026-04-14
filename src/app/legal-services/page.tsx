import { redirect } from 'next/navigation'

// Legal services were moved to the LegalAI project.
// Redirect anyone landing here back to home.
export default function LegalServicesPage() {
  redirect('/')
}

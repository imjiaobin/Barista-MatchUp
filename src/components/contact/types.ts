export interface FormState {
  contactName: string
  contactPhone: string
  contactEmail: string
  eventType: string
  eventCity: string
  eventAddress: string
  venueType: string
  eventStart: string
  eventEnd: string
  cupCount: string
  drinkTypes: string[]
  dessertNeeded: boolean
  dessertNotes: string
  powerSupply: string
  waterSource: string
  budgetRange: string
  notes: string
  preferredContactMethod: string
  website: string
}

export type SetField = <K extends keyof FormState>(key: K, value: FormState[K]) => void

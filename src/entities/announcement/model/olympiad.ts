import type {
  BaseAnnouncement,
  AnnouncementCategory,
  AnnouncementLocationType,
  Currency,
  PriceType,
  Language,
  TargetAudience,
} from './base'

export type OlympiadLevel =
  | 'intrauniversity' // внутривузовская
  | 'regional'
  | 'national'
  | 'international'

export type CompetitionFormat = 'individual' | 'team' | 'both'

export type OlympiadSubject =
  | 'anatomy'
  | 'physiology'
  | 'biochemistry'
  | 'pathology'
  | 'pharmacology'
  | 'histology'
  | 'embryology'
  | 'microbiology'
  | 'internal_medicine'
  | 'surgery'
  | 'pediatrics'
  | 'radiology'
  | 'statistics'
  | 'public_health'
  | 'ethics'
  | 'first_aid'
  | 'other'

export type ExamKind =
  | 'mcq'            // тесты с выбором ответа
  | 'free_response'  // развернутые ответы/эссе
  | 'osce'           // практические станции/skills
  | 'case'           // клинические кейсы
  | 'practical'      // лабораторные/технические задания
  | 'team_bowl'      // быстрые командные раунды (science bowl)
  | 'presentation'   // постер/доклад

export interface TeamRules {
  minSize?: number
  maxSize?: number
  sameInstitutionRequired?: boolean
  supervisorRequired?: boolean
  notes?: string
}

export type EducationLevel =
  | 'high_school'
  | 'medical_undergraduate'
  | 'medical_postgraduate'
  | 'mixed'

export interface Eligibility {
  educationLevel: EducationLevel
  yearsAllowed?: { min?: number; max?: number }
  specialtiesAllowed?: string[]
  ageMin?: number
  ageMax?: number
  citizenshipOrResidency?: string // ограничения (если есть)
  prerequisites?: string[]        // требуемые курсы/навыки/документы
}

export interface Round {
  name: string
  stage: 'qualifier' | 'semi_final' | 'final' | 'other'
  mode: AnnouncementLocationType
  dateFrom?: string
  dateTo?: string
  subjects?: OlympiadSubject[]
  examKinds?: ExamKind[]
  durationMinutes?: number
  weightPercent?: number
  proctoring?: 'online_proctoring' | 'in_person_proctoring' | 'none'
  description?: string
}

export interface Scoring {
  ranking: 'individual' | 'team' | 'both'
  totalPoints?: number
  passingScore?: number
  tieBreakers?: string[]
  notes?: string
}

export type AwardType =
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'first_place'
  | 'honorable_mention'
  | 'cash'
  | 'scholarship'
  | 'certificate'
  | 'trophy'
  | 'qualification'

export interface Award {
  type: AwardType
  title?: string
  details?: string
  monetaryAmount?: number
  currency?: Currency
  qualifiesFor?: string
}

export interface Logistics {
  accommodationProvided?: boolean
  travelReimbursed?: 'none' | 'partial' | 'full'
  mealsProvided?: boolean
  visaSupport?: boolean
  notes?: string
}

export interface JuryMember {
  name: string
  role?: string
  affiliation?: string
}

export interface OlympiadDocs {
  rulesUrl?: string
  syllabusUrl?: string
  scheduleUrl?: string
  registrationGuideUrl?: string
  pastPapersUrl?: string
}

export interface Olympiad extends BaseAnnouncement {
  olympiadLevel: OlympiadLevel
  competitionFormat: CompetitionFormat
  subjects: OlympiadSubject[]

  teamRules?: TeamRules
  eligibility: Eligibility

  rounds: Round[]
  scoring?: Scoring
  awards?: Award[]

  maxParticipants?: number
  currentParticipants?: number
  maxTeams?: number

  registrationRequired?: boolean
  registrationLink?: string
  registrationOpenAt?: string
  registrationCloseAt?: string
  documentsRequired?: string[]

  price?: number
  price_type: PriceType
  currency: Currency

  hostOrganization?: string
  venueName?: string
  jury?: JuryMember[]
  sponsors?: string[]

  logistics?: Logistics

  docs?: OlympiadDocs

  previewImage?: string
  gallery?: string[]

  categories: AnnouncementCategory[]
  targetAudience?: TargetAudience[]
  language?: Language

  level: string
  participationFormat: string
  registrationDeadline: string
  registrationFee?: number
}

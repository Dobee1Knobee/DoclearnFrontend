"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { StepIndicator } from "@/features/announcements/ui/StepIndicator/StepIndicator"
import { CategorySelection } from "@/features/announcements/ui/CategorySelection/CategorySelection"
import { BasicInformation } from "@/features/announcements/ui/BasicInformation/BasicInformation"
import { AdditionalDetails } from "@/features/announcements/ui/AdditionalDetails/AdditionalDetails"
import { PreviewAndPublish } from "@/features/announcements/ui/PreviewAndPublish/PreviewAndPublish"
import type { CreateAnnouncementFormData } from "@/entities/announcement/model"
import styles from "./CreateAnnouncementPage.module.css"

const initialFormData: CreateAnnouncementFormData = {
  category: null,
  title: "",
  organizer: "",
  activeFrom: "",
  activeTo: "",
  startTime: "",
  endTime: "",
  location: {
    type: "offline",
    address: "",
    city: "",
    country: "",
  },
  maxParticipants: null,
  participantLimit: null,
  price_type: "free",
  price: 0,
  currency: "RUB",
  program: "",
  speakers: [],
  certificates: false,
  registrationRequired: false,
  registrationLink: "",
  contactInfo: {
    email: "",
    phone: "",
    website: "",
  },
  description: "",
  categories: [],
  targetAudience: [],
  language: "ru",
  tags: [],
  isPromoted: false,
}

const STORAGE_KEY = "create-announcement-form"

export function CreateAnnouncementPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateAnnouncementFormData>(initialFormData)

  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || initialFormData)
        setCurrentStep(parsed.currentStep || 1)
      } catch (error) {
        console.error("Failed to parse saved form data:", error)
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }))
  }, [formData, currentStep])

  const updateFormData = (updates: Partial<CreateAnnouncementFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleBackToList = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    router.push("/announcements")
  }

  const handleSubmit = async () => {
    console.log("Submitting announcement:", formData)
    sessionStorage.removeItem(STORAGE_KEY)
    router.push("/announcements")
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CategorySelection
            selectedCategory={formData.category}
            onCategorySelect={(category) => updateFormData({ category })}
            onNext={handleNext}
          />
        )
      case 2:
        return (
          <BasicInformation
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <AdditionalDetails
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <PreviewAndPublish
            formData={formData}
            onUpdate={updateFormData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBackToList} className={styles.backButton}>
          <ArrowLeft size={20} />
          Назад к списку
        </button>

        <StepIndicator currentStep={currentStep} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Создание объявления</h1>
        {renderCurrentStep()}
      </div>
    </div>
  )
}

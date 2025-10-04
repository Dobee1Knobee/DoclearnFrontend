"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Alert } from "react-bootstrap"
import { StepIndicator } from "@/features/announcements/ui/AnnouncementsCreatePage/StepIndicator/StepIndicator"
import { CategorySelection } from "@/features/announcements/ui/AnnouncementsCreatePage/CategorySelection/CategorySelection"
import { BasicInformation } from "@/features/announcements/ui/AnnouncementsCreatePage/BasicInformation/BasicInformation"
import { AdditionalDetails } from "@/features/announcements/ui/AnnouncementsCreatePage/AdditionalDetails/AdditionalDetails"
import { PreviewAndPublish } from "@/features/announcements/ui/AnnouncementsCreatePage/PreviewAndPublish/PreviewAndPublish"
import { useCreateConferenceMutation } from "@/features/announcements/api/createConferenceApi"
import type { CreateAnnouncementFormData } from "@/entities/announcement/model"
import styles from "./CreateAnnouncementPage.module.css"

const initialFormData: CreateAnnouncementFormData = {
  category: null,
  title: "",
  organizerName: "",
  organizerId: "",
  activeFrom: "",
  activeTo: "",
  location: {
    address: "",
    city: "",
  },
  format: "online",
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
  previewImage: "",
  isPromoted: false,
}

const STORAGE_KEY = "create-announcement-form"

export function CreateAnnouncementPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateAnnouncementFormData>(initialFormData)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [createConference, { isLoading: isSubmitting }] = useCreateConferenceMutation()

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

  useEffect(() => {
    if (alert) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [alert])

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

  const handleSaveDraft = async () => {
    if (isSubmitting) return

    setAlert(null)
    console.log("Saving draft with data:", { isDraft: true, formData })

    try {
      await createConference({ formData, status: "draft" }).unwrap()
      setAlert({ type: "success", message: "Черновик успешно сохранен!" })

      setTimeout(() => {
        sessionStorage.removeItem(STORAGE_KEY)
        router.push("/announcements")
      }, 1500)
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Не удалось сохранить черновик"
      console.log("Submitting announcement:", formData)
      setAlert({ type: "error", message: errorMessage })
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    setAlert(null)

    console.log("Submitting announcement with data:", { isDraft: false, formData })
    try {
      await createConference({ formData, status: "pending" }).unwrap()
      setAlert({ type: "success", message: "Объявление успешно отправлено на модерацию!" })
      console.log("Submitting announcement:", formData)

      setTimeout(() => {
        sessionStorage.removeItem(STORAGE_KEY)
        router.push("/announcements")
      }, 1500)
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Не удалось опубликовать объявление"
      console.log("Submitting announcement:", formData)
      setAlert({ type: "error", message: errorMessage })
    }
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
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        )
      case 3:
        return (
          <AdditionalDetails
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        )
      case 4:
        return (
          <PreviewAndPublish
            formData={formData}
            onUpdate={updateFormData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
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

      {alert && (
        <div className={styles.alertContainer}>
          <Alert variant={alert.type === "error" ? "danger" : "success"} dismissible onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </div>
      )}

      <div className={styles.content}>
        <h1 className={styles.title}>Создание объявления</h1>
        {renderCurrentStep()}
      </div>
    </div>
  )
}

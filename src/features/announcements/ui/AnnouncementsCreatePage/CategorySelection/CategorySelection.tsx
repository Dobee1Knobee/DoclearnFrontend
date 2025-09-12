"use client"

import type React from "react"

import { Calendar, Users, BookOpen, Video, Stethoscope, GraduationCap, Building, Wrench } from "lucide-react"
import type { AnnouncementType } from "@/entities/announcement/model"
import styles from "./CategorySelection.module.css"

interface CategoryOption {
  id: AnnouncementType
  title: string
  description: string
  icon: React.ComponentType<{ size?: number }>
}

const categories: CategoryOption[] = [
  {
    id: "conference",
    title: "Конференции",
    description: "Медицинские конференции и симпозиумы",
    icon: Calendar,
  },
  {
    id: "masterclass",
    title: "Мастер-классы",
    description: "Практические мастер-классы от экспертов",
    icon: Users,
  },
  {
    id: "webinar",
    title: "Вебинары",
    description: "Онлайн-лекции и вебинары",
    icon: Video,
  },
  {
    id: "course",
    title: "Курсы ПК",
    description: "Курсы повышения квалификации",
    icon: BookOpen,
  },
//   {
//     id: "internship",
//     title: "Стажировки",
//     description: "Стажировки и ординатура",
//     icon: Stethoscope,
//   },
  {
    id: "university",
    title: "ВУЗы",
    description: "Образовательные учреждения",
    icon: GraduationCap,
  },
  {
    id: "vacancy",
    title: "Вакансии",
    description: "Медицинские вакансии",
    icon: Building,
  },
//   {
//     id: "equipment",
//     title: "Оборудование",
//     description: "Медицинское оборудование",
//     icon: Wrench,
//   },
]

const enabledCategories: AnnouncementType[] = ["conference", "masterclass", "webinar"]

interface CategorySelectionProps {
  selectedCategory: AnnouncementType | null
  onCategorySelect: (category: AnnouncementType) => void
  onNext: () => void
}

export function CategorySelection({ selectedCategory, onCategorySelect, onNext }: CategorySelectionProps) {
  const handleCategoryClick = (categoryId: AnnouncementType) => {
    if (enabledCategories.includes(categoryId)) {
      onCategorySelect(categoryId)
    }
  }

  const handleNext = () => {
    if (selectedCategory) {
      onNext()
    }
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Выбор категории</h2>
      </div> */}

      <div className={styles.content}>
        <h3 className={styles.sectionTitle}>Выберите категорию объявления</h3>
        <p className={styles.sectionDescription}>Выберите тип объявления, которое хотите разместить</p>

        <div className={styles.categoriesGrid}>
          {categories.map((category) => {
            const IconComponent = category.icon
            const isSelected = selectedCategory === category.id
            const isEnabled = enabledCategories.includes(category.id)

            return (
              <button
                key={category.id}
                className={`${styles.categoryCard} ${isSelected ? styles.selected : ""} ${!isEnabled ? styles.disabled : ""}`}
                onClick={() => handleCategoryClick(category.id)}
                disabled={!isEnabled}
              >
                <div className={styles.categoryIcon}>
                  <IconComponent size={32} />
                </div>
                <h4 className={styles.categoryTitle}>{category.title}</h4>
                <p className={styles.categoryDescription}>{category.description}</p>
              </button>
            )
          })}
        </div>

        {selectedCategory && (
          <div className={styles.actions}>
            <button onClick={handleNext} className={styles.nextButton}>
              Далее
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

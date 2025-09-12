import styles from "./StepIndicator.module.css"

interface StepIndicatorProps {
  currentStep: number
}

const steps = [
  { number: 1, title: "Выбор категории" },
  { number: 2, title: "Основная информация" },
  { number: 3, title: "Дополнительные детали" },
  { number: 4, title: "Превью и публикация" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div key={step.number} className={styles.step}>
          <div className={`${styles.circle} ${currentStep >= step.number ? styles.active : ""}`}>{step.number}</div>
          <span className={`${styles.title} ${currentStep >= step.number ? styles.activeTitle : ""}`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`${styles.line} ${currentStep > step.number ? styles.activeLine : ""}`} />
          )}
        </div>
      ))}
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button, Spinner, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import styles from "../styles/AuthForm.module.css"
import { FormInput } from "../inputs/FormInput"
import { PasswordInput } from "../inputs/PasswordInput"
import { validateEmail, validatePassword } from "@/shared/lib/validation"
import { errorMessages } from "@/shared/lib/errorMessages"
import type { RegisterOrganizationDto } from "@/features/auth/model/types"

interface OrganizationRegistrationFormData extends Omit<RegisterOrganizationDto, "accountType"> {
  confirmPassword: string
  agreeToTerms: boolean
}

interface OrganizationRegistrationFormProps {
  onSuccess: () => void
}

const OrganizationRegistrationForm: React.FC<OrganizationRegistrationFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrganizationRegistrationFormData>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      description: "",
      legalForm: "",
      ogrn: "",
      inn: "",
      kpp: "",
      legalAddress: "",
      address: "",
      notificationEmail: "",
      workPhone: "",
      website: "",
      responsiblePerson: {
        fullName: "",
        position: "",
        email: "",
      },
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  const password = watch("password")

  const onSubmit = (data: OrganizationRegistrationFormData) => {
    console.log(">> Organization Registration payload (UI only):", data)
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <FormInput
        name="fullName"
        label="Полное наименование организации"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.fullName}
        placeholder="Введите полное наименование"
      />

      {/* <FormInput
        name="description"
        label="Описание деятельности"
        control={control}
        rules={{}}
        error={errors.description}
        placeholder="Краткое описание деятельности организации"
      />

      <FormInput
        name="legalForm"
        label="Организационно-правовая форма"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.legalForm}
        placeholder="ООО, АО, НКО и т.д."
      /> */}

      <FormInput
        name="inn"
        label="ИНН"
        control={control}
        rules={{
          required: errorMessages.required,
          pattern: {
            value: /^\d{10}$/,
            message: "ИНН должен содержать 10 цифр",
          },
        }}
        error={errors.inn}
        placeholder="Введите ИНН"
      />

      {/* <FormInput
        name="legalAddress"
        label="Юридический адрес"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.legalAddress}
        placeholder="Введите юридический адрес"
      />

      <FormInput
        name="address"
        label="Фактический адрес"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.address}
        placeholder="Введите фактический адрес"
      /> 

      <FormInput
        name="notificationEmail"
        label="Email для уведомлений"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validateEmail,
        }}
        error={errors.notificationEmail}
        placeholder="Введите email для официальных уведомлений"
        type="email"
      />

      <FormInput
        name="workPhone"
        label="Рабочий телефон"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.workPhone}
        placeholder="Введите рабочий телефон"
        type="tel"
      />

      <FormInput
        name="website"
        label="Веб-сайт"
        control={control}
        rules={{}}
        error={errors.website}
        placeholder="https://example.com"
        type="url"
      />*/}

      {/* <h6 className="mt-5 fs-5">Ответственное лицо</h6> */}

      {/* <FormInput
        name="responsiblePerson.fullName"
        label="ФИО ответственного лица"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.responsiblePerson?.fullName}
        placeholder="Введите ФИО руководителя"
      />

      <FormInput
        name="responsiblePerson.position"
        label="Должность"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.responsiblePerson?.position}
        placeholder="Введите должность"
      /> */}

      <FormInput
        name="responsiblePerson.email"
        label="Email ответственного лица"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validateEmail,
        }}
        error={errors.responsiblePerson?.email}
        placeholder="Введите email ответственного лица"
        type="email"
      />

      <PasswordInput
        name="password"
        label="Пароль"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validatePassword,
        }}
        error={errors.password}
        placeholder="Введите пароль"
      />

      <PasswordInput
        name="confirmPassword"
        label="Повторите пароль"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: (value: string) => {
            if (value !== password) {
              return errorMessages.passwordMismatch
            }
            return true
          },
        }}
        error={errors.confirmPassword}
        placeholder="Повторите пароль"
      />

      <Controller
        name="agreeToTerms"
        control={control}
        rules={{ required: "Для отправки формы необходимо Ваше согласие" }}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <>
            <Form.Check
              id="agreeToTerms"
              type="checkbox"
              name={name}
              ref={ref}
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              isInvalid={!!errors.agreeToTerms}
              label={
                <>
                  Я&nbsp;согласен&nbsp;с&nbsp;условиями{" "}
                  <a href="/user-agreement" target="_blank" rel="noopener noreferrer">
                    Пользовательского&nbsp;соглашения
                  </a>{" "}
                  и&nbsp;
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Политики&nbsp;конфиденциальности
                  </a>
                </>
              }
              feedback={errors.agreeToTerms?.message}
              className="mt-4 mb-2"
            >

            </Form.Check>
            {errors.agreeToTerms && (
              <Form.Control.Feedback type="invalid" className="d-block mb-3">
                {errors.agreeToTerms.message}
              </Form.Control.Feedback>
            )}
          </>
        )}
      />

      <Button variant="primary" type="submit" className={styles.btnCustom} disabled={isLoading}>
        {isLoading ? <Spinner animation="border" size="sm" /> : "Зарегистрировать организацию"}
      </Button>
    </form>
  )
}

export default OrganizationRegistrationForm

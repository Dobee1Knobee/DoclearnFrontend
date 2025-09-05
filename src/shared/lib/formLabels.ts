export const getFormLabels = (category: string) => {
  const labels = {
    conference: {
      title: "Название конференции",
      program: "Программа конференции",
      speakers: "Спикеры конференции",
      certificates: "Сертификат об участии",
      maxParticipants: "Максимальное количество участников",
      categories: "Категории конференции",
    },
    masterclass: {
      title: "Название мастер-класса",
      program: "Описание мастер-класса",
      speakers: "Инструкторы",
      certificates: "Сертификат об участии",
      maxParticipants: "Максимальное количество участников",
      categories: "Категории мастер-класса",
    },
    webinar: {
      title: "Название вебинара",
      program: "Описание вебинара",
      speakers: "Спикеры вебинара",
      certificates: "Сертификат об участии",
      maxParticipants: "Максимальное количество участников",
      categories: "Категории вебинара",
    },
  }

  return labels[category as keyof typeof labels] || labels.conference
}

export const getFieldsConfig = (category: string) => {
  const config = {
    conference: {
      showProgram: true,
      showSpeakers: true,
      showMaxParticipants: true,
      showCertificates: true,
      showScheduleUrl: true,
      showRegistrationRequired: true,
      showMaterials: false,
      showEquipment: false,
      showSkillLevel: false,
      showDuration: false,
      showPrerequisites: false,
      showPlatform: false,
      showRecording: false,
    },
    masterclass: {
      showProgram: false,
      showSpeakers: true,
      showMaxParticipants: true,
      showCertificates: true,
      showMaterials: true,
      showEquipment: true,
      showSkillLevel: true,
      showDuration: true,
      showPrerequisites: true,
      showPlatform: false,
      showRecording: false,
    },
    webinar: {
      showProgram: false,
      showSpeakers: true,
      showMaxParticipants: true,
      showCertificates: false,
      showPlatform: true,
      showRecording: true,
      showDuration: true,
      showPrerequisites: true,
      showMaterials: true,
      showSkillLevel: false,
      showEquipment: false,

    },
  }

  return config[category as keyof typeof config] || config.conference
}

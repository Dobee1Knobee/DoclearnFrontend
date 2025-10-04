import type React from "react"
import {
  BookOpen,
  Users,
  Award,
  Zap,
  Monitor,
  Video,
  Briefcase,
  DollarSign,
  Clock,
  User,
  Trophy,
  Target,
  Calendar,
  MapPin,
} from "lucide-react"
import { formatDate } from "@/shared/lib/formatters"
import type { Conference, Webinar, MasterClass, Vacancy, Olympiad } from "@/entities/announcement/model"
import styles from "./AnnouncementDetails.module.css"

interface AnnouncementDetailsProps {
  announcement: Conference | Webinar | MasterClass | Vacancy | Olympiad
}

export const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({ announcement }) => {
  const isConference = announcement.type === "Conference"
  const isWebinar = announcement.type === "Webinar"
  const isMasterClass = announcement.type === "Masterclass"
  const isVacancy = announcement.type === "Vacancy"
  const isOlympiad = announcement.type === "Olimpiad"

  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
      medical: "Медицина",
      it: "IT",
      educational: "Образование",
      business: "Бизнес",
      science: "Наука",
      other: "Другое",
    }
    return translations[category] || category
  }

  const translateAudience = (audience: string) => {
    const translations: Record<string, string> = {
      doctors: "Врачи",
      students: "Студенты",
      researchers: "Исследователи",
      specialists: "Специалисты",
      general: "Широкая аудитория",
    }
    return translations[audience] || audience
  }

  const translateSkillLevel = (level: string) => {
    const translations: Record<string, string> = {
      beginner: "Начинающий",
      intermediate: "Средний",
      advanced: "Продвинутый",
    }
    return translations[level] || level
  }

  const translatePlatform = (platform: string) => {
    const translations: Record<string, string> = {
      zoom: "Zoom",
      teams: "Microsoft Teams",
      youtube: "YouTube",
      google_meet: "Google Meet",
      yandex: "YandexТелемост",
      other: "Другая платформа",
    }
    return translations[platform] || platform
  }

  const translateEmploymentType = (type: string) => {
    const translations: Record<string, string> = {
      "full-time": "Полная занятость",
      "part-time": "Частичная занятость",
      contract: "Контракт",
      temporary: "Временная работа",
      internship: "Стажировка",
    }
    return translations[type] || type
  }

  const translateWorkFormat = (format: string) => {
    const translations: Record<string, string> = {
      office: "Офис",
      remote: "Удаленно",
      hybrid: "Гибридный формат",
    }
    return translations[format] || format
  }

  const translateOlympiadLevel = (level: string) => {
    const translations: Record<string, string> = {
      intrauniversity: "Внутривузовская",
      regional: "Региональная",
      national: "Всероссийская",
      international: "Международная",
    }
    return translations[level] || level
  }

  const translateCompetitionFormat = (format: string) => {
    const translations: Record<string, string> = {
      individual: "Индивидуальный",
      team: "Командный",
      both: "Индивидуальный и командный",
    }
    return translations[format] || format
  }

  const translateOlympiadSubject = (subject: string) => {
    const translations: Record<string, string> = {
      anatomy: "Анатомия",
      physiology: "Физиология",
      biochemistry: "Биохимия",
      pathology: "Патология",
      pharmacology: "Фармакология",
      histology: "Гистология",
      embryology: "Эмбриология",
      microbiology: "Микробиология",
      internal_medicine: "Внутренние болезни",
      surgery: "Хирургия",
      pediatrics: "Педиатрия",
      radiology: "Лучевая диагностика",
      statistics: "Статистика",
      public_health: "Общественное здоровье",
      ethics: "Медицинская этика",
      first_aid: "Первая помощь",
      other: "Другое",
    }
    return translations[subject] || subject
  }

  const translateEducationLevel = (level: string) => {
    const translations: Record<string, string> = {
      high_school: "Школьники",
      medical_undergraduate: "Студенты медицинских вузов",
      medical_postgraduate: "Ординаторы и аспиранты",
      mixed: "Смешанная группа",
    }
    return translations[level] || level
  }

  const translateExamKind = (kind: string) => {
    const translations: Record<string, string> = {
      mcq: "Тестирование",
      free_response: "Развернутые ответы",
      osce: "Практические станции (OSCE)",
      case: "Клинические кейсы",
      practical: "Практические задания",
      team_bowl: "Командные раунды",
      presentation: "Презентации/постеры",
    }
    return translations[kind] || kind
  }

  const translateAwardType = (type: string) => {
    const translations: Record<string, string> = {
      gold: "Золотая медаль",
      silver: "Серебряная медаль",
      bronze: "Бронзовая медаль",
      first_place: "Первое место",
      honorable_mention: "Почетная грамота",
      cash: "Денежная премия",
      scholarship: "Стипендия",
      certificate: "Сертификат",
      trophy: "Кубок",
      qualification: "Отбор на следующий уровень",
    }
    return translations[type] || type
  }

  const formatSalary = (salary: any) => {
    if (!salary) return "Не указана"

    const { min, max, currency, negotiable } = salary
    let result = ""

    if (min && max) {
      result = `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`
    } else if (min) {
      result = `от ${min.toLocaleString()} ${currency}`
    } else if (max) {
      result = `до ${max.toLocaleString()} ${currency}`
    }

    if (negotiable) {
      result += " (возможен торг)"
    }

    return result || "По договоренности"
  }

  return (
    <div className={styles.details}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <p className={styles.description}>{announcement.description}</p>
      </section>

      {isOlympiad && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Trophy size={20} className={styles.sectionIcon} />
              Детали олимпиады
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Уровень:</span>
                <span className={styles.detailValue}>
                  {translateOlympiadLevel((announcement as Olympiad).olympiadLevel)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Формат участия:</span>
                <span className={styles.detailValue}>
                  {translateCompetitionFormat((announcement as Olympiad).competitionFormat)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Предметы:</span>
                <div className={styles.categories}>
                  {(announcement as Olympiad).subjects.map((subject, index) => (
                    <span key={index} className={styles.categoryTag}>
                      {translateOlympiadSubject(subject)}
                    </span>
                  ))}
                </div>
              </div>
              {(announcement as Olympiad).maxParticipants && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Максимум участников:</span>
                  <span className={styles.detailValue}>{(announcement as Olympiad).maxParticipants} человек</span>
                </div>
              )}
              {(announcement as Olympiad).currentParticipants && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Зарегистрировано:</span>
                  <span className={styles.detailValue}>{(announcement as Olympiad).currentParticipants} человек</span>
                </div>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Target size={20} className={styles.sectionIcon} />
              Требования к участникам
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Уровень образования:</span>
                <span className={styles.detailValue}>
                  {translateEducationLevel((announcement as Olympiad).eligibility.educationLevel)}
                </span>
              </div>
              {(announcement as Olympiad).eligibility.yearsAllowed && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Курсы:</span>
                  <span className={styles.detailValue}>
                    {Array.isArray((announcement as Olympiad).eligibility.yearsAllowed)
                      ? `${(announcement as Olympiad).eligibility.yearsAllowed!.min || 1}-${(announcement as Olympiad).eligibility.yearsAllowed!.max || 6}`
                      : "Любые"}
                  </span>
                </div>
              )}
              {(announcement as Olympiad).eligibility.specialtiesAllowed && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Специальности:</span>
                  <div className={styles.categories}>
                    {(announcement as Olympiad).eligibility.specialtiesAllowed!.map((specialty, index) => (
                      <span key={index} className={styles.categoryTag}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(announcement as Olympiad).eligibility.ageMin && (announcement as Olympiad).eligibility.ageMax && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Возраст:</span>
                  <span className={styles.detailValue}>
                    {(announcement as Olympiad).eligibility.ageMin} - {(announcement as Olympiad).eligibility.ageMax}{" "}
                    лет
                  </span>
                </div>
              )}
            </div>
            {(announcement as Olympiad).eligibility.prerequisites && (
              <div className={styles.requirementItem}>
                <span className={styles.requirementLabel}>Предварительные требования:</span>
                <ul className={styles.list}>
                  {(announcement as Olympiad).eligibility.prerequisites!.map((req, index) => (
                    <li key={index} className={styles.listItem}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {(announcement as Olympiad).teamRules && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Users size={20} className={styles.sectionIcon} />
                Правила для команд
              </h2>
              <div className={styles.detailsGrid}>
                {(announcement as Olympiad).teamRules!.minSize && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Минимальный размер команды:</span>
                    <span className={styles.detailValue}>{(announcement as Olympiad).teamRules!.minSize} человек</span>
                  </div>
                )}
                {(announcement as Olympiad).teamRules!.maxSize && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Максимальный размер команды:</span>
                    <span className={styles.detailValue}>{(announcement as Olympiad).teamRules!.maxSize} человек</span>
                  </div>
                )}
                {(announcement as Olympiad).teamRules!.sameInstitutionRequired !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Одно учебное заведение:</span>
                    <span className={styles.detailValue}>
                      {(announcement as Olympiad).teamRules!.sameInstitutionRequired ? "Обязательно" : "Не обязательно"}
                    </span>
                  </div>
                )}
                {(announcement as Olympiad).teamRules!.supervisorRequired !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Научный руководитель:</span>
                    <span className={styles.detailValue}>
                      {(announcement as Olympiad).teamRules!.supervisorRequired ? "Обязателен" : "Не обязателен"}
                    </span>
                  </div>
                )}
              </div>
              {(announcement as Olympiad).teamRules!.notes && (
                <p className={styles.prerequisites}>{(announcement as Olympiad).teamRules!.notes}</p>
              )}
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} className={styles.sectionIcon} />
              Этапы олимпиады
            </h2>
            {(announcement as Olympiad).rounds.map((round, index) => (
              <div key={index} className={styles.requirementItem}>
                <span className={styles.requirementLabel}>{round.name}:</span>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Формат:</span>
                    <span className={styles.detailValue}>
                      {round.mode === "online" ? "Онлайн" : round.mode === "offline" ? "Офлайн" : "Гибридный"}
                    </span>
                  </div>
                  {round.dateFrom && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Дата:</span>
                      <span className={styles.detailValue}>
                        {formatDate(round.dateFrom)}
                        {round.dateTo && ` - ${formatDate(round.dateTo)}`}
                      </span>
                    </div>
                  )}
                  {round.durationMinutes && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Продолжительность:</span>
                      <span className={styles.detailValue}>{round.durationMinutes} минут</span>
                    </div>
                  )}
                  {round.weightPercent && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Вес в итоговой оценке:</span>
                      <span className={styles.detailValue}>{round.weightPercent}%</span>
                    </div>
                  )}
                </div>
                {round.subjects && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Предметы:</span>
                    <div className={styles.categories}>
                      {round.subjects.map((subject, idx) => (
                        <span key={idx} className={styles.categoryTag}>
                          {translateOlympiadSubject(subject)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {round.examKinds && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Типы заданий:</span>
                    <div className={styles.categories}>
                      {round.examKinds.map((kind, idx) => (
                        <span key={idx} className={styles.categoryTag}>
                          {translateExamKind(kind)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {round.description && <p className={styles.prerequisites}>{round.description}</p>}
              </div>
            ))}
          </section>

          {(announcement as Olympiad).awards && (announcement as Olympiad).awards!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Award size={20} className={styles.sectionIcon} />
                Награды и призы
              </h2>
              {(announcement as Olympiad).awards!.map((award, index) => (
                <div key={index} className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>{award.title || translateAwardType(award.type)}:</span>
                  {award.details && <p className={styles.prerequisites}>{award.details}</p>}
                  {award.monetaryAmount && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Размер премии:</span>
                      <span className={styles.detailValue}>
                        {award.monetaryAmount.toLocaleString()} {award.currency}
                      </span>
                    </div>
                  )}
                  {award.qualifiesFor && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Дает право участия в:</span>
                      <span className={styles.detailValue}>{award.qualifiesFor}</span>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {(announcement as Olympiad).jury && (announcement as Olympiad).jury!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <User size={20} className={styles.sectionIcon} />
                Жюри
              </h2>
              {(announcement as Olympiad).jury!.map((member, index) => (
                <div key={index} className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>{member.name}</span>
                  {member.role && <p className={styles.prerequisites}>{member.role}</p>}
                  {member.affiliation && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Организация:</span>
                      <span className={styles.detailValue}>{member.affiliation}</span>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {(announcement as Olympiad).logistics && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <MapPin size={20} className={styles.sectionIcon} />
                Логистика
              </h2>
              <div className={styles.detailsGrid}>
                {(announcement as Olympiad).logistics!.accommodationProvided !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Размещение:</span>
                    <span className={styles.detailValue}>
                      {(announcement as Olympiad).logistics!.accommodationProvided
                        ? "Предоставляется"
                        : "Не предоставляется"}
                    </span>
                  </div>
                )}
                {(announcement as Olympiad).logistics!.travelReimbursed && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Компенсация проезда:</span>
                    <span className={styles.detailValue}>
                      {(announcement as Olympiad).logistics!.travelReimbursed === "full"
                        ? "Полная"
                        : (announcement as Olympiad).logistics!.travelReimbursed === "partial"
                          ? "Частичная"
                          : "Не предоставляется"}
                    </span>
                  </div>
                )}
                {(announcement as Olympiad).logistics!.mealsProvided !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Питание:</span>
                    <span className={styles.detailValue}>
                      {(announcement as Olympiad).logistics!.mealsProvided ? "Предоставляется" : "Не предоставляется"}
                    </span>
                  </div>
                )}
                {(announcement as Olympiad).logistics!.visaSupport !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Визовая поддержка:</span>
                    <span className={styles.detailValue}>
                      {(announcement as Olympiad).logistics!.visaSupport ? "Предоставляется" : "Не предоставляется"}
                    </span>
                  </div>
                )}
              </div>
              {(announcement as Olympiad).logistics!.notes && (
                <p className={styles.prerequisites}>{(announcement as Olympiad).logistics!.notes}</p>
              )}
            </section>
          )}

          {(announcement as Olympiad).documentsRequired && (announcement as Olympiad).documentsRequired!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={20} className={styles.sectionIcon} />
                Необходимые документы
              </h2>
              <ul className={styles.list}>
                {(announcement as Olympiad).documentsRequired!.map((doc, index) => (
                  <li key={index} className={styles.listItem}>
                    {doc}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {isVacancy && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Briefcase size={20} className={styles.sectionIcon} />
              Детали вакансии
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Должность:</span>
                <span className={styles.detailValue}>{(announcement as Vacancy).position}</span>
              </div>
              {(announcement as Vacancy).department && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Отдел:</span>
                  <span className={styles.detailValue}>{(announcement as Vacancy).department}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Тип занятости:</span>
                <span className={styles.detailValue}>
                  {translateEmploymentType((announcement as Vacancy).employmentType)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Формат работы:</span>
                <span className={styles.detailValue}>{translateWorkFormat((announcement as Vacancy).workFormat)}</span>
              </div>
              {(announcement as Vacancy).schedule && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>График работы:</span>
                  <span className={styles.detailValue}>{(announcement as Vacancy).schedule}</span>
                </div>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <DollarSign size={20} className={styles.sectionIcon} />
              Заработная плата
            </h2>
            <div className={styles.salaryInfo}>{formatSalary((announcement as Vacancy).salary)}</div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <BookOpen size={20} className={styles.sectionIcon} />
              Требования
            </h2>
            <div className={styles.requirements}>
              <div className={styles.requirementItem}>
                <span className={styles.requirementLabel}>Образование:</span>
                <p className={styles.requirementValue}>{(announcement as Vacancy).requirements.education}</p>
              </div>
              <div className={styles.requirementItem}>
                <span className={styles.requirementLabel}>Опыт работы:</span>
                <p className={styles.requirementValue}>{(announcement as Vacancy).requirements.experience}</p>
              </div>
              {(announcement as Vacancy).requirements.skills.length > 0 && (
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>Навыки:</span>
                  <ul className={styles.list}>
                    {(announcement as Vacancy).requirements.skills.map((skill, index) => (
                      <li key={index} className={styles.listItem}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(announcement as Vacancy).requirements.certifications &&
                (announcement as Vacancy).requirements.certifications!.length > 0 && (
                  <div className={styles.requirementItem}>
                    <span className={styles.requirementLabel}>Сертификаты:</span>
                    <ul className={styles.list}>
                      {(announcement as Vacancy).requirements.certifications!.map((cert, index) => (
                        <li key={index} className={styles.listItem}>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {(announcement as Vacancy).requirements.languages &&
                (announcement as Vacancy).requirements.languages!.length > 0 && (
                  <div className={styles.requirementItem}>
                    <span className={styles.requirementLabel}>Языки:</span>
                    <ul className={styles.list}>
                      {(announcement as Vacancy).requirements.languages!.map((lang, index) => (
                        <li key={index} className={styles.listItem}>
                          {lang}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} className={styles.sectionIcon} />
              Обязанности
            </h2>
            <ul className={styles.list}>
              {(announcement as Vacancy).responsibilities.map((responsibility, index) => (
                <li key={index} className={styles.listItem}>
                  {responsibility}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Award size={20} className={styles.sectionIcon} />
              Что мы предлагаем
            </h2>
            <ul className={styles.list}>
              {(announcement as Vacancy).benefits.map((benefit, index) => (
                <li key={index} className={styles.listItem}>
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          {(announcement as Vacancy).hiringManager && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <User size={20} className={styles.sectionIcon} />
                Контактное лицо
              </h2>
              <div className={styles.hiringManager}>
                <div className={styles.managerInfo}>
                  <div className={styles.managerName}>{(announcement as Vacancy).hiringManager.name}</div>
                  {(announcement as Vacancy).hiringManager.position && (
                    <div className={styles.managerPosition}>{(announcement as Vacancy).hiringManager.position}</div>
                  )}
                </div>
              </div>
            </section>
          )}

          {(announcement as Vacancy).applicationDeadline && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Clock size={20} className={styles.sectionIcon} />
                Срок подачи заявок
              </h2>
              <p className={styles.deadline}>До {formatDate((announcement as Vacancy).applicationDeadline!)}</p>
            </section>
          )}
        </>
      )}

      {isConference && (announcement as Conference).program && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={20} className={styles.sectionIcon} />
            Программа мероприятия
          </h2>
          {/* <div className={styles.program}>
            {(announcement as Conference).program!.split("\n").map((line, index) => (
              <p key={index} className={styles.programLine}>
                {line}
              </p>
            ))}
          </div> */}
          <div className={styles.program}>
            <div className={styles.programText}>
              {(announcement as Conference).program}
            </div>
          </div>
        </section>
      )}

      {isMasterClass && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} className={styles.sectionIcon} />
              Детали мастер-класса
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Уровень сложности:</span>
                <span className={styles.detailValue}>
                  {translateSkillLevel((announcement as MasterClass).skillLevel)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Продолжительность:</span>
                <span className={styles.detailValue}>{(announcement as MasterClass).duration} часов</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Максимум участников:</span>
                <span className={styles.detailValue}>{(announcement as MasterClass).maxParticipants} человек</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Текущее количество:</span>
                <span className={styles.detailValue}>{(announcement as MasterClass).currentParticipants} человек</span>
              </div>
            </div>
          </section>

          {(announcement as MasterClass).materials && (announcement as MasterClass).materials!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={20} className={styles.sectionIcon} />
                Необходимые материалы
              </h2>
              <ul className={styles.list}>
                {(announcement as MasterClass).materials!.map((material, index) => (
                  <li key={index} className={styles.listItem}>
                    {material}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(announcement as MasterClass).equipment && (announcement as MasterClass).equipment!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Monitor size={20} className={styles.sectionIcon} />
                Предоставляемое оборудование
              </h2>
              <ul className={styles.list}>
                {(announcement as MasterClass).equipment!.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(announcement as MasterClass).prerequisites && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Предварительные требования</h2>
              <p className={styles.prerequisites}>{(announcement as MasterClass).prerequisites}</p>
            </section>
          )}
        </>
      )}

      {isWebinar && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Video size={20} className={styles.sectionIcon} />
              Детали вебинара
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Платформа:</span>
                <span className={styles.detailValue}>{translatePlatform((announcement as Webinar).platform)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Продолжительность:</span>
                <span className={styles.detailValue}>{(announcement as Webinar).duration} минут</span>
              </div>
              {(announcement as Webinar).participantLimit && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Лимит участников:</span>
                  <span className={styles.detailValue}>{(announcement as Webinar).participantLimit} человек</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Запись:</span>
                <span className={styles.detailValue}>
                  {(announcement as Webinar).isRecorded ? "Будет доступна" : "Не предусмотрена"}
                </span>
              </div>
            </div>
          </section>

          {(announcement as Webinar).prerequisites && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Предварительные требования</h2>
              <p className={styles.prerequisites}>{(announcement as Webinar).prerequisites}</p>
            </section>
          )}

          {(announcement as Webinar).materials && (announcement as Webinar).materials!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={20} className={styles.sectionIcon} />
                Материалы
              </h2>
              <ul className={styles.list}>
                {(announcement as Webinar).materials!.map((material, index) => (
                  <li key={index} className={styles.listItem}>
                    {material}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Users size={20} className={styles.sectionIcon} />
          Дополнительная информация
        </h2>
        <div className={styles.detailsGrid}>
          {announcement.categories && announcement.categories.length > 0 && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Категории:</span>
              <div className={styles.categories}>
                {announcement.categories.map((category, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {translateCategory(category)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(announcement as any).targetAudience && (announcement as any).targetAudience.length > 0 && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Целевая аудитория:</span>
              <div className={styles.audience}>
                {(announcement as any).targetAudience.map((audience: string, index: number) => (
                  <span key={index} className={styles.audienceTag}>
                    {translateAudience(audience)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Язык проведения:</span>
            <span className={styles.detailValue}>
              {(announcement as any).language === "ru"
                ? "Русский"
                : (announcement as any).language === "en"
                  ? "Английский"
                  : "Многоязычный"}
            </span>
          </div>

          {(announcement as any).certificates && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Сертификаты:</span>
              <span className={styles.certificateText}>Выдаются</span>
            </div>
          )}
        </div>
      </section>

      {announcement.tags && announcement.tags.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Теги</h2>
          <div className={styles.tags}>
            {announcement.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

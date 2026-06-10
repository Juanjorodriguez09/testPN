import { ApplicationStatus } from "../application/enum/application-status.enum";
import { IndustryType } from "../company/enum/industry-type.enum";
import { Career } from "../student/enum/career.enum";
import { Modality } from "../vacancie/enum/modality.enum";
import { VacancieStatus } from "../vacancie/enum/vacancie-status.enum";

export const CONSTANTS_REGISTRY: Record<string, object> = {
  'career': Career,
  'industry-type': IndustryType,
  'modality': Modality,
  'vacancie-status': VacancieStatus,
  'application-status': ApplicationStatus
};
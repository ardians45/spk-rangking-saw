export type CriterionType = 'benefit' | 'cost';

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  type: CriterionType;
}

export interface Alternative {
  id: string;
  name: string;
}

export interface Assessment {
  alternativeId: string;
  criterionId: string;
  value: number;
}

export interface AppData {
  criteria: Criterion[];
  alternatives: Alternative[];
  assessments: Assessment[];
}

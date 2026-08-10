export interface KnowledgePoint {
  id: string;
  name: string;
  grade: number;
  subject: string;
  chapter: string | null;
  unit: number | null;
  difficulty: number;
  created_at: string;
}

export interface Question {
  id: string;
  knowledge_point_id: string;
  content: string;
  question_type: string;
  options: string | null;
  correct_answer: string;
  difficulty: number;
  source_type: string;
  source_name: string | null;
  explanation: string | null;
  image_url: string | null;
  geogebra_id: string | null;
  created_at: string;
}

// ==============================================================================
// 🏷️ LaraQuest Core Types
// ==============================================================================

export type ChallengeType =
  | 'mcq'
  | 'drag-drop'
  | 'fill-blank'
  | 'sql-writer'
  | 'api-simulator'
  | 'error-debugger'
  | 'artisan-terminal'
  | 'migration-builder';

export interface SqlMockResult {
  columns: string[];
  rows: Record<string, any>[];
  totalCount?: number;
  executionMs?: number;
}

export interface ApiSimulatorTarget {
  expectedMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  expectedEndpoint: string;
  expectedHeaders?: Record<string, string>;
  requiredBodyKeys?: string[];
  defaultMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  defaultEndpoint?: string;
  defaultHeaders?: Record<string, string>;
  defaultBody?: string;
  response: {
    status: number;
    statusText: string;
    timeMs?: number;
    headers?: Record<string, string>;
    body: any;
  };
}

export interface DebuggerFixOption {
  id: string;
  label: string;
  codeDiff: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ArtisanTerminalTarget {
  targetCommand: string;
  acceptableCommands?: string[];
  availableCommands?: string[]; // for quick chip suggestions
  initialCommand?: string;
  customOutputs?: Record<string, string | string[]>;
  expectedResultSnippet?: string;
  hints?: string[];
}

export interface MigrationColumnDef {
  id: string;
  name: string;
  type:
    | 'id'
    | 'string'
    | 'text'
    | 'integer'
    | 'bigInteger'
    | 'boolean'
    | 'timestamp'
    | 'timestamps'
    | 'foreignId'
    | 'decimal'
    | 'enum'
    | 'json';
  nullable?: boolean;
  unique?: boolean;
  default?: string;
  foreignTable?: string;
  cascadeDelete?: boolean;
  enumValues?: string[];
}

export interface MigrationBuilderTarget {
  tableName: string;
  initialColumns?: MigrationColumnDef[];
  targetColumns: {
    name: string;
    type: string;
    nullable?: boolean;
    unique?: boolean;
    cascadeDelete?: boolean;
    foreignTable?: string;
  }[];
  instructionPrompt?: string;
  hints?: string[];
}

export interface Challenge {
  type: ChallengeType;
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xp?: number;
  items?: string[]; // for drag-drop
  blanks?: string[]; // for fill-blank

  // For sql-writer
  schemaContext?: string;
  initialSql?: string;
  sqlKeywords?: string[];
  mockResult?: SqlMockResult;
  acceptableQueries?: string[];

  // For api-simulator
  apiTarget?: ApiSimulatorTarget;

  // For error-debugger
  errorLog?: string;
  errorType?: string;
  errorFile?: string;
  errorLine?: number;
  buggyCode?: string;
  fixOptions?: DebuggerFixOption[];

  // For artisan-terminal
  artisanTarget?: ArtisanTerminalTarget;

  // For migration-builder
  migrationTarget?: MigrationBuilderTarget;
}

export interface FlutterParallel {
  concept: string;
  flutterCode: string;
  laravelCode: string;
  flutterFile?: string;
  laravelFile?: string;
  explanation: string;
}

export interface TableColumn {
  name: string;
  type: string;
  constraints?: string[];
  key?: 'PK' | 'FK';
  unique?: boolean;
  nullable?: boolean;
  ref?: { table: string; col: string };
}

export interface SchemaTable {
  name: string;
  columns: TableColumn[];
  relations?: { table: string; via: string }[];
  position?: { x: number; y: number };
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  readTime: string;
  xp: number;
  summary: string;
  flutterParallel: FlutterParallel;
  content: string[];
  challenge: Challenge;
  schema?: SchemaTable[];
}

export type TrackId = 'track-1' | 'track-2' | 'track-3' | 'track-4';

export interface Track {
  id: TrackId;
  number: number;
  title: string;
  tagline: string;
  color: string;
}

export type ModuleIcon =
  | 'database'
  | 'code'
  | 'server'
  | 'git-merge'
  | 'sparkles'
  | 'link'
  | 'controller'
  | 'globe'
  | 'shield-check'
  | 'package'
  | 'key'
  | 'sliders'
  | 'upload-cloud'
  | 'bell'
  | 'activity'
  | 'terminal'
  | 'orm'
  | 'json'
  | 'shield';

export interface Module {
  id: string;
  index?: number;
  trackId?: TrackId;
  trackName?: string;
  title: string;
  tagline?: string;
  description: string;
  icon: ModuleIcon | string;
  color: string;
  lessons: Lesson[];
  totalXp?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  xp: number;
  streak: number;
  level: number;
  created_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category?: 'streak' | 'modules' | 'challenges' | 'speed' | 'mastery';
  unlocked_at?: string | null;
  progress?: number;
  max_progress?: number;
}

export interface UserProgressState {
  xp: number;
  streak: number;
  level: number;
  completedLessons: string[];
  completedChallenges: string[];
  achievements: Achievement[];
  isLoading: boolean;
  isStreakAtRisk: boolean;
}

export type ActiveView = 
  | { name: 'dashboard' }
  | { name: 'lesson'; lessonId: string }
  | { name: 'playground' }
  | { name: 'profile' }
  | { name: 'roadmap' };

export interface Flashcard {
  id: string;
  category: string;
  flutterConcept: string;
  laravelConcept: string;
  flutterSnippet: string;
  laravelSnippet: string;
  explanation: string;
  moduleId?: string;
  lessonId?: string;
}

export interface LessonNote {
  lessonId: string;
  note: string;
  updatedAt: string;
}


/* ------------------------------------------------------------------ */
/*  LaraQuest — Master Curriculum Data (4 Tracks, 16 Modules)         */
/* ------------------------------------------------------------------ */

export type ChallengeType =
  | "mcq"
  | "drag-drop"
  | "fill-blank"
  | "sql-writer"
  | "api-simulator"
  | "error-debugger"
  | "artisan-terminal"
  | "migration-builder";

export interface Challenge {
  type: ChallengeType;
  question: string;
  /** Optional code snippet (use {{blank}} as the slot for fill-blank). */
  code?: string;
  options?: string[];
  /** MCQ: option index · fill-blank: exact option string · drag-drop: items joined with "→" */
  correctAnswer: string | number;
  explanation: string;
  xp?: number;
  [key: string]: any;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  readTime: string;
  xp: number;
  summary: string;
  flutterParallel: {
    concept: string;
    flutterCode: string;
    laravelCode: string;
    flutterFile?: string;
    laravelFile?: string;
    explanation: string;
  };
  content: string[];
  challenge: Challenge;
}

export type ModuleIcon =
  | "database"
  | "code"
  | "server"
  | "git-merge"
  | "sparkles"
  | "link"
  | "controller"
  | "globe"
  | "shield-check"
  | "package"
  | "key"
  | "sliders"
  | "upload-cloud"
  | "bell"
  | "activity"
  | "terminal"
  | "layers"
  | "workflow"
  | "lock"
  | "bug"
  | "zap"
  | "hard-drive"
  | "orm"
  | "json"
  | "shield";

export interface Module {
  id: string;
  index: number;
  trackId: string;
  trackName: string;
  title: string;
  tagline: string;
  description: string;
  color: string;
  icon: ModuleIcon;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  number: number;
  title: string;
  tagline: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: "track-1",
    number: 1,
    title: "Foundations & Server Mental Model",
    tagline: "Relational database design, modern PHP 8, request lifecycle, and migrations",
    color: "#38bdf8",
  },
  {
    id: "track-2",
    number: 2,
    title: "The Eloquent Engine & Business Logic",
    tagline: "ActiveRecord ORM, relational data modeling, N+1 optimization, and controllers",
    color: "#a78bfa",
  },
  {
    id: "track-3",
    number: 3,
    title: "Production REST API Mastery",
    tagline: "RESTful contracts, FormRequests, 422 error envelopes, Sanctum auth, and cursor pagination",
    color: "#f43f5e",
  },
  {
    id: "track-4",
    number: 4,
    title: "Advanced API Engineering & DevOps",
    tagline: "Multipart file uploads, background queues, Redis caching, rate limiting, and automated testing",
    color: "#34d399",
  },
  {
    id: "track-5",
    number: 5,
    title: "Real-World Architecture & Patterns",
    tagline: "Service layer, repositories, single-responsibility actions, DTOs, events, listeners, policies, and global error handling",
    color: "#fbbf24",
  },
  {
    id: "track-6",
    number: 6,
    title: "Database Mastery & Performance",
    tagline: "Polymorphic relations, EXPLAIN ANALYZE, composite indexes, multi-tenancy RLS, and zero-downtime migrations",
    color: "#06b6d4",
  },
];

/* ---------------------------- visuals ----------------------------- */

export interface SchemaColumnDef {
  name: string;
  type: string;
  key?: "PK" | "FK";
  unique?: boolean;
  nullable?: boolean;
  ref?: { table: string; col: string };
}

export interface SchemaTableDef {
  name: string;
  color: string;
  badge?: string;
  columns: SchemaColumnDef[];
}

export interface LifecycleStep {
  icon: string;
  title: string;
  sub: string;
  tone?: "default" | "danger" | "success";
}

export type LessonVisual =
  | { kind: "schema"; tables: SchemaTableDef[]; note?: string }
  | { kind: "lifecycle"; steps: LifecycleStep[]; note?: string }
  | { kind: "pipeline"; nodes: { label: string; lang: string; code: string }[]; note?: string };

/* ------------------------- shared schemas ------------------------- */

const USERS_TABLE: SchemaTableDef = {
  name: "users",
  color: "#38bdf8",
  badge: "identity",
  columns: [
    { name: "id", type: "bigint unsigned", key: "PK" },
    { name: "name", type: "varchar(255)" },
    { name: "email", type: "varchar(255)", unique: true },
    { name: "password", type: "varchar(255)" },
    { name: "created_at", type: "timestamp", nullable: true },
  ],
};

const POSTS_TABLE: SchemaTableDef = {
  name: "posts",
  color: "#f43f5e",
  badge: "content",
  columns: [
    { name: "id", type: "bigint unsigned", key: "PK" },
    { name: "user_id", type: "bigint unsigned", key: "FK", ref: { table: "users", col: "id" } },
    { name: "title", type: "varchar(255)" },
    { name: "body", type: "text" },
    { name: "published", type: "tinyint(1)" },
    { name: "created_at", type: "timestamp", nullable: true },
  ],
};

const ORDERS_TABLE: SchemaTableDef = {
  name: "orders",
  color: "#34d399",
  badge: "orders",
  columns: [
    { name: "id", type: "bigint unsigned", key: "PK" },
    { name: "user_id", type: "bigint unsigned", key: "FK", ref: { table: "users", col: "id" } },
    { name: "total_amount", type: "decimal(10,2)" },
    { name: "status", type: "varchar(32)" },
    { name: "created_at", type: "timestamp" },
  ],
};

const ORDER_ITEMS_TABLE: SchemaTableDef = {
  name: "order_items",
  color: "#fbbf24",
  badge: "items",
  columns: [
    { name: "id", type: "bigint unsigned", key: "PK" },
    { name: "order_id", type: "bigint unsigned", key: "FK", ref: { table: "orders", col: "id" } },
    { name: "product_id", type: "bigint unsigned", key: "FK" },
    { name: "quantity", type: "int" },
    { name: "unit_price", type: "decimal(10,2)" },
  ],
};

const TOKENS_TABLE: SchemaTableDef = {
  name: "personal_access_tokens",
  color: "#a78bfa",
  badge: "sanctum",
  columns: [
    { name: "id", type: "bigint unsigned", key: "PK" },
    { name: "tokenable_id", type: "bigint unsigned", key: "FK", ref: { table: "users", col: "id" } },
    { name: "name", type: "varchar(255)" },
    { name: "token", type: "varchar(64)", unique: true },
    { name: "last_used_at", type: "timestamp", nullable: true },
  ],
};

/* ---------------------------- modules ----------------------------- */

export const modules: Module[] = [
  // ==============================================================================
  // TRACK 1: FOUNDATIONS & SERVER MENTAL MODEL
  // ==============================================================================

  {
    id: "m1",
    index: 1,
    trackId: "track-1",
    trackName: "Track 1: Foundations",
    title: "Relational Database Design & Schema Architecture",
    tagline: "Model data like the server does",
    description:
      "Tables, foreign keys and normalization — the durable truth layer that every Flutter client ultimately reads from.",
    color: "#38bdf8",
    icon: "database",
    lessons: [
      {
        id: "m1l1",
        moduleId: "m1",
        title: "Thinking in Tables, Not Widgets",
        readTime: "6 min",
        xp: 40,
        summary:
          "Your app state lives in widgets; the server's truth lives in rows. Learn how tables, columns and types replace blobs of loosely-typed JSON.",
        flutterParallel: {
          concept: "A Dart class is a shape in memory — a table is a shape the database enforces",
          flutterFile: "lib/models/user.dart",
          laravelFile: "database/migrations/xxxx_create_users_table.php",
          flutterCode: `class User {
  final int id;
  final String email;
  final DateTime createdAt;

  User({required this.id, required this.email,
        required this.createdAt});
}`,
          laravelCode: `Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamps();
});`,
          explanation:
            "In Flutter, a class describes what a User looks like while the app runs. On the server, the schema is that description — but it is enforced on every write, for every client, forever. No malformed row ever gets in.",
        },
        content: [
          "A table is a typed collection: the schema is a contract the database enforces on every insert — not a convention your code hopes other devs follow.",
          "Columns carry SQL types (varchar, bigint, timestamp) like Dart's type system, except the database rejects invalid data for iOS, Android and web clients simultaneously.",
          "Widgets render ephemeral state; rows are durable truth. Two Flutter clients reading row #42 always see the exact same data — that's what 'single source of truth' means.",
          "Constraints like ->unique() are database-level guarantees: no race condition between two simultaneous signups can ever produce duplicate emails.",
        ],
        challenge: {
          type: "sql-writer",
          question: "Write a SQL query to retrieve all active users from the 'users' table who have the role of 'admin'.",
          schemaContext: "users (id, name, email, role, is_active, created_at)",
          initialSql: "SELECT * FROM users ",
          sqlKeywords: [
            "SELECT",
            "FROM",
            "WHERE",
            "AND",
            "ORDER BY",
            "role = 'admin'",
            "is_active = 1",
          ],
          correctAnswer: "SELECT * FROM users WHERE role = 'admin' AND is_active = 1",
          acceptableQueries: [
            "SELECT * FROM users WHERE role = 'admin' AND is_active = 1",
            "SELECT * FROM users WHERE is_active = 1 AND role = 'admin'",
            "SELECT * FROM users WHERE role = 'admin' AND is_active = true",
            "SELECT * FROM users WHERE is_active = true AND role = 'admin'",
            "SELECT id, name, email, role, is_active FROM users WHERE role = 'admin' AND is_active = 1",
          ],
          mockResult: {
            columns: ["id", "name", "email", "role", "is_active"],
            rows: [
              { id: 1, name: "Taylor Otwell", email: "taylor@laravel.com", role: "admin", is_active: 1 },
              { id: 4, name: "Ada Lovelace", email: "ada@algorithm.dev", role: "admin", is_active: 1 },
            ],
            totalCount: 2,
            executionMs: 1.4,
          },
          explanation:
            "SQL queries filter table rows horizontally using WHERE clauses. Combining boolean criteria with AND guarantees the database engine returns strictly the records satisfying both requirements.",
          xp: 35,
        },
      },
      {
        id: "m1l2",
        moduleId: "m1",
        title: "Foreign Keys — Wiring Tables Together",
        readTime: "7 min",
        xp: 50,
        summary:
          "One user, many posts. Express it in the schema itself and the database becomes a referee that rejects impossible relationships.",
        flutterParallel: {
          concept: "Filtering lists by ID in Dart vs. a declared, enforced reference in SQL",
          flutterFile: "lib/models/post.dart",
          laravelFile: "database/migrations/xxxx_add_user_to_posts.php",
          flutterCode: `class Post {
  final int id;
  final int authorId; // just an int — hope it's valid!
}

final posts = allPosts
    .where((p) => p.authorId == user.id)
    .toList();`,
          laravelCode: `Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('user_id')
        ->constrained()       // -> users.id
        ->cascadeOnDelete(); // delete user, delete posts
});`,
          explanation:
            "In Flutter you link objects by storing an int and filtering lists — nothing stops a dangling ID. In SQL the foreign key is declared in the schema: inserting a post with a user_id that doesn't exist fails immediately at the database level.",
        },
        content: [
          "The users table owns identity; posts.user_id points back at it. Reading a user's posts becomes one indexed lookup instead of a client-side loop over thousands of items.",
          "constrained() adds a foreign-key constraint — the database itself validates every write, so orphaned rows are physically impossible regardless of which client sent the request.",
          "cascadeOnDelete() is declarative cleanup: delete a user and their posts vanish too. That's business logic you would otherwise hand-roll (and forget) in app code.",
          "Draw arrows from child to parent: the foreign key always lives on the 'many' side of a one-to-many relationship.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Complete the migration so every post must belong to an existing user.",
          code: `Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('user_id')
        ->{{blank}}()
        ->cascadeOnDelete();
});`,
          options: ["constrained", "nullable", "default", "unsigned"],
          correctAnswer: "constrained",
          explanation:
            "constrained() wires user_id to users.id and adds the foreign-key constraint — the database now enforces that every post belongs to a real user.",
          xp: 25,
        },
      },
      {
        id: "m1l3",
        moduleId: "m1",
        title: "Normalization — One Fact, One Place",
        readTime: "6 min",
        xp: 50,
        summary:
          "Why servers don't stuff 'tags: flutter,laravel,api' into one column — and how pivot tables model the many-to-many you fake with List<String> in Dart.",
        flutterParallel: {
          concept: "A copied author_name in every JSON payload vs. one row, joined at read time",
          flutterFile: "lib/models/post.dart",
          laravelFile: "app/Models/Post.php",
          flutterCode: `// denormalized payload: the same author
// duplicated into every post object
{'id': 1, 'title': 'Hi', 'author_name': 'Ada'},
{'id': 2, 'title': 'Yo', 'author_name': 'Ada'}`,
          laravelCode: `// normalized: the author lives once in users
$post = Post::with('user')->find(1);

// resolved via a JOIN at read time
echo $post->user->name; // 'Ada'`,
          explanation:
            "Client developers routinely duplicate data across payloads. The database takes the opposite stance: store each fact exactly once, then JOIN to reassemble it when read. Rename a user and every post instantly shows the new name.",
        },
        content: [
          "First Normal Form: one value per cell. A column holding 'flutter, laravel, api' is actually a hidden list — give each tag its own row instead.",
          "Many-to-many is modeled with a pivot table (post_tag) holding two foreign keys. In Flutter terms: it is the join table your List<Tag> never told you about.",
          "When a fact updates, exactly one row changes. Denormalized copies mean chasing stale data across the whole table on every write.",
          "Rule of thumb: normalize until it hurts, then denormalize only when a measured query is provably too slow.",
        ],
        challenge: {
          type: "mcq",
          question: "A posts table stores tags as the string 'flutter,laravel,api' in one column. What's wrong?",
          options: [
            "It violates First Normal Form — a multi-value cell that can't be indexed or joined",
            "The column needs a UNIQUE constraint",
            "It violates Second Normal Form — partial dependency on the key",
            "Nothing — strings are cheap and efficient",
          ],
          correctAnswer: 0,
          explanation:
            "1NF demands atomic values: one fact per cell. A comma-joined list can't be indexed, counted, or joined — the fix is a tags table plus a post_tag pivot.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m2",
    index: 2,
    trackId: "track-1",
    trackName: "Track 1: Foundations",
    title: "Modern PHP 8 for Dart Developers",
    tagline: "You already know Dart. PHP 8 is just another typed language.",
    description:
      "Strict typing, arrow functions, associative arrays, constructor property promotion, and match expressions.",
    color: "#38bdf8",
    icon: "code",
    lessons: [
      {
        id: "m2l1",
        moduleId: "m2",
        title: "Types, Variables & Arrow Functions",
        readTime: "5 min",
        xp: 35,
        summary:
          "Enforce strict types in PHP 8. Understand the '$' sigil and how PHP arrow functions automatically capture variables from outer scope.",
        flutterParallel: {
          concept: "Dart static types vs PHP 8 declare(strict_types=1)",
          flutterFile: "lib/utils/calculator.dart",
          laravelFile: "app/Services/Calculator.php",
          flutterCode: `int calculateTax(int amount, double rate) {
  final multiplier = rate / 100;
  return (amount * multiplier).round();
}

final doubleValue = (int x) => x * 2;`,
          laravelCode: `declare(strict_types=1);

function calculateTax(int $amount, float $rate): int {
    $multiplier = $rate / 100;
    return (int) round($amount * $multiplier);
}

$doubleValue = fn(int $x): int => $x * 2;`,
          explanation:
            "In Dart, types are checked at compile time. In PHP 8, putting declare(strict_types=1) at the top of the file forces the engine to reject wrong types at runtime with a TypeError, giving you the same confidence.",
        },
        content: [
          "Always declare(strict_types=1); at the top of PHP files. Without it, PHP will silently coerce '42' into integer 42.",
          "Every variable in PHP starts with a dollar sign ($variable). It's a syntactic marker, not a pointer.",
          "Functions specify parameter and return types: function greet(string $name): string.",
          "Arrow functions (fn($x) => $x * 2) automatically capture outer variables by value — no 'use ($var)' boilerplate required.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Enable strict type checking in this PHP file.",
          code: `<?php
{{blank}}(strict_types=1);

function add(int $a, int $b): int {
    return $a + $b;
}`,
          options: ["declare", "enforce", "pragma", "strict"],
          correctAnswer: "declare",
          explanation:
            "declare(strict_types=1); is required at the top of every modern PHP file to prevent automatic type coercion.",
          xp: 25,
        },
      },
      {
        id: "m2l2",
        moduleId: "m2",
        title: "Arrays vs. Dart Lists & Maps",
        readTime: "6 min",
        xp: 40,
        summary:
          "In PHP, there is only one data structure: the array. Learn how it acts as both a Dart List<T> and a Map<String, dynamic>.",
        flutterParallel: {
          concept: "Dart List<T> & Map<K,V> vs PHP unified array",
          flutterFile: "lib/models/order.dart",
          laravelFile: "app/DTO/OrderData.php",
          flutterCode: `final List<String> tags = ['tech', 'mobile'];
final Map<String, dynamic> user = {
  'name': 'Ada',
  'role': 'lead',
};

// Dart collection method
final upper = tags.map((t) => t.toUpperCase()).toList();`,
          laravelCode: `$tags = ['tech', 'mobile']; // indexed array
$user = [                   // associative array
    'name' => 'Ada',
    'role' => 'lead',
];

// PHP array map
$upper = array_map(fn($t) => strtoupper($t), $tags);
// Or Laravel Collection
$upper = collect($tags)->map(fn($t) => strtoupper($t))->all();`,
          explanation:
            "Dart strictly separates ordered indexed Lists from keyed Maps. PHP combines both into associative arrays: integer keys act as Lists, string keys act as Maps. Laravel Collections provide the fluent method chaining you love in Dart.",
        },
        content: [
          "Indexed arrays use 0-based integer keys automatically: ['a', 'b', 'c'].",
          "Associative arrays use the 'fat arrow' => to map string keys to values: ['status' => 200].",
          "Array unpacking with the spread operator (...$array) works just like Dart's [...items] spread syntax.",
          "Laravel provides the collect() helper, giving arrays Dart-like fluent methods: ->filter(), ->map(), ->firstWhere().",
        ],
        challenge: {
          type: "mcq",
          question: "How do you access the value of 'email' in an associative array $user = ['email' => 'ada@code.com']?",
          options: ["$user.email", "$user->email", "$user['email']", "$user('email')"],
          correctAnswer: 2,
          explanation:
            "Arrays in PHP use bracket syntax $user['email']. Object properties use arrow syntax $user->email.",
          xp: 25,
        },
      },
      {
        id: "m2l3",
        moduleId: "m2",
        title: "Constructor Property Promotion & Readonly",
        readTime: "5 min",
        xp: 40,
        summary:
          "Eliminate class boilerplate. PHP 8 constructor promotion mirrors Dart's parameter this.property shorthand perfectly.",
        flutterParallel: {
          concept: "Dart User({required this.id}) vs PHP 8 promoted properties",
          flutterFile: "lib/models/user.dart",
          laravelFile: "app/Models/UserDto.php",
          flutterCode: `class UserDto {
  final int id;
  final String name;

  const UserDto({
    required this.id,
    required this.name,
  });
}`,
          laravelCode: `class UserDto {
    public function __construct(
        public readonly int $id,
        public readonly string $name,
    ) {}
}`,
          explanation:
            "Before PHP 8, you had to declare properties 3 times: class field, constructor argument, and assignment ($this->name = $name). With Constructor Property Promotion and readonly, PHP 8 matches Dart's concise immutable class definitions.",
        },
        content: [
          "Adding a visibility modifier (public, protected, private) to a constructor parameter automatically declares it as a class property.",
          "The readonly keyword guarantees the property cannot be modified after initialization, matching Dart's final keyword.",
          "You can still add default values: public readonly string $role = 'user'.",
          "This syntax is universally used in modern Laravel FormRequests, DTOs, and Jobs.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Promote the constructor parameter to a readonly public property.",
          code: `class ProductDto {
    public function __construct(
        public {{blank}} string $sku,
        public readonly float $price,
    ) {}
}`,
          options: ["readonly", "final", "const", "static"],
          correctAnswer: "readonly",
          explanation:
            "readonly in PHP prevents property reassignment after constructor execution, exactly like final in Dart.",
          xp: 25,
        },
      },
      {
        id: "m2l4",
        moduleId: "m2",
        title: "Null Safety & Match Expressions",
        readTime: "6 min",
        xp: 40,
        summary:
          "Handle nullable values safely with '?' and '?->'. Replace clunky switch statements with exhaustive match expressions.",
        flutterParallel: {
          concept: "Dart switch expression vs PHP 8 match expression",
          flutterFile: "lib/utils/status.dart",
          laravelFile: "app/Enums/StatusHandler.php",
          flutterCode: `String labelFor(String status) => switch (status) {
  'active' => 'Operational',
  'pending' => 'Pending Verification',
  _ => 'Unknown Status',
};

String? city = user?.address?.city;`,
          laravelCode: `function labelFor(string $status): string {
    return match ($status) {
        'active' => 'Operational',
        'pending' => 'Pending Verification',
        default => 'Unknown Status',
    };
}

$city = $user?->address?->city;`,
          explanation:
            "PHP 8 introduced the match expression, which returns a value directly and uses strict (===) comparison without needing break statements. Null-safe navigation ?-> works identically to Dart's ?..",
        },
        content: [
          "Nullable types are prefixed with a question mark: ?string means string or null.",
          "The null-safe operator (?->) stops execution and returns null immediately if the left side is null, preventing crashes.",
          "The null-coalescing operator ($name ?? 'Anonymous') provides a fallback value when null.",
          "match is an expression: it evaluates to a value and throws an UnhandledMatchError if no arm matches and no default is provided.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Complete the match expression to return 'Active' when status is 1.",
          code: `$label = {{blank}} ($status) {
    1 => 'Active',
    0 => 'Inactive',
    default => 'Pending',
};`,
          options: ["match", "switch", "when", "case"],
          correctAnswer: "match",
          explanation:
            "match ($val) { ... } is PHP 8's exhaustive expression pattern matcher, returning the matched arm value.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m3",
    index: 3,
    trackId: "track-1",
    trackName: "Track 1: Foundations",
    title: "The Server-Side Lifecycle & Request Pipeline",
    tagline: "What actually happens after dio.get() leaves your phone",
    description:
      "Routing, middleware pipeline, HTTP verbs, and dependency injection via the Laravel service container.",
    color: "#38bdf8",
    icon: "server",
    lessons: [
      {
        id: "m3l1",
        moduleId: "m3",
        title: "Anatomy of an HTTP Request",
        readTime: "7 min",
        xp: 50,
        summary:
          "Trace the 8-stage journey of an HTTP request from client TLS handshake to Laravel Kernel and back to mobile JSON.",
        flutterParallel: {
          concept: "dio.get() ↔ Laravel Request Lifecycle",
          flutterFile: "lib/services/api_client.dart",
          laravelFile: "public/index.php",
          flutterCode: `final response = await dio.get(
  '/api/v1/posts/42',
  options: Options(headers: {'Accept': 'application/json'}),
);`,
          laravelCode: `// public/index.php: entry point
$app = require_once __DIR__.'/../bootstrap/app.php';
$response = $app->handleRequest(Request::capture());
$response->send();`,
          explanation:
            "When Flutter fires a request, it travels over TCP/IP to Nginx, then to the PHP-FPM socket. Laravel boots once per request: captures the HTTP packet, passes it through middleware and routers, sends the response, and terminates.",
        },
        content: [
          "Every web request hits public/index.php first. Unlike Flutter where the app stays in RAM, PHP boots, handles the request, sends bytes, and cleans up memory immediately.",
          "The Request::capture() method reads HTTP headers, URI path, query parameters, and raw JSON body.",
          "Laravel's HTTP Kernel handles the request through global middleware (CORS, maintenance mode, trim strings).",
          "The router matches the method and path against routes/api.php, executing the associated controller action.",
        ],
        challenge: {
          type: "drag-drop",
          question: "Order the stages of a Laravel request from network socket to response.",
          options: [
            "Nginx forwards request to PHP-FPM",
            "public/index.php captures Request object",
            "Global middleware processes request",
            "Router resolves controller method",
            "JSON response travels back to mobile",
          ],
          correctAnswer:
            "Nginx forwards request to PHP-FPM→public/index.php captures Request object→Global middleware processes request→Router resolves controller method→JSON response travels back to mobile",
          explanation:
            "Network packet hits Nginx ➔ PHP-FPM spawns worker ➔ index.php captures Request ➔ Middleware evaluates ➔ Controller returns Response.",
          xp: 30,
        },
      },
      {
        id: "m3l2",
        moduleId: "m3",
        title: "HTTP Verbs & RESTful Semantics",
        readTime: "6 min",
        xp: 40,
        summary:
          "GET, POST, PUT, PATCH, DELETE aren't suggestions — they are the standardized contract your Flutter HTTP client relies on.",
        flutterParallel: {
          concept: "Dio request method matching Laravel route definition",
          flutterFile: "lib/repositories/post_repository.dart",
          laravelFile: "routes/api.php",
          flutterCode: `dio.get('/posts');             // Read collection
dio.post('/posts', data: d);    // Create
dio.put('/posts/1', data: d);   // Full replace
dio.patch('/posts/1', data: d); // Partial update
dio.delete('/posts/1');         // Delete`,
          laravelCode: `Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::patch('/posts/{post}', [PostController::class, 'patch']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);`,
          explanation:
            "Calling dio.put when the server only registered Route::post results in 405 Method Not Allowed. The HTTP verb is an integral part of the route's unique signature.",
        },
        content: [
          "GET is safe and idempotent: executing it 100 times never alters server state.",
          "POST creates new child resources and is NOT idempotent: calling it twice creates 2 database records.",
          "PUT is idempotent and replaces the target resource entirely with the provided payload.",
          "PATCH is for partial modifications (e.g. updating just the user's avatar URL).",
          "DELETE removes the resource and is idempotent: deleting an already-deleted resource still results in the resource being gone.",
        ],
        challenge: {
          type: "mcq",
          question: "Your Flutter app allows a user to toggle their dark mode preference. Which HTTP verb is most semantically correct?",
          options: ["GET", "POST", "PATCH", "DELETE"],
          correctAnswer: 2,
          explanation:
            "PATCH is designed for partial updates to a single field (like setting is_dark_mode: true) without replacing the whole user profile.",
          xp: 25,
        },
      },
      {
        id: "m3l3",
        moduleId: "m3",
        title: "Middleware — The Gatekeepers",
        readTime: "6 min",
        xp: 45,
        summary:
          "Inspect and filter requests before they reach your controller. Think Dio Interceptors running server-side.",
        flutterParallel: {
          concept: "Dio Interceptors vs Laravel Middleware Stack",
          flutterFile: "lib/api/auth_interceptor.dart",
          laravelFile: "app/Http/Middleware/EnsureTokenIsValid.php",
          flutterCode: `class AuthInterceptor extends Interceptor {
  @override
  void onRequest(options, handler) {
    options.headers['Authorization'] = 'Bearer $token';
    handler.next(options);
  }
}`,
          laravelCode: `class EnsureTokenIsValid {
    public function handle(Request $request, Closure $next): Response {
        if (! $request->bearerToken()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}`,
          explanation:
            "Dio interceptors run on the client before the request leaves your phone. Laravel middleware runs on the server before the request reaches your controller action. If a check fails, middleware aborts immediately with a 401 or 403.",
        },
        content: [
          "Middleware operates on an 'onion layer' architecture: each layer inspects $request, calls $next($request), and can inspect the returning $response.",
          "Global middleware runs on every single HTTP request (e.g. CORS, TrimStrings).",
          "Route middleware only runs on routes that explicitly request it (e.g. ['auth:sanctum', 'verified']).",
          "Middleware can mutate incoming requests: for example, casting string 'true' into boolean true.",
        ],
        challenge: {
          type: "drag-drop",
          question: "Arrange these middleware in the recommended order of execution.",
          options: [
            "HandleCors (Allow cross-origin)",
            "ThrottleRequests (Rate limit check)",
            "Authenticate (Verify Sanctum token)",
            "Controller Execution",
          ],
          correctAnswer:
            "HandleCors (Allow cross-origin)→ThrottleRequests (Rate limit check)→Authenticate (Verify Sanctum token)→Controller Execution",
          explanation:
            "CORS must run first to respond to browser preflight OPTIONS requests, followed by rate limiting to protect the server, then authentication, and finally controller logic.",
          xp: 30,
        },
      },
      {
        id: "m3l4",
        moduleId: "m3",
        title: "The Service Container & Dependency Injection",
        readTime: "6 min",
        xp: 45,
        summary:
          "Never write 'new Service()' again. Understand constructor dependency injection and auto-wiring.",
        flutterParallel: {
          concept: "GetIt / Riverpod dependency injection vs Laravel Service Container",
          flutterFile: "lib/controllers/feed_controller.dart",
          laravelFile: "app/Http/Controllers/FeedController.php",
          flutterCode: `class FeedController {
  final PostRepository postRepo;
  FeedController(this.postRepo);
}

// In service locator setup:
GetIt.I.registerSingleton<PostRepository>(PostRepositoryImpl());`,
          laravelCode: `class FeedController extends Controller {
    public function __construct(
        protected PostRepositoryContract $postRepo,
    ) {}

    public function index() {
        return $this->postRepo->getRecentPosts();
    }
}`,
          explanation:
            "In Flutter, you use GetIt or Riverpod to register and resolve singletons. Laravel uses PHP Reflection: when a controller requests an interface, Laravel automatically looks up the binding in AppServiceProvider and injects the concrete instance.",
        },
        content: [
          "The Service Container is Laravel's central registry for managing class dependencies and performing dependency injection.",
          "Auto-wiring: If a class has zero configuration dependencies, Laravel can instantiate it automatically without manual registration.",
          "Interface binding: $this->app->bind(PaymentGateway::class, StripePaymentGateway::class); allows swapping payment providers by changing 1 line.",
          "Method injection: Laravel can inject dependencies directly into controller methods, not just constructors.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Bind an interface to a concrete implementation in AppServiceProvider.",
          code: `public function register(): void {
    $this->app->{{blank}}(
        UserRepositoryContract::class,
        EloquentUserRepository::class
    );
}`,
          options: ["bind", "wire", "register", "provide"],
          correctAnswer: "bind",
          explanation:
            "$this->app->bind() tells the service container to inject EloquentUserRepository whenever UserRepositoryContract is requested.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m4",
    index: 4,
    trackId: "track-1",
    trackName: "Track 1: Foundations",
    title: "Database Migrations, Seeders & Factories",
    tagline: "Git version control for your database schema",
    description:
      "Write repeatable schema migrations, generate mock test records with Factories, and seed deterministic database fixtures.",
    color: "#38bdf8",
    icon: "git-merge",
    lessons: [
      {
        id: "m4l1",
        moduleId: "m4",
        title: "Writing Schema Migrations",
        readTime: "6 min",
        xp: 45,
        summary:
          "Team members shouldn't pass raw SQL dump files around. Migrations provide declarative, version-controlled database schema evolution.",
        flutterParallel: {
          concept: "SQLite openDatabase(onUpgrade) vs Laravel migration files",
          flutterFile: "lib/database/db_helper.dart",
          laravelFile: "database/migrations/2026_01_01_000000_create_orders_table.php",
          flutterCode: `// SQLite manual migration script in Flutter
Future<void> onUpgrade(db, oldV, newV) async {
  if (oldV < 2) {
    await db.execute('ALTER TABLE orders ADD COLUMN tracking_code TEXT');
  }
}`,
          laravelCode: `return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->decimal('total', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('orders');
    }
};`,
          explanation:
            "In mobile SQLite, schema changes are painful if-statements checking database version numbers. Laravel migrations are individual timestamped PHP files. Running php artisan migrate executes pending files and records their names in a migrations table.",
        },
        content: [
          "Migrations have two methods: up() applies changes (creates tables, adds columns), and down() rolls them back cleanly.",
          "The Blueprint object provides expressive column helpers: $table->uuid('uuid'), $table->string('title', 100), $table->timestamp('paid_at')->nullable().",
          "Never modify an existing migration that has already run in production. Always create a new migration using php artisan make:migration add_status_to_orders_table.",
          "php artisan migrate:status displays the exact execution history of every migration file.",
        ],
        challenge: {
          type: "migration-builder",
          question:
            "Design the database migration schema for the 'orders' table. It must include an auto-incrementing id, foreignId 'user_id' with cascadeOnDelete, decimal 'total', string 'status', and timestamps.",
          correctAnswer: "orders_migration_valid",
          explanation:
            "Schema created and migrated! In Laravel, $table->foreignId('user_id')->constrained()->cascadeOnDelete() ensures foreign key integrity and deletes child orders when a user is deleted.",
          xp: 35,
          migrationTarget: {
            tableName: "orders",
            initialColumns: [
              { id: "col-id", name: "id", type: "id" },
              { id: "col-user", name: "user_id", type: "foreignId", cascadeDelete: false },
              { id: "col-ts", name: "timestamps", type: "timestamps" },
            ],
            targetColumns: [
              { name: "user_id", type: "foreignId", cascadeDelete: true },
              { name: "total", type: "decimal" },
              { name: "status", type: "string" },
            ],
            hints: [
              "Enable the 'cascade' modifier on the $table->foreignId('user_id') column.",
              "Click 'Add Column' to create 'total' with type 'decimal'.",
              "Click 'Add Column' to create 'status' with type 'string'.",
              "Click 'Run Migration' when the requirements checklist is complete.",
            ],
          },
        },
      },
      {
        id: "m4l2",
        moduleId: "m4",
        title: "Indexes & Foreign Key Constraints",
        readTime: "6 min",
        xp: 45,
        summary:
          "Indexes turn 2000ms full-table scans into 2ms B-Tree lookups. Foreign keys guarantee data integrity at the database engine level.",
        flutterParallel: {
          concept: "Dart linear search vs SQL B-Tree indexes",
          flutterFile: "lib/models/user_query.dart",
          laravelFile: "database/migrations/xxxx_add_indexes_to_posts.php",
          flutterCode: `// Slow linear scan over List in memory: O(N)
final match = allUsers.firstWhere(
  (u) => u.email == query,
);`,
          laravelCode: `Schema::table('posts', function (Blueprint $table) {
    // Single-column index for fast lookups
    $table->index('status');

    // Compound index for multi-column WHERE clauses
    $table->index(['user_id', 'created_at']);
});`,
          explanation:
            "Without an index, the database reads every single row on disk (full table scan). Adding ->index() creates a balanced tree (B-Tree) structure on disk, enabling lightning-fast O(log N) lookups even with 10 million records.",
        },
        content: [
          "Index columns that appear frequently in WHERE clauses, ORDER BY sorts, and JOIN conditions.",
          "Composite indexes order matters: an index on ['user_id', 'created_at'] accelerates queries filtering by user_id or both, but NOT queries filtering only by created_at.",
          "Unique indexes enforce uniqueness and accelerate lookups simultaneously: $table->unique('slug').",
          "Foreign key constraints prevent orphan records: cascadeOnDelete() automatically removes child records when the parent row is deleted.",
        ],
        challenge: {
          type: "mcq",
          question: "Your mobile app frequently runs: SELECT * FROM posts WHERE user_id = 5 ORDER BY created_at DESC. Which index is best?",
          options: [
            "Single index on created_at",
            "Compound index on ['user_id', 'created_at']",
            "Single index on title",
            "No index needed for small tables",
          ],
          correctAnswer: 1,
          explanation:
            "A compound index on ['user_id', 'created_at'] allows the database to instantly locate user 5's rows and read them in already-sorted created_at order.",
          xp: 25,
        },
      },
      {
        id: "m4l3",
        moduleId: "m4",
        title: "Model Factories & Fake Data Generation",
        readTime: "5 min",
        xp: 40,
        summary:
          "Generate 1,000 realistic users, posts, or orders in seconds using Faker and Laravel Model Factories.",
        flutterParallel: {
          concept: "Flutter test fixture mocks vs Laravel Model Factories",
          flutterFile: "test/mocks/user_fixture.dart",
          laravelFile: "database/factories/UserFactory.php",
          flutterCode: `User fakeUser({String? name}) => User(
  id: 1,
  name: name ?? 'John Doe',
  email: 'john@example.com',
);`,
          laravelCode: `class UserFactory extends Factory {
    public function definition(): array {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
        ];
    }
}`,
          explanation:
            "Writing mock objects by hand in Flutter tests gets tedious. Laravel Factories generate authentic test data powered by the Faker library. You can generate 100 realistic users with a single line: User::factory()->count(100)->create().",
        },
        content: [
          "Factories define a template of default attributes for Eloquent models using fake()->name(), fake()->address(), etc.",
          "Factory states allow conditional modifications: $user = User::factory()->unverified()->admin()->create();.",
          "make() creates model instances in memory (without saving), while create() inserts them directly into the database.",
          "Factories can define relationships automatically: Post::factory()->for(User::factory())->create().",
        ],
        challenge: {
          type: "fill-blank",
          question: "Generate and save 25 fake posts into the database.",
          code: `// Generate 25 persistent records
Post::factory()->count(25)->{{blank}}();`,
          options: ["create", "make", "save", "insert"],
          correctAnswer: "create",
          explanation:
            "create() persists the generated factory models directly into the database; make() only instantiates them in memory.",
          xp: 25,
        },
      },
      {
        id: "m4l4",
        moduleId: "m4",
        title: "Database Seeders & Deterministic Fixtures",
        readTime: "5 min",
        xp: 40,
        summary:
          "Populate your local dev database with ready-to-test data so you never open a blank mobile screen again.",
        flutterParallel: {
          concept: "Sample JSON mock assets in Flutter vs Database Seeders",
          flutterFile: "assets/mock_posts.json",
          laravelFile: "database/seeders/DatabaseSeeder.php",
          flutterCode: `// Flutter loading mock asset on debug mode
final jsonString = await rootBundle.loadString('assets/mock_posts.json');
final List data = jsonDecode(jsonString);`,
          laravelCode: `class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Create 1 admin user with predictable credentials
        $admin = User::factory()->create([
            'email' => 'admin@laradev.com',
        ]);

        // Create 10 regular users with 5 posts each
        User::factory(10)
            ->hasPosts(5)
            ->create();
    }
}`,
          explanation:
            "In mobile dev, testing edge cases on an empty app is frustrating. Database seeders populate your local Postgres database with thousands of records, realistic relationships, and predictable test logins with php artisan db:seed.",
        },
        content: [
          "The main entry point is database/seeders/DatabaseSeeder.php, which can call other dedicated seeders using $this->call().",
          "Combine factories with relationships: User::factory(5)->has(Post::factory(3))->create();.",
          "Always seed a known test account so your mobile app can log in immediately during development.",
          "Running php artisan migrate:fresh --seed completely wipes the database, re-runs all migrations, and executes seeders from scratch.",
        ],
        challenge: {
          type: "mcq",
          question: "Which command completely wipes the database, rebuilds all tables, and seeds mock data?",
          options: [
            "php artisan db:seed --fresh",
            "php artisan migrate:fresh --seed",
            "php artisan db:wipe",
            "php artisan schema:reload",
          ],
          correctAnswer: 1,
          explanation:
            "migrate:fresh drops all tables, executes all migrations from scratch, and the --seed flag runs DatabaseSeeder.",
          xp: 25,
        },
      },
    ],
  },

  // ==============================================================================
  // TRACK 2: THE ELOQUENT ENGINE & BUSINESS LOGIC
  // ==============================================================================

  {
    id: "m5",
    index: 5,
    trackId: "track-2",
    trackName: "Track 2: Eloquent Engine",
    title: "Eloquent ORM: Models That Query Themselves",
    tagline: "ActiveRecord pattern for Dart developers",
    description:
      "Query builders, mass assignment protection, local query scopes, and attribute casts.",
    color: "#a78bfa",
    icon: "sparkles",
    lessons: [
      {
        id: "m5l1",
        moduleId: "m5",
        title: "Active Record vs. Client-Side DAOs",
        readTime: "7 min",
        xp: 45,
        summary:
          "In Flutter, you separate models from DAOs. In Eloquent, the model class IS the query builder. Learn the ActiveRecord pattern.",
        flutterParallel: {
          concept: "DAO query objects vs Eloquent ActiveRecord models",
          flutterFile: "lib/daos/user_dao.dart",
          laravelFile: "app/Models/User.php",
          flutterCode: `// Flutter Floor / Drift DAO
@dao
abstract class UserDao {
  @Query('SELECT * FROM users WHERE active = 1')
  Future<List<User>> getActiveUsers();
}`,
          laravelCode: `class User extends Model {
    protected $fillable = ['name', 'email', 'password'];

    // Model queries itself directly
    // $users = User::where('active', true)->get();
}`,
          explanation:
            "In Flutter you instantiate DAOs or repositories to query raw tables. In Laravel's ActiveRecord, each User instance represents a single row, and the User class itself exposes static query methods.",
        },
        content: [
          "Eloquent models map class names to plural snake_case table names: User ➔ users, OrderItem ➔ order_items.",
          "Mass assignment vulnerability: $fillable explicitly whitelists which fields can be mass-updated via Request input.",
          "Basic CRUD: User::create([...]), User::find($id), User::findOrFail($id), $user->update([...]), $user->delete().",
          "findOrFail() automatically halts execution and returns a 404 JSON response if the requested record doesn't exist.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Protect the User model by declaring mass-assignable attributes.",
          code: `class User extends Model {
    protected \${{blank}} = ['name', 'email'];
}`,
          options: ["fillable", "guarded", "visible", "whitelist"],
          correctAnswer: "fillable",
          explanation:
            "$fillable specifies the array of column names that can be safely assigned via mass-assignment methods like create().",
          xp: 25,
        },
      },
      {
        id: "m5l2",
        moduleId: "m5",
        title: "Basic CRUD Operations & Safe Lookups",
        readTime: "6 min",
        xp: 45,
        summary:
          "Create, read, update, and delete records cleanly. Master findOrFail() to handle 404 errors automatically without manual null-checks.",
        flutterParallel: {
          concept: "sqflite CRUD queries vs Eloquent static helper methods",
          flutterFile: "lib/repositories/post_repository.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `// Manual database update in Flutter
await db.update(
  'posts',
  {'title': 'Updated Title'},
  where: 'id = ?',
  whereArgs: [postId],
);`,
          laravelCode: `// Safe lookup & update in Eloquent
$post = Post::findOrFail($id); // Throws 404 if not found!
$post->update(['title' => 'Updated Title']);

// Or single line create:
$post = Post::create($validatedData);`,
          explanation:
            "In Flutter, if an item isn't in your SQLite database, you get null and must check if (item == null) throw NotFoundException(). In Laravel, findOrFail() throws a ModelNotFoundException which the framework automatically converts into an HTTP 404 response.",
        },
        content: [
          "create() inserts a new row and returns the freshly saved model instance with its generated id.",
          "findOrFail() guarantees you either have a valid model or the request aborts with an HTTP 404 JSON response.",
          "update() performs a targeted SQL UPDATE query on the matching row.",
          "firstOrCreate() lookups an existing record or creates it in one atomic call, preventing race conditions.",
        ],
        challenge: {
          type: "mcq",
          question: "Why is Post::findOrFail($id) preferred over Post::find($id) in API controllers?",
          options: [
            "It runs faster by skipping database indexes",
            "It automatically aborts with an HTTP 404 Not Found response if the row doesn't exist",
            "It decrypts model attributes automatically",
            "It only works with PostgreSQL",
          ],
          correctAnswer: 1,
          explanation:
            "findOrFail() eliminates manual if (!$post) return response(404) checks by automatically throwing a 404 exception when the record is missing.",
          xp: 25,
        },
      },
      {
        id: "m5l3",
        moduleId: "m5",
        title: "Query Scopes & Reusable Filters",
        readTime: "6 min",
        xp: 45,
        summary:
          "Encapsulate common WHERE clauses into reusable, chainable query scopes like Post::published()->popular()->get().",
        flutterParallel: {
          concept: "Dart list filtering vs Server-side SQL query scopes",
          flutterFile: "lib/models/post.dart",
          laravelFile: "app/Models/Post.php",
          flutterCode: `// Client filtering after downloading everything
posts.where((p) => p.isPublished && p.views > 1000);`,
          laravelCode: `class Post extends Model {
    public function scopePublished($query) {
        return $query->whereNotNull('published_at');
    }
}

// Chained at the SQL query level:
$posts = Post::published()->get();`,
          explanation:
            "Never download 10,000 records to mobile just to filter them with Dart's .where(). Eloquent query scopes execute the filtering inside PostgreSQL before bytes ever touch the network.",
        },
        content: [
          "Local scopes are methods prefixed with 'scope': public function scopeActive($query).",
          "When calling the scope, omit the 'scope' prefix: User::active()->get().",
          "Dynamic scopes accept arguments: public function scopeOfType($query, string $type).",
          "Global scopes apply automatically to every query on the model (e.g. Laravel's SoftDeletes trait).",
        ],
        challenge: {
          type: "fill-blank",
          question: "Define the local query scope method prefix.",
          code: `class Post extends Model {
    public function {{blank}}Popular($query) {
        return $query->where('views', '>', 1000);
    }
}`,
          options: ["scope", "filter", "query", "where"],
          correctAnswer: "scope",
          explanation:
            "Methods prefixed with 'scope' (e.g. scopePopular) become chainable query methods (e.g. Post::popular()->get()).",
          xp: 25,
        },
      },
      {
        id: "m5l4",
        moduleId: "m5",
        title: "Attribute Casts, Accessors & Backed Enums",
        readTime: "6 min",
        xp: 45,
        summary:
          "Transform raw database strings and integers into typed PHP 8 backed enums, arrays, booleans, and encrypted values.",
        flutterParallel: {
          concept: "Dart enum deserialization vs Laravel Attribute Casts",
          flutterFile: "lib/models/order.dart",
          laravelFile: "app/Models/Order.php",
          flutterCode: `enum OrderStatus { pending, paid, shipped }

// Manual parsing in Dart
OrderStatus parseStatus(String v) => switch(v) {
  'paid' => OrderStatus.paid,
  'shipped' => OrderStatus.shipped,
  _ => OrderStatus.pending,
};`,
          laravelCode: `enum OrderStatus: string {
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';
}

class Order extends Model {
    protected function casts(): array {
        return [
            'status' => OrderStatus::class,
            'metadata' => 'array',
            'is_priority' => 'boolean',
        ];
    }
}`,
          explanation:
            "In Dart, you write custom parser functions to map raw JSON strings to enums. Laravel's casts() method tells Eloquent to automatically cast raw SQL columns into typed PHP 8 Enums or arrays upon retrieval, and serialize them back on save.",
        },
        content: [
          "In Laravel 11, attribute casting is defined in the protected function casts(): array method.",
          "PHP 8 Backed Enums: 'status' => OrderStatus::class automatically parses strings into enum cases.",
          "JSON columns: 'settings' => 'array' automatically runs json_decode and json_encode.",
          "Hashed cast: 'password' => 'hashed' automatically hashes plaintext strings with bcrypt before saving.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Complete the cast definition to map the status column to the OrderStatus backed enum.",
          code: `protected function casts(): array {
    return [
        'status' => OrderStatus::{{blank}},
    ];
}`,
          options: ["class", "enum", "type", "name"],
          correctAnswer: "class",
          explanation:
            "Passing OrderStatus::class as the cast type instructs Eloquent to cast the column directly to that PHP 8 Backed Enum.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m6",
    index: 6,
    trackId: "track-2",
    trackName: "Track 2: Eloquent Engine",
    title: "Relationships, Pivot Tables & The N+1 Bug",
    tagline: "How tables talk — and how to avoid destroying server performance",
    description:
      "hasMany, belongsTo, belongsToMany with pivot tables, and diagnosing the N+1 query performance bottleneck.",
    color: "#a78bfa",
    icon: "link",
    lessons: [
      {
        id: "m6l1",
        moduleId: "m6",
        title: "One-to-One & One-to-Many Relationships",
        readTime: "6 min",
        xp: 45,
        summary:
          "Model hierarchical relationships: hasOne for single child profiles, belongsTo for child foreign keys, and hasMany for collections.",
        flutterParallel: {
          concept: "Nested Dart classes vs Eloquent Relationship Query Builders",
          flutterFile: "lib/models/user_profile.dart",
          laravelFile: "app/Models/User.php",
          flutterCode: `class User {
  final int id;
  final UserProfile? profile;
  final List<Post> posts;
  User({required this.id, this.profile, this.posts = const []});
}`,
          laravelCode: `class User extends Model {
    // One-to-One: user has one profile
    public function profile(): HasOne {
        return $this->hasOne(UserProfile::class);
    }

    // One-to-Many: user has many posts
    public function posts(): HasMany {
        return $this->hasMany(Post::class);
    }
}`,
          explanation:
            "In Flutter, child objects exist directly inside parent Dart objects in memory. In Eloquent, relationship methods return relation query builders ($user->posts()), while dynamic properties ($user->posts) return the fetched Eloquent Collection or Model.",
        },
        content: [
          "hasOne: Defined on the parent model (User). Eloquent assumes the foreign key on user_profiles is user_id.",
          "belongsTo: Defined on the child model (UserProfile or Post) where the foreign key column physically resides.",
          "hasMany: One parent record has zero or more child records (e.g. User hasMany Post).",
          "Dynamic properties ($user->posts) return collections; calling the method directly ($user->posts()->where('is_published', true)->get()) lets you chain SQL conditions onto the relationship.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Complete the inverse one-to-many relationship on the Comment model.",
          code: `class Comment extends Model {
    public function post(): {{blank}} {
        return $this->belongsTo(Post::class);
    }
}`,
          options: ["BelongsTo", "HasMany", "HasOne", "MorphTo"],
          correctAnswer: "BelongsTo",
          explanation:
            "A Comment belongs to a Post, meaning the foreign key post_id lives on the comments table.",
          xp: 25,
        },
      },
      {
        id: "m6l2",
        moduleId: "m6",
        title: "Many-to-Many & Pivot Tables",
        readTime: "7 min",
        xp: 50,
        summary:
          "Connect non-hierarchical models across intermediary pivot tables using belongsToMany, attach, detach, and sync.",
        flutterParallel: {
          concept: "Dart list of tag IDs vs Laravel Pivot Table sync()",
          flutterFile: "lib/services/post_service.dart",
          laravelFile: "app/Models/Post.php",
          flutterCode: `// Mobile client sends array of tag IDs to sync
final response = await dio.post('/api/posts/42/tags', data: {
  'tag_ids': [1, 5, 8],
});`,
          laravelCode: `class Post extends Model {
    public function tags(): BelongsToMany {
        return $this->belongsToMany(Tag::class)
                    ->withTimestamps();
    }
}

// In Controller: instantly syncs pivot table
$post->tags()->sync([1, 5, 8]);`,
          explanation:
            "In a mobile app, you might maintain a List<Tag> inside Post. In relational databases, a many-to-many relationship requires an intermediate pivot table (post_tag). Laravel's sync() method automatically inserts missing tags and deletes unselected ones in one operation.",
        },
        content: [
          "Naming convention: By default, Eloquent joins model names alphabetically in singular form with an underscore: post_tag for Post and Tag.",
          "belongsToMany: Defined on both models to create a bidirectional many-to-many relation.",
          "attach($id) adds a record to the pivot table; detach($id) removes it.",
          "sync([1, 2, 3]) is the gold standard for REST update endpoints: it matches the pivot records exactly to the provided IDs, pruning deleted tags automatically.",
          "withPivot('role', 'expires_at') exposes custom intermediate columns on the pivot table via $model->pivot.",
        ],
        challenge: {
          type: "mcq",
          question: "Following Laravel conventions, what is the default pivot table name between User and Role models?",
          options: [
            "user_role",
            "role_user",
            "roles_users",
            "user_roles"
          ],
          correctAnswer: 1,
          explanation:
            "Eloquent's naming convention for pivot tables takes the singular names of both models in alphabetical order: 'role' precedes 'user', creating 'role_user'.",
          xp: 25,
        },
      },
      {
        id: "m6l3",
        moduleId: "m6",
        title: "The Infamous N+1 Query Problem & Eager Loading",
        readTime: "7 min",
        xp: 50,
        summary:
          "Diagnose and eliminate the #1 backend performance bug that causes mobile feeds to stutter and database connections to exhaust.",
        flutterParallel: {
          concept: "100 individual HTTP calls in a loop vs 1 batch call with Eager Loading",
          flutterFile: "lib/views/feed_screen.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `// CLIENT ANTI-PATTERN:
// Fetching 50 posts, then firing 50 separate HTTP calls for authors!
for (var post in posts) {
  post.author = await dio.get('/api/users/\${post.authorId}');
}`,
          laravelCode: `// BAD: 51 SQL queries (1 for posts + 50 for authors)
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Query per iteration!
}

// GOOD: Exactly 2 SQL queries total!
$posts = Post::with(['author', 'tags'])->latest()->get();`,
          explanation:
            "Lazy loading waits until an object's relation property is accessed in PHP to run a SQL SELECT. In a list of 50 posts, that generates 51 database queries. Eager loading with ->with('author') queries all 50 authors at once using WHERE id IN (...).",
        },
        content: [
          "N+1 happens whenever you access an unloaded relationship inside a loop or serializing collection.",
          "Post::with('author')->get() runs 2 SQL queries: SELECT * FROM posts, followed by SELECT * FROM users WHERE id IN (1, 2, ...).",
          "Nested eager loading: Post::with('comments.author')->get() eagerly loads comments and each comment's author in 3 total queries.",
          "Model::preventLazyLoading(!app()->isProduction()) throws an exception during local development whenever an N+1 query is accidentally triggered.",
        ],
        challenge: {
          type: "error-debugger",
          question: "Diagnose this lazy loading exception in your production logs and select the proper eager loading fix.",
          errorType: "LAZY LOADING VIOLATION",
          errorFile: "app/Http/Controllers/PostController.php",
          errorLine: 18,
          errorLog: "[2026-10-01 08:15:22] production.ERROR: Illuminate\\Database\\LazyLoadingViolationException: Attempted to lazy load [author] on model [App\\Models\\Post] but lazy loading is disabled in app/Http/Controllers/PostController.php:18",
          buggyCode: `public function index() {
    // ⚠️ CRASH: Model::preventLazyLoading() blocked N+1 query execution
    $posts = Post::latest()->get();
    
    return PostResource::collection($posts);
}`,
          fixOptions: [
            {
              id: "fix-with",
              label: "Eager load the author relationship using with('author')",
              codeDiff: `- $posts = Post::latest()->get();\n+ $posts = Post::with('author')->latest()->get();`,
              isCorrect: true,
              explanation: "Calling Post::with('author') batches the author lookups into a single WHERE id IN (...) query, eliminating N+1 queries and satisfying strict lazy-loading guards.",
            },
            {
              id: "fix-db",
              label: "Use DB::table('posts') instead of Eloquent",
              codeDiff: `- $posts = Post::latest()->get();\n+ $posts = DB::table('posts')->get();`,
              isCorrect: false,
              explanation: "Query builder bypasses Eloquent relations entirely, breaking PostResource transformations and losing model casting.",
            },
            {
              id: "fix-disable-guard",
              label: "Disable lazy loading prevention in AppServiceProvider",
              codeDiff: `- Model::preventLazyLoading(!app()->isProduction());\n+ Model::preventLazyLoading(false);`,
              isCorrect: false,
              explanation: "Silencing the guard masks the underlying performance defect, causing 50+ individual database queries to execute in production.",
            },
          ],
          correctAnswer: "fix-with",
          explanation: "Eager loading with ->with('relation') solves the N+1 problem at its source by querying all related records in a single SQL statement before serialization begins.",
          xp: 40,
        },
      },
      {
        id: "m6l4",
        moduleId: "m6",
        title: "Lazy Eager Loading & Relationship Counts",
        readTime: "6 min",
        xp: 45,
        summary:
          "Compute counts efficiently with withCount() and load missing relationships on demand with loadMissing().",
        flutterParallel: {
          concept: "Downloading entire comment lists just to read comments.length vs withCount()",
          flutterFile: "lib/models/post_card.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `// INEFFICIENT: Mobile client downloads 10,000 comment objects
// just to display the badge text: "\${post.comments.length} Comments"
Text('\${post.comments.length} Comments');`,
          laravelCode: `// EFFICIENT: Zero comment models loaded into memory!
// Appends comments_count attribute via SQL COUNT(*)
$posts = Post::withCount('comments')->latest()->get();

// Output directly in API response:
// "comments_count": 42`,
          explanation:
            "Mobile apps frequently need counters (like count, comment count, follower count). Downloading thousands of child models just to check their count causes memory bloat. withCount() executes an efficient subquery COUNT(*) and injects a virtual {relation}_count column.",
        },
        content: [
          "withCount('comments') adds a comments_count integer attribute to every parent model with zero child models hydrated.",
          "Conditional counts: withCount(['comments as approved_comments_count' => fn($q) => $q->where('is_approved', true)]).",
          "loadMissing('author'): If an Eloquent model is already fetched and you're not sure if author is loaded, loadMissing() only fires SQL if the relationship isn't in memory yet.",
          "Combining counts and relations: Post::with('author')->withCount('comments')->paginate(20) provides all the data needed for a mobile card feed.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Add the count of likes to the Post query without loading like records.",
          code: `$posts = Post::{{blank}}('likes')->latest()->paginate(15);`,
          options: ["withCount", "count", "has", "with"],
          correctAnswer: "withCount",
          explanation:
            "withCount('likes') attaches a likes_count attribute to each post using an optimized SQL COUNT(*) subquery.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m7",
    index: 7,
    trackId: "track-2",
    trackName: "Track 2: Eloquent Engine",
    title: "Controllers, Routing & Dependency Injection",
    tagline: "The traffic controllers of your backend application",
    description:
      "API route groups, implicit route model binding, REST resource controllers, and invokable actions.",
    color: "#a78bfa",
    icon: "controller",
    lessons: [
      {
        id: "m7l1",
        moduleId: "m7",
        title: "API Routing & Route Groups",
        readTime: "6 min",
        xp: 45,
        summary:
          "Organize API endpoints cleanly with route prefixes, versioning, middleware groups, and rate limiting.",
        flutterParallel: {
          concept: "GoRouter route hierarchy vs Laravel routes/api.php route groups",
          flutterFile: "lib/router/app_router.dart",
          laravelFile: "routes/api.php",
          flutterCode: `// GoRouter with nested sub-routes
GoRoute(
  path: '/api/v1',
  routes: [
    GoRoute(path: 'posts', builder: (context, state) => PostListScreen()),
  ],
);`,
          laravelCode: `// routes/api.php
Route::prefix('v1')->middleware('throttle:api')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
});`,
          explanation:
            "In Flutter, you nest GoRoute paths to maintain screen hierarchies. In Laravel, Route::prefix() and Route::middleware() groups wrap API endpoints with consistent URL prefixes (like /api/v1) and security rules (rate limits, auth).",
        },
        content: [
          "routes/api.php routes are automatically prefixed with /api and state-free (no session cookies).",
          "Route::prefix('v1')->group(...) nests API endpoints into versioned namespaces.",
          "Route::middleware('auth:sanctum') guards routes from unauthenticated mobile requests.",
          "Naming routes: ->name('posts.index') provides consistent route references across your backend code.",
        ],
        challenge: {
          type: "artisan-terminal",
          question:
            "Inspect your registered API route table or scaffold a controller. Run 'php artisan route:list' in the interactive terminal to verify HTTP verbs, URI patterns, and middleware.",
          correctAnswer: "php artisan route:list",
          explanation:
            "Route table verified! The 'php artisan route:list' command is an indispensable developer tool to verify URI prefixes, names, controller action bindings, and middleware security gates before testing from your Flutter app.",
          xp: 35,
          artisanTarget: {
            targetCommand: "php artisan route:list",
            acceptableCommands: [
              "php artisan route:list",
              "php artisan route:list --path=api",
              "php artisan make:controller Api/PostController --api",
            ],
            availableCommands: [
              "php artisan route:list",
              "php artisan route:list --path=api",
              "php artisan make:controller Api/PostController --api",
              "php artisan migrate:status",
            ],
            hints: [
              "Type 'php artisan route:list' into the terminal and press Enter.",
              "Or click the 'php artisan route:list' quick pill button below the terminal.",
            ],
          },
        },
      },
      {
        id: "m7l2",
        moduleId: "m7",
        title: "Implicit Route Model Binding",
        readTime: "6 min",
        xp: 45,
        summary:
          "Eliminate repetitive findOrFail calls by letting Laravel automatically inject resolved database models based on route wildcard parameters.",
        flutterParallel: {
          concept: "Extracting String 'id' in GoRouter vs Type-Hinted Model Injection",
          flutterFile: "lib/router/post_routes.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `// In Flutter client:
GoRoute(
  path: '/posts/:id',
  builder: (context, state) {
    final id = int.parse(state.pathParameters['id']!);
    return PostDetailsScreen(postId: id);
  },
);`,
          laravelCode: `// routes/api.php
Route::get('/posts/{post}', [PostController::class, 'show']);

// PostController.php
public function show(Post $post): JsonResponse {
    // $post is ALREADY fetched from PostgreSQL!
    // If ID was invalid, 404 was already returned!
    return response()->json($post);
}`,
          explanation:
            "In Flutter, you parse the route parameter as a string or integer and dispatch a state-fetcher. In Laravel, matching the route placeholder {post} to the controller type-hint Post $post tells Laravel to execute findOrFail($id) automatically before invoking your controller.",
        },
        content: [
          "Convention: The parameter name in the route definition {post} must match the variable name $post in the controller method.",
          "Automatic 404: If the database row does not exist, Laravel aborts with a 404 Not Found before your controller action even executes.",
          "Custom columns: {post:slug} instructs Laravel to look up the model using the 'slug' column instead of the primary key 'id'.",
          "Scoped binding: Route::get('/users/{user}/posts/{post}', ...) automatically enforces that $post belongs to $user.",
        ],
        challenge: {
          type: "mcq",
          question: "What happens when a mobile client sends GET /api/posts/999 and post #999 does not exist in the database?",
          options: [
            "PHP throws an uncaught NullPointerException",
            "The controller receives $post as null and continues executing",
            "Laravel automatically aborts the request and responds with HTTP 404 Not Found",
            "The database rolls back all transactions and restarts"
          ],
          correctAnswer: 2,
          explanation:
            "Implicit Route Model Binding uses findOrFail under the hood, instantly returning an HTTP 404 Not Found response whenever the model is not found.",
          xp: 25,
        },
      },
      {
        id: "m7l3",
        moduleId: "m7",
        title: "Resource Controllers & REST Actions",
        readTime: "7 min",
        xp: 50,
        summary:
          "Generate standardized REST controllers with php artisan make:controller --api and bind all 5 endpoints in a single route declaration.",
        flutterParallel: {
          concept: "Full CRUD Repository contract vs API Resource Controller",
          flutterFile: "lib/repositories/post_repository.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `abstract class PostRepository {
  Future<List<Post>> getAll();
  Future<Post> getById(int id);
  Future<Post> create(PostDto data);
  Future<Post> update(int id, PostDto data);
  Future<void> delete(int id);
}`,
          laravelCode: `// routes/api.php
Route::apiResource('posts', PostController::class);

// PostController.php (5 REST actions)
class PostController extends Controller {
    public function index() { return Post::all(); }
    public function store(Request $r) { return Post::create($r->validated()); }
    public function show(Post $post) { return $post; }
    public function update(Request $r, Post $post) { $post->update($r->validated()); return $post; }
    public function destroy(Post $post) { $post->delete(); return response()->noContent(); }
}`,
          explanation:
            "In Flutter, you define a clean abstract repository class with the 5 CRUD methods. In Laravel, an API Resource Controller provides the exact same 5 standard methods (index, store, show, update, destroy), mapping directly to HTTP verbs.",
        },
        content: [
          "Generate API controllers: php artisan make:controller PostController --api (omits HTML create/edit form actions).",
          "One line routing: Route::apiResource('posts', PostController::class) automatically registers all 5 endpoints.",
          "Nested resources: Route::apiResource('posts.comments', CommentController::class) registers nested /posts/{post}/comments endpoints.",
          "Selective endpoints: Route::apiResource('posts', PostController::class)->only(['index', 'show']) restricts the exposed actions.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Register all 5 standard API routes for the posts resource.",
          code: `Route::{{blank}}('posts', PostController::class);`,
          options: ["apiResource", "resource", "group", "crud"],
          correctAnswer: "apiResource",
          explanation:
            "Route::apiResource() registers index, store, show, update, and destroy actions without the HTML create and edit form routes.",
          xp: 25,
        },
      },
      {
        id: "m7l4",
        moduleId: "m7",
        title: "Single-Action (Invokable) Controllers",
        readTime: "6 min",
        xp: 45,
        summary:
          "Keep complex business logic modular by using invokable controllers that do exactly one thing, mirroring Flutter use-cases and BLoC events.",
        flutterParallel: {
          concept: "Clean Architecture UseCase / Command vs Invokable Controller",
          flutterFile: "lib/domain/usecases/checkout_cart.dart",
          laravelFile: "app/Http/Controllers/CheckoutController.php",
          flutterCode: `class CheckoutCartUseCase {
  Future<Order> call(Cart cart, PaymentMethod payment) async {
    return await orderService.processCheckout(cart, payment);
  }
}`,
          laravelCode: `// Generated via: php artisan make:controller CheckoutController --invokable
class CheckoutController extends Controller {
    public function __invoke(CheckoutRequest $request, PaymentGateway $gateway): JsonResponse {
        $order = $gateway->charge($request->validated());
        return response()->json($order, 201);
    }
}

// routes/api.php: Direct class reference
Route::post('/checkout', CheckoutController::class);`,
          explanation:
            "In Flutter Clean Architecture, complex actions are isolated into single-purpose UseCases with a callable .call() method. In Laravel, an Invokable Controller implements PHP's magic __invoke() method, allowing the controller itself to act as the handler for a single dedicated route.",
        },
        content: [
          "Invokable controllers have a single public method: public function __invoke().",
          "Generate invokable controller: php artisan make:controller ProcessPaymentController --invokable.",
          "Route definition requires only the class name: Route::post('/payments', ProcessPaymentController::class).",
          "Ideal for operations that don't fit standard CRUD: /checkout, /upload-avatar, /resend-verification, /calculate-tax.",
        ],
        challenge: {
          type: "fill-blank",
          question: "What PHP magic method makes a controller invokable for a single route?",
          code: `class ProcessPaymentController extends Controller {
    public function {{blank}}(Request $request) {
        // Execute dedicated payment logic
    }
}`,
          options: ["__invoke", "__call", "handle", "execute"],
          correctAnswer: "__invoke",
          explanation:
            "PHP's __invoke magic method is called when a script tries to call an object as a function, enabling single-action controller routing in Laravel.",
          xp: 25,
        },
      },
    ],
  },

  // ==============================================================================
  // TRACK 3: PRODUCTION REST API MASTERY
  // ==============================================================================

  {
    id: "m8",
    index: 8,
    trackId: "track-3",
    trackName: "Track 3: REST API Mastery",
    title: "RESTful Architecture & Status Codes",
    tagline: "The contract between client and server",
    description:
      "HTTP semantics, status codes (200, 201, 204, 400, 401, 403, 404, 422, 500), and API versioning.",
    color: "#f43f5e",
    icon: "globe",
    lessons: [
      {
        id: "m8l1",
        moduleId: "m8",
        title: "Status Codes: The Language of APIs",
        readTime: "6 min",
        xp: 40,
        summary:
          "Never return 200 OK with an error message in the JSON body. Master HTTP status codes so your Flutter app handles errors reliably.",
        flutterParallel: {
          concept: "Handling Dio status codes vs returning proper HTTP responses",
          flutterFile: "lib/api/error_handler.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `try {
  final res = await dio.post('/posts', data: d);
} on DioException catch (e) {
  if (e.response?.statusCode == 422) {
    // Form validation error
  } else if (e.response?.statusCode == 401) {
    // Expired token -> redirect to login
  }
}`,
          laravelCode: `// 201 Created on new record
return response()->json($post, 201);

// 204 No Content on delete
return response()->noContent();

// 403 Forbidden
abort(403, 'You do not own this post.');`,
          explanation:
            "A classic anti-pattern is returning 200 OK with { 'error': 'Invalid email' }. Proper APIs use status codes to communicate outcome categories (2xx success, 4xx client mistake, 5xx server crash) directly in the HTTP header.",
        },
        content: [
          "200 OK: Generic success with payload.",
          "201 Created: New record successfully stored (used on POST).",
          "204 No Content: Operation succeeded with empty body (used on DELETE).",
          "401 Unauthorized: Missing or invalid authentication token.",
          "403 Forbidden: User authenticated, but lacks permission for this action.",
          "422 Unprocessable Content: Validation failed on incoming request fields.",
        ],
        challenge: {
          type: "api-simulator",
          question: "Compose and transmit an API request: Send a POST request to create a new post at '/api/v1/posts' with a JSON body and verify the 201 Created server response.",
          apiTarget: {
            expectedMethod: "POST",
            expectedEndpoint: "/api/v1/posts",
            requiredBodyKeys: ["title"],
            defaultMethod: "GET",
            defaultEndpoint: "/api/v1/",
            defaultBody: '{\n  "title": "Flutter Meets Laravel",\n  "content": "Building scalable mobile backends"\n}',
            response: {
              status: 201,
              statusText: "Created",
              timeMs: 38,
              headers: {
                "Content-Type": "application/json",
                "Location": "/api/v1/posts/42",
              },
              body: {
                id: 42,
                title: "Flutter Meets Laravel",
                content: "Building scalable mobile backends",
                created_at: "2026-10-01T08:30:00Z",
              },
            },
          },
          correctAnswer: "POST /api/v1/posts",
          explanation:
            "HTTP 201 Created explicitly signals that a new server resource was successfully instantiated, returning the created entity payload and its location.",
          xp: 35,
        },
      },
      {
        id: "m8l2",
        moduleId: "m8",
        title: "REST Architecture & Idempotency",
        readTime: "7 min",
        xp: 45,
        summary:
          "Understand safe vs idempotent HTTP methods so your Flutter app handles poor cellular connections and network retries without creating duplicate orders.",
        flutterParallel: {
          concept: "Safe retries on PUT/DELETE vs double-charge risks on POST",
          flutterFile: "lib/core/api_retry_policy.dart",
          laravelFile: "routes/api.php",
          flutterCode: `// Flutter: Only retry idempotent calls automatically!
bool canRetry(RequestOptions req) {
  const idempotent = ['GET', 'HEAD', 'PUT', 'DELETE'];
  return idempotent.contains(req.method.toUpperCase());
  // POST /checkout requires an Idempotency-Key header!
}`,
          laravelCode: `// PUT: Idempotent - repeated identical calls yield same result
Route::put('/profile', [ProfileController::class, 'update']);

// POST: Non-idempotent - calling 3 times creates 3 records!
Route::post('/orders', [OrderController::class, 'store']);

// DELETE: Idempotent - resource remains gone
Route::delete('/posts/{post}', [PostController::class, 'destroy']);`,
          explanation:
            "When mobile devices lose connectivity mid-request, Flutter might not receive the server response. Retrying a PUT or DELETE is completely safe because the resulting state is identical. Retrying a POST without caution creates duplicate records unless protected by an Idempotency-Key header.",
        },
        content: [
          "Safe methods (GET, HEAD) never mutate server state and can be safely cached or pre-fetched.",
          "Idempotent methods (PUT, DELETE) produce the identical outcome whether executed once or 10 times consecutively.",
          "Non-idempotent methods (POST, PATCH) create new resources or append modifications with each execution.",
          "Network retry policy: Mobile clients should automatically retry failed GET and PUT requests, but require user confirmation or idempotency keys for POST.",
        ],
        challenge: {
          type: "mcq",
          question: "Which of the following HTTP methods is considered idempotent?",
          options: ["POST", "PUT", "PATCH (partial append)", "CONNECT"],
          correctAnswer: 1,
          explanation:
            "PUT replaces the entire resource representation: executing it multiple times leaves the server in the exact same state as executing it once.",
          xp: 25,
        },
      },
      {
        id: "m8l3",
        moduleId: "m8",
        title: "API Versioning Strategies (URI vs Header)",
        readTime: "6 min",
        xp: 45,
        summary:
          "Mobile apps cannot be forced to update immediately. Architect versioned routes to support legacy Flutter builds alongside new releases.",
        flutterParallel: {
          concept: "Dio baseUrl with version prefix vs Laravel Route::prefix('v1')",
          flutterFile: "lib/core/api_client.dart",
          laravelFile: "routes/api.php",
          flutterCode: `// Flutter: Base URL locked to compatible API version
class ApiClient {
  static final dio = Dio(BaseOptions(
    baseUrl: 'https://api.laragram.com/api/v1',
    headers: {'Accept': 'application/json'},
  ));
}`,
          laravelCode: `// Laravel: Clean isolated version routing
Route::prefix('v1')->group(function () {
    Route::apiResource('posts', Api\\V1\\PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('posts', Api\\V2\\PostController::class);
});`,
          explanation:
            "Web applications update all clients on page refresh, but mobile app store updates take months to reach 100% adoption. URI versioning (/api/v1/ vs /api/v2/) allows legacy mobile apps and modern Flutter builds to run simultaneously without breaking backwards compatibility.",
        },
        content: [
          "URI versioning (/api/v1) is explicit, easily testable in Postman, and supported by every HTTP client.",
          "Header versioning (Accept: application/vnd.company.v2+json) keeps URLs clean but complicates CDN caching and debugging.",
          "Separate controller namespaces (App\\Http\\Controllers\\Api\\V1 and V2) isolate breaking business logic changes.",
          "Use the HTTP Sunset header (RFC 8594) to communicate scheduled endpoint decommission dates to client developers.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Define an isolated route group for version 1 of your API.",
          code: `Route::{{blank}}('v1')->group(function () {
    Route::apiResource('posts', PostController::class);
});`,
          options: ["prefix", "version", "path", "namespace"],
          correctAnswer: "prefix",
          explanation:
            "Route::prefix('v1') prepends '/v1' to every URI defined inside the closure.",
          xp: 25,
        },
      },
      {
        id: "m8l4",
        moduleId: "m8",
        title: "Nested REST Resources & Shallow Routing",
        readTime: "7 min",
        xp: 50,
        summary:
          "Design intuitive sub-resource endpoints for relational data without creating monstrous, deeply-nested URLs.",
        flutterParallel: {
          concept: "Fetching post comments vs Laravel shallow nested resource routes",
          flutterFile: "lib/repositories/comment_repository.dart",
          laravelFile: "routes/api.php",
          flutterCode: `// Nested for collection under parent:
await dio.get('/posts/\${postId}/comments');

// Shallow for direct modification by comment ID:
await dio.delete('/comments/\${commentId}');`,
          laravelCode: `// Generates:
// GET|POST /posts/{post}/comments
// GET|PUT|DELETE /comments/{comment}
Route::apiResource('posts.comments', CommentController::class)
    ->shallow();`,
          explanation:
            "When fetching comments belonging to post #42, GET /posts/42/comments is natural. But when deleting comment #99, DELETE /posts/42/comments/99 is redundant because comment ID #99 is already globally unique. Laravel's ->shallow() creates this clean mobile-friendly routing automatically.",
        },
        content: [
          "Nested resources model child relationships: GET /posts/{post}/comments and POST /posts/{post}/comments.",
          "Never nest deeper than 2 levels (avoid anti-patterns like /users/1/posts/2/comments/3/likes).",
          "Shallow routing assigns direct endpoints (GET /comments/{comment}, DELETE /comments/{comment}) once a resource has its own unique ID.",
          "Laravel ->shallow() automatically generates parent-scoped index/store routes and global show/update/destroy routes.",
        ],
        challenge: {
          type: "mcq",
          question: "With shallow routing on 'posts.comments', what is the endpoint to delete comment #15?",
          options: [
            "/posts/{post}/comments/15",
            "/comments/15",
            "/posts/comments/delete/15",
            "/api/delete-comment?id=15",
          ],
          correctAnswer: 1,
          explanation:
            "Shallow routing removes the redundant parent post parameter for single-resource operations, leaving clean /comments/{comment} endpoints.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m9",
    index: 9,
    trackId: "track-3",
    trackName: "Track 3: REST API Mastery",
    title: "Validation, FormRequests & 422 Envelopes",
    tagline: "Never trust the client. Validate everything.",
    description:
      "FormRequest classes, complex validation rules, and Laravel's standardized 422 validation error envelope.",
    color: "#f43f5e",
    icon: "shield-check",
    lessons: [
      {
        id: "m9l1",
        moduleId: "m9",
        title: "The Validation Gate & 422 Error Envelope",
        readTime: "7 min",
        xp: 50,
        summary:
          "Keep controllers lean with dedicated FormRequests. Understand Laravel's standardized 422 validation envelope and parse it cleanly in Flutter.",
        flutterParallel: {
          concept: "TextFormField validators vs FormRequest 422 envelopes",
          flutterFile: "lib/views/register_form.dart",
          laravelFile: "app/Http/Requests/StoreUserRequest.php",
          flutterCode: `// Client validation can be bypassed by Postman!
// Server validation is the true gatekeeper.
TextFormField(
  validator: (v) => v!.isEmpty ? 'Email required' : null,
);`,
          laravelCode: `class StoreUserRequest extends FormRequest {
    public function authorize(): bool { return true; }

    public function rules(): array {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:8'],
        ];
    }
}`,
          explanation:
            "Client validation provides instant UI feedback, but anyone can send raw HTTP requests to your API. Laravel FormRequests execute before the controller method: if validation fails, Laravel automatically aborts and returns an HTTP 422 with an error dictionary.",
        },
        content: [
          "php artisan make:request StoreUserRequest creates a dedicated request validator class.",
          "The rules() array defines validation constraints: required, string, email, unique, exists, in, min, max.",
          "Standard 422 response envelope: { 'message': 'The email has already been taken.', 'errors': { 'email': ['The email has already been taken.'] } }.",
          "In controllers, call $request->validated() to retrieve ONLY the validated attributes, ignoring any malicious extra fields sent by the client.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Retrieve only the validated data inside the controller.",
          code: `public function store(StorePostRequest $request) {
    $data = $request->{{blank}}();
    return Post::create($data);
}`,
          options: ["validated", "all", "input", "safe"],
          correctAnswer: "validated",
          explanation:
            "$request->validated() returns strictly the fields defined in the FormRequest rules, guarding against unauthorized parameter injection.",
          xp: 25,
        },
      },
      {
        id: "m9l2",
        moduleId: "m9",
        title: "Validation Rules Deep Dive",
        readTime: "7 min",
        xp: 45,
        summary:
          "Master essential database validation rules: exists, unique (with update ignore), sometimes for PATCH, and nested array validation.",
        flutterParallel: {
          concept: "Regex validators in Flutter vs Laravel declarative DB rules",
          flutterFile: "lib/features/posts/post_form.dart",
          laravelFile: "app/Http/Requests/UpdatePostRequest.php",
          flutterCode: `// Flutter: Complex client-side regex & logic
String? validateCategory(int? id) {
  if (id == null) return 'Category required';
  // Cannot verify if id actually exists in DB!
  return null;
}`,
          laravelCode: `public function rules(): array {
    $postId = $this->route('post')?->id;
    return [
        // Exists in categories table id column
        'category_id' => ['required', 'exists:categories,id'],
        // Unique in posts slug, ignore current post ID
        'slug' => ['required', 'unique:posts,slug,' . $postId],
        // Validate each tag in array
        'tags' => ['array', 'max:5'],
        'tags.*' => ['string', 'max:30'],
        // Only validate if present (great for PATCH)
        'status' => ['sometimes', 'in:draft,published,archived'],
    ];
}`,
          explanation:
            "Mobile apps cannot verify foreign keys or database uniqueness without an API call. Laravel's exists and unique rules verify database integrity directly in SQL. The 'sometimes' rule allows PATCH endpoints to validate only the fields submitted by the client.",
        },
        content: [
          "exists:categories,id guarantees the foreign key ID exists in the database table before query execution.",
          "unique:posts,slug,{$id} prevents duplicate keys while allowing a record to preserve its own slug when updating.",
          "sometimes executes rules only when the key is present in the request body, perfect for partial PATCH updates.",
          "Array wildcard syntax tags.* applies constraints to every item in a JSON array payload.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Verify that category_id exists in the database categories table.",
          code: `'category_id' => ['required', '{{blank}}:categories,id'],`,
          options: ["exists", "inTable", "hasOne", "contains"],
          correctAnswer: "exists",
          explanation:
            "The 'exists:table,column' validation rule verifies that the incoming value matches an active row in the database.",
          xp: 25,
        },
      },
      {
        id: "m9l3",
        moduleId: "m9",
        title: "Parsing 422 Errors in Flutter (Dio to Form UI)",
        readTime: "7 min",
        xp: 50,
        summary:
          "Build an automated Dio interceptor that intercepts 422 Unprocessable Content and attaches server errors directly to Flutter TextFormField widgets.",
        flutterParallel: {
          concept: "Transforming 422 envelope errors into Map<String, String> for UI",
          flutterFile: "lib/core/network/error_interceptor.dart",
          laravelFile: "app/Exceptions/Handler.php",
          flutterCode: `// Flutter: Dio interceptor catching 422
class ValidationException implements Exception {
  final Map<String, List<String>> errors;
  ValidationException(this.errors);
}

// In Dio onError:
if (err.response?.statusCode == 422) {
  final raw = err.response?.data['errors'] as Map<String, dynamic>;
  final mapped = raw.map((k, v) => MapEntry(k, List<String>.from(v)));
  throw ValidationException(mapped);
}`,
          laravelCode: `// Laravel standardized 422 HTTP payload:
{
  "message": "The email has already been taken. (and 1 more error)",
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password field must be at least 8 characters."
    ]
  }
}`,
          explanation:
            "When validation fails, Laravel automatically serializes a 422 JSON dictionary with an 'errors' object containing arrays of error messages keyed by field name. Your Flutter Dio interceptor extracts this map so each TextFormField can display its server error without manual boilerplate.",
        },
        content: [
          "Laravel automatically generates HTTP 422 with a structured error envelope when FormRequest fails.",
          "The 'errors' dictionary groups validation failures by field name, allowing direct 1:1 binding to Flutter form state.",
          "Flutter state management (Bloc/Riverpod) stores a Map<String, String> of current field errors.",
          "TextFormField(decoration: InputDecoration(errorText: errors['email'])) displays the backend rejection natively.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Extract the dictionary of field validation errors from Laravel's 422 response.",
          code: `final errorDict = response.data['{{blank}}'] as Map<String, dynamic>;`,
          options: ["errors", "messages", "validation", "fields"],
          correctAnswer: "errors",
          explanation:
            "Laravel's standardized 422 validation envelope nests field error arrays inside the top-level 'errors' property.",
          xp: 25,
        },
      },
      {
        id: "m9l4",
        moduleId: "m9",
        title: "Custom Validation Rules & Authorization Gates",
        readTime: "6 min",
        xp: 45,
        summary:
          "Write reusable custom validation rules implementing ValidationRule and enforce route authorization before validation begins.",
        flutterParallel: {
          concept: "Custom validator functions vs Laravel ValidationRule class",
          flutterFile: "lib/validators/phone_validator.dart",
          laravelFile: "app/Rules/ValidPhoneNumber.php",
          flutterCode: `// Flutter client validator
String? validatePhone(String? val) {
  if (val == null || !RegExp(r'^\\+?[1-9]\\d{1,14}$').hasMatch(val)) {
    return 'Invalid E.164 phone number';
  }
  return null;
}`,
          laravelCode: `class ValidPhoneNumber implements ValidationRule {
    public function validate(string $attribute, mixed $value, Closure $fail): void {
        if (!preg_match('/^\\+?[1-9]\\d{1,14}$/', $value)) {
            $fail("The {$attribute} must be a valid E.164 international phone number.");
        }
    }
}

// In FormRequest:
public function authorize(): bool {
    return $this->user()->can('update', $this->route('post'));
}`,
          explanation:
            "For complex business rules (validating international phone formats, checking external APIs, or verifying coupon codes), Laravel provides dedicated ValidationRule classes. Furthermore, the authorize() method in FormRequest runs before rules, aborting with HTTP 403 Forbidden if the user lacks permissions.",
        },
        content: [
          "Generate custom rules with php artisan make:rule ValidPhoneNumber implementing the ValidationRule interface.",
          "The validate($attribute, $value, $fail) signature invokes $fail('Message') if criteria fail.",
          "FormRequest authorize(): Return false to abort immediately with 403 Forbidden before running validation rules.",
          "Access route parameters inside FormRequest via $this->route('parameter') for permission checks.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Fail validation inside a custom rule by invoking the failure callback.",
          code: `public function validate(string $attribute, mixed $value, Closure $fail): void {
    if (!isValid($value)) {
        {{blank}}("The {$attribute} is invalid.");
    }
}`,
          options: ["$fail", "$error", "$abort", "$reject"],
          correctAnswer: "$fail",
          explanation:
            "Invoking the $fail closure with an error string marks the attribute as invalid and appends the message to the 422 envelope.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m10",
    index: 10,
    trackId: "track-3",
    trackName: "Track 3: REST API Mastery",
    title: "Eloquent API Resources & JSON Shaping",
    tagline: "Never expose raw database columns to mobile apps",
    description:
      "DTO transformation layer, whenLoaded() relationship guards, Resource Collections, and pagination meta wrapping.",
    color: "#f43f5e",
    icon: "package",
    lessons: [
      {
        id: "m10l1",
        moduleId: "m10",
        title: "API Resources: Decoupling Database from JSON",
        readTime: "7 min",
        xp: 50,
        summary:
          "Transform database models into predictable JSON contracts that match your Flutter model fromJson() definitions perfectly.",
        flutterParallel: {
          concept: "Flutter fromJson() contract vs Laravel JsonResource transformer",
          flutterFile: "lib/models/post_model.dart",
          laravelFile: "app/Http/Resources/PostResource.php",
          flutterCode: `class PostModel {
  final int id;
  final String title;
  final String authorName; // Flattened!

  factory PostModel.fromJson(Map<String, dynamic> j) => PostModel(
    id: j['id'],
    title: j['title'],
    authorName: j['author_name'],
  );
}`,
          laravelCode: `class PostResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author_name' => $this->author->name,
            'created_at' => $this->created_at->toISOString(),
            // Safe relationship inclusion
            'comments' => CommentResource::collection(
                $this->whenLoaded('comments')
            ),
        ];
    }
}`,
          explanation:
            "If you return an Eloquent model directly, changing a database column name immediately breaks your published mobile app. API Resources act as a presentation layer: you shape, rename, format dates, and selectively include relationships.",
        },
        content: [
          "php artisan make:resource PostResource creates a transformation transformer.",
          "$this->whenLoaded('comments') only includes the comments relationship if it was eager-loaded by the query, preventing accidental N+1 queries during serialization.",
          "Transform collections with PostResource::collection($posts).",
          "Paginated results automatically append 'meta' and 'links' objects with total pages, current page, and next/prev URLs.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Prevent N+1 queries by including a relationship only when already loaded.",
          code: `'tags' => TagResource::collection(
    $this->{{blank}}('tags')
),`,
          options: ["whenLoaded", "whenHas", "ifLoaded", "with"],
          correctAnswer: "whenLoaded",
          explanation:
            "$this->whenLoaded('relation') only outputs the relation if it was eager-loaded, avoiding unexpected queries during serialization.",
          xp: 25,
        },
      },
      {
        id: "m10l2",
        moduleId: "m10",
        title: "Nested Resources & Conditional Relationships",
        readTime: "7 min",
        xp: 45,
        summary:
          "Safely serialize nested relationships without triggering N+1 database queries using whenLoaded() and conditional attribute merging.",
        flutterParallel: {
          concept: "Nullable nested Dart objects vs Laravel conditional relation inclusion",
          flutterFile: "lib/models/post_detail_model.dart",
          laravelFile: "app/Http/Resources/PostDetailResource.php",
          flutterCode: `class PostDetailModel {
  final int id;
  final UserModel? author; // Nullable if not requested
  final List<CommentModel> comments;

  factory PostDetailModel.fromJson(Map<String, dynamic> j) => PostDetailModel(
    id: j['id'],
    author: j['author'] != null ? UserModel.fromJson(j['author']) : null,
    comments: (j['comments'] as List? ?? []).map((c) => CommentModel.fromJson(c)).toList(),
  );
}`,
          laravelCode: `class PostDetailResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            // Only loaded if Post::with('author') was called:
            'author' => new UserResource($this->whenLoaded('author')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            // Merge extra fields only for admin users:
            $this->mergeWhen($request->user()?->isAdmin(), [
                'internal_notes' => $this->internal_notes,
            ]),
        ];
    }
}`,
          explanation:
            "Directly accessing $this->author inside a Resource executes a SQL query on every single row if not eager-loaded. Using $this->whenLoaded('author') ensures the relation is only included if eager-loaded, omitting the key or returning null otherwise and preventing severe database bottlenecks.",
        },
        content: [
          "Calling $this->relation inside a Resource without whenLoaded causes silent N+1 query execution during serialization.",
          "$this->whenLoaded('relation', fn() => new RelationResource($this->relation)) evaluates only when loaded.",
          "$this->mergeWhen($condition, [...]) conditionally injects fields into the top-level JSON array based on permissions.",
          "$this->whenPivotLoaded('table_name', fn() => ...) shapes attributes stored inside intermediate pivot tables.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Conditionally merge admin-only fields into the resource response array.",
          code: `$this->{{blank}}($request->user()?->isAdmin(), [
    'cost_basis' => $this->cost_basis,
]);`,
          options: ["mergeWhen", "whenAdmin", "mergeIf", "includeWhen"],
          correctAnswer: "mergeWhen",
          explanation:
            "$this->mergeWhen($condition, $array) conditionally flattens the provided array into the resource JSON only when the condition evaluates to true.",
          xp: 25,
        },
      },
      {
        id: "m10l3",
        moduleId: "m10",
        title: "Resource Collections & Custom Pagination Metadata",
        readTime: "7 min",
        xp: 50,
        summary:
          "Transform collections of models and customize standardized pagination metadata (current_page, last_page, total) for Flutter pagination controllers.",
        flutterParallel: {
          concept: "Flutter PaginatedList<T> vs Laravel ResourceCollection metadata",
          flutterFile: "lib/models/paginated_response.dart",
          laravelFile: "app/Http/Resources/PostCollection.php",
          flutterCode: `class PaginatedResponse<T> {
  final List<T> data;
  final int currentPage;
  final int lastPage;
  final int total;

  bool get hasMore => currentPage < lastPage;
  // Easily drives Flutter ScrollController pagination
}`,
          laravelCode: `class PostCollection extends ResourceCollection {
    public $collects = PostResource::class;

    public function with(Request $request): array {
        return [
            'meta' => [
                'api_version' => 'v1.4',
                'server_time' => now()->toIso8601String(),
            ],
        ];
    }
}`,
          explanation:
            "When paginating models with Post::paginate(15), returning PostResource::collection($paginator) preserves the pagination wrapper: data contains the transformed items, links holds URL navigators, and meta holds current_page, last_page, and total. Flutter maps these directly to state controllers.",
        },
        content: [
          "PostResource::collection($paginator) automatically structures output with 'data', 'links', and 'meta' keys.",
          "Custom collection classes: php artisan make:resource PostCollection extends ResourceCollection.",
          "The with(Request $request) method appends global metadata like execution duration, server timestamp, or API version.",
          "Flutter clients map meta.current_page and meta.last_page to effortlessly detect when the user has scrolled to the end of the list.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Append top-level custom metadata to a ResourceCollection response.",
          code: `public function {{blank}}(Request $request): array {
    return [
        'meta' => ['server' => 'aws-us-east-1'],
    ];
}`,
          options: ["with", "append", "additional", "meta"],
          correctAnswer: "with",
          explanation:
            "The with() method in a Resource or ResourceCollection class allows you to append top-level metadata to the returned JSON response.",
          xp: 25,
        },
      },
      {
        id: "m10l4",
        moduleId: "m10",
        title: "Consistent API Response Envelopes",
        readTime: "6 min",
        xp: 45,
        summary:
          "Design a unified JSON response envelope pattern across your entire backend so your Flutter app consumes every endpoint with a single generic handler.",
        flutterParallel: {
          concept: "Dart ApiResponse<T> wrapper vs Laravel unified JSON responses",
          flutterFile: "lib/core/api_response.dart",
          laravelFile: "app/Http/Controllers/ApiController.php",
          flutterCode: `class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final Map<String, dynamic>? error;

  ApiResponse({required this.success, this.data, this.message, this.error});
  // One generic class parses EVERY API call in the entire app!
}`,
          laravelCode: `abstract class ApiController extends Controller {
    protected function success(mixed $data = null, string $message = 'Success', int $code = 200) {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error(string $message, int $code = 400, mixed $details = null) {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => $details,
        ], $code);
    }
}`,
          explanation:
            "Inconsistent API endpoints (some returning raw arrays, some returning { status: 'ok' }, others returning { result: [] }) force mobile developers to write bespoke parsers for every screen. A strict unified envelope { success, data, error } enables a single generic ApiResponse<T> in Dart.",
        },
        content: [
          "Consistent envelopes prevent fragmented error handling across mobile screens.",
          "JsonResource::withoutWrapping() disables default 'data' nesting if you prefer custom top-level keys.",
          "Success envelope structure: { 'success': true, 'data': ..., 'message': '...' } with HTTP 200/201.",
          "Error envelope structure: { 'success': false, 'error': { 'code': '...', 'details': [...] } } with HTTP 4xx/5xx.",
        ],
        challenge: {
          type: "mcq",
          question: "Why should an API adopt a standardized response envelope across all endpoints?",
          options: [
            "It speeds up database write queries",
            "It allows the mobile client to use a single generic ApiResponse<T> deserializer for all endpoints",
            "It avoids having to use HTTP status codes",
            "It eliminates the need for authentication tokens",
          ],
          correctAnswer: 1,
          explanation:
            "A standardized envelope guarantees that the mobile client can handle all API responses through a single generic wrapper class, drastically reducing client-side boilerplate.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m11",
    index: 11,
    trackId: "track-3",
    trackName: "Track 3: REST API Mastery",
    title: "Mobile API Authentication with Laravel Sanctum",
    tagline: "Stateless Bearer token authentication for mobile clients",
    description:
      "Personal Access Tokens, password hashing with bcrypt, token revocation on logout, and token abilities.",
    color: "#f43f5e",
    icon: "key",
    lessons: [
      {
        id: "m11l1",
        moduleId: "m11",
        title: "Stateless Mobile Auth & Token Lifecycles",
        readTime: "7 min",
        xp: 50,
        summary:
          "Mobile apps can't use browser session cookies. Learn how Laravel Sanctum issues cryptographically secure Bearer tokens.",
        flutterParallel: {
          concept: "Storing tokens in flutter_secure_storage vs Sanctum Personal Access Tokens",
          flutterFile: "lib/auth/auth_service.dart",
          laravelFile: "app/Http/Controllers/AuthController.php",
          flutterCode: `// Mobile side: storing token securely
final token = response.data['token'];
await secureStorage.write(key: 'jwt', value: token);

// Attaching to future calls
dio.options.headers['Authorization'] = 'Bearer $token';`,
          laravelCode: `// Server side: issuing a token
public function login(Request $request) {
    $user = User::where('email', $request->email)->first();
    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    $token = $user->createToken('mobile-app')->plainTextToken;
    return response()->json(['token' => $token, 'user' => new UserResource($user)]);
}`,
          explanation:
            "Web browsers automatically store cookies. Mobile apps operate statelessly: on successful login, Sanctum generates a high-entropy string, stores its SHA-256 hash in the database, and returns the plain-text token. The mobile app stores it in keychain/keystore and passes it in the Authorization header.",
        },
        content: [
          "Sanctum stores hashed tokens in the personal_access_tokens table: even if the DB is compromised, tokens cannot be decrypted.",
          "Verifying passwords: Hash::check($request->password, $user->password) uses bcrypt or argon2id.",
          "Protecting routes: Route::middleware('auth:sanctum')->group(fn() => ...).",
          "Logging out: $request->user()->currentAccessToken()->delete() revokes the token from the database immediately.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Issue a new plain text token for the authenticated user.",
          code: `$token = $user->createToken('mobile-device')->{{blank}};`,
          options: ["plainTextToken", "tokenString", "value", "rawToken"],
          correctAnswer: "plainTextToken",
          explanation:
            "$user->createToken('device')->plainTextToken returns the unhashed token string that must be passed back to the mobile client.",
          xp: 25,
        },
      },
      {
        id: "m11l2",
        moduleId: "m11",
        title: "User Registration & Secure Password Hashing",
        readTime: "7 min",
        xp: 45,
        summary:
          "Implement secure mobile sign-up with password confirmation, bcrypt hashing via Hash::make(), and instant auto-login token generation.",
        flutterParallel: {
          concept: "Mobile signup form vs Laravel Hash::make() and immediate token issuance",
          flutterFile: "lib/auth/register_screen.dart",
          laravelFile: "app/Http/Controllers/Api/RegisterController.php",
          flutterCode: `// Flutter: Registration submission
final res = await dio.post('/register', data: {
  'name': nameController.text,
  'email': emailController.text,
  'password': passwordController.text,
  'password_confirmation': confirmController.text,
});
// Save token and navigate straight to Home feed:
await secureStorage.write(key: 'token', value: res.data['token']);`,
          laravelCode: `public function register(RegisterRequest $request) {
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    // Issue token immediately so user is logged in
    $token = $user->createToken('mobile_app')->plainTextToken;

    return response()->json([
        'user' => new UserResource($user),
        'token' => $token,
    ], 201);
}`,
          explanation:
            "Storing plain-text passwords is an unforgivable security breach. Laravel uses Hash::make() with bcrypt/argon2id (incorporating automatic salt and 12-round computational cost). Returning a token directly on registration provides a delightful mobile onboarding experience without requiring a redundant login screen.",
        },
        content: [
          "Hash::make($password) generates a cryptographically secure one-way salted hash.",
          "The 'confirmed' validation rule requires the request to contain a matching 'password_confirmation' field.",
          "Password::min(8)->letters()->numbers()->uncompromised() enforces modern enterprise security standards.",
          "Issuing a token immediately upon registration logs the mobile user in seamlessly in one HTTP round-trip.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Securely hash the user's password before database insertion.",
          code: `'password' => {{blank}}::make($request->password),`,
          options: ["Hash", "Crypt", "Bcrypt", "Security"],
          correctAnswer: "Hash",
          explanation:
            "Hash::make() utilizes Laravel's configured hashing driver (bcrypt by default) to generate a salted cryptographic password hash.",
          xp: 25,
        },
      },
      {
        id: "m11l3",
        moduleId: "m11",
        title: "Protecting Routes & Retrieving Auth User",
        readTime: "7 min",
        xp: 50,
        summary:
          "Secure private endpoints behind the auth:sanctum middleware, access the authenticated user via $request->user(), and handle 401s in Dio.",
        flutterParallel: {
          concept: "Attaching Bearer token via Dio Interceptor vs Route::middleware('auth:sanctum')",
          flutterFile: "lib/core/auth_interceptor.dart",
          laravelFile: "routes/api.php",
          flutterCode: `// Flutter: Interceptor attaches Bearer token automatically
class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions opts, RequestInterceptorHandler h) async {
    final token = await secureStorage.read(key: 'token');
    if (token != null) {
      opts.headers['Authorization'] = 'Bearer \${token}';
    }
    h.next(opts);
  }
}`,
          laravelCode: `// Laravel: Protect entire API route groups
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return new UserResource($request->user());
    });

    Route::apiResource('posts', PostController::class);
});`,
          explanation:
            "When Flutter passes 'Authorization: Bearer <token>', Sanctum parses the token, hashes it with SHA-256, looks it up in personal_access_tokens, and populates $request->user(). If the token is missing or invalid, Laravel terminates the request with HTTP 401 Unauthorized before controller code ever runs.",
        },
        content: [
          "The auth:sanctum middleware guards routes and rejects unauthenticated callers with HTTP 401 Unauthorized.",
          "$request->user() returns the authenticated Eloquent User model instance.",
          "Token expiration can be configured in config/sanctum.php via 'expiration' => 60 * 24 * 30 (30 days for mobile).",
          "Dio onError interceptor catches 401 errors, deletes local credentials, and automatically routes the user to the login screen.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Protect a group of API routes using Laravel Sanctum.",
          code: `Route::middleware('{{blank}}')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
});`,
          options: ["auth:sanctum", "sanctum", "auth:api", "verified"],
          correctAnswer: "auth:sanctum",
          explanation:
            "The 'auth:sanctum' middleware enforces Sanctum token authentication on the targeted route group.",
          xp: 25,
        },
      },
      {
        id: "m11l4",
        moduleId: "m11",
        title: "Token Revocation & Logout (Single vs All Devices)",
        readTime: "6 min",
        xp: 45,
        summary:
          "Provide granular session control: logout from current device vs wiping all active mobile and tablet sessions from the database.",
        flutterParallel: {
          concept: "Single device logout vs 'Log out of all devices' security feature",
          flutterFile: "lib/settings/security_settings_view.dart",
          laravelFile: "app/Http/Controllers/Api/AuthController.php",
          flutterCode: `// Flutter: User taps "Sign out of all devices"
Future<void> logoutAll() async {
  await dio.post('/auth/logout-all');
  await secureStorage.deleteAll();
  navigatorKey.currentState?.pushReplacementNamed('/login');
}`,
          laravelCode: `// Single device logout (only current token revoked):
public function logout(Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->noContent();
}

// Security: Revoke all tokens across all phones & tablets
public function logoutAll(Request $request) {
    $request->user()->tokens()->delete();
    return response()->noContent();
}`,
          explanation:
            "Tokens stored in the database remain valid until revoked or expired. If a user loses their phone or changes their password, calling $user->tokens()->delete() revokes every active token immediately. For a standard sign-out, $request->user()->currentAccessToken()->delete() revokes only that specific phone's session.",
        },
        content: [
          "$request->user()->currentAccessToken()->delete() deletes only the specific token used to authenticate this HTTP request.",
          "$request->user()->tokens()->delete() invalidates all issued tokens across all devices simultaneously.",
          "$request->user()->tokens()->where('id', '!=', $currentId)->delete() signs out all OTHER devices while keeping the current one active.",
          "Mobile best practice: Flutter must delete the stored token locally upon successful logout response.",
        ],
        challenge: {
          type: "mcq",
          question: "Which method deletes ONLY the active session token without logging the user out of their other devices?",
          options: [
            "$request->user()->tokens()->delete()",
            "$request->user()->currentAccessToken()->delete()",
            "$request->user()->delete()",
            "Sanctum::revokeAll()",
          ],
          correctAnswer: 1,
          explanation:
            "$request->user()->currentAccessToken()->delete() specifically targets and deletes only the token row matching the bearer token from the current request.",
          xp: 25,
        },
      },
      {
        id: "m11l5",
        moduleId: "m11",
        title: "Token Abilities & Scoped Permissions",
        readTime: "7 min",
        xp: 50,
        summary:
          "Issue scoped tokens with granular abilities (e.g. read-only tokens for widgets vs full-access tokens for admin screens) and enforce them with tokenCan().",
        flutterParallel: {
          concept: "Feature flags / RBAC in Flutter vs Sanctum Token Abilities",
          flutterFile: "lib/core/user_permissions.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `// Flutter: Checking local capabilities before rendering UI
if (tokenAbilities.contains('posts:create')) {
  return FloatingActionButton(onPressed: _openEditor);
}`,
          laravelCode: `// When issuing token:
$token = $user->createToken('editor-token', ['posts:create', 'posts:update']);

// In Controller:
public function store(Request $request) {
    if (! $request->user()->tokenCan('posts:create')) {
        abort(403, 'Your token lacks create abilities.');
    }
    // Proceed with post creation...
}`,
          explanation:
            "Not all tokens should have equal privileges. A mobile companion widget might only need ['posts:read'], while a partner API integration might need ['orders:create']. Sanctum serializes abilities into the token record and provides tokenCan() for granular endpoint enforcement.",
        },
        content: [
          "Assign abilities when creating tokens: $user->createToken('name', ['posts:create', 'posts:delete']).",
          "The ['*'] wildcard ability grants unrestricted access to all operations.",
          "$request->user()->tokenCan('ability') verifies permissions inside controllers or policies.",
          "Middleware route protection: Route::post('/posts')->middleware('ability:posts:create') guarantees permission before route invocation.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Verify that the authenticated token possesses the required ability.",
          code: `if (! $request->user()->{{blank}}('posts:delete')) {
    abort(403, 'Forbidden action.');
}`,
          options: ["tokenCan", "hasAbility", "canDo", "allows"],
          correctAnswer: "tokenCan",
          explanation:
            "$request->user()->tokenCan('ability') returns true if the active Sanctum token has been granted the specified ability.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m12",
    index: 12,
    trackId: "track-3",
    trackName: "Track 3: REST API Mastery",
    title: "Filtering, Sorting & Cursor-Based Pagination",
    tagline: "Handling 1,000,000 records without crashing your mobile app",
    description:
      "Offset degradation vs cursor pagination, infinite scroll feeds, and dynamic query filtering.",
    color: "#f43f5e",
    icon: "sliders",
    lessons: [
      {
        id: "m12l1",
        moduleId: "m12",
        title: "Offset vs. Cursor-Based Pagination",
        readTime: "6 min",
        xp: 45,
        summary:
          "Why page=5000 destroys database performance, and how cursor-based pagination powers buttery-smooth infinite scrolling feeds.",
        flutterParallel: {
          concept: "ListView.builder infinite scroll vs cursorPaginate()",
          flutterFile: "lib/feed/feed_controller.dart",
          laravelFile: "app/Http/Controllers/FeedController.php",
          flutterCode: `// Mobile stores next_cursor string
void loadMore() async {
  final res = await dio.get('/feed', queryParameters: {
    'cursor': nextCursor,
  });
  nextCursor = res.data['next_cursor'];
}`,
          laravelCode: `public function index() {
    // Fast O(1) query: WHERE id < cursor LIMIT 15
    return PostResource::collection(
        Post::latest('id')->cursorPaginate(15)
    );
}`,
          explanation:
            "Standard pagination uses OFFSET 50000 LIMIT 15: the database must read all 50,000 rows into memory and discard them. Cursor pagination uses an encoded base64 pointer: WHERE id < 4220 LIMIT 15, executing in 1 millisecond regardless of whether the table has 10 rows or 10 million.",
        },
        content: [
          "Cursor pagination eliminates duplicate or skipped items when new records are inserted while a user is scrolling.",
          "Use Post::cursorPaginate(20) for mobile feeds, chat histories, and notifications.",
          "Use standard Post::paginate(20) only when users need jump-to-page numbers (e.g. desktop admin dashboards).",
          "Dynamic query filtering: $query->when($request->category, fn($q, $cat) => $q->where('category', $cat)).",
        ],
        challenge: {
          type: "mcq",
          question: "Why is cursor pagination superior for mobile infinite scroll feeds?",
          options: [
            "It allows jumping directly to page 100",
            "It is constant O(1) time and prevents duplicate items when new posts are published",
            "It doesn't require a database index",
            "It compresses image files automatically",
          ],
          correctAnswer: 1,
          explanation:
            "Cursor pagination queries by indexed ID, eliminating slow OFFSET scans and preventing duplicate items when new rows are added while scrolling.",
          xp: 25,
        },
      },
      {
        id: "m12l2",
        moduleId: "m12",
        title: "Consuming Cursor Pagination in Flutter",
        readTime: "7 min",
        xp: 45,
        summary:
          "Connect Flutter's ScrollController to Laravel's cursorPaginate() using opaque cursor tokens for zero-lag infinite list feeds.",
        flutterParallel: {
          concept: "Flutter ScrollController threshold loading vs Laravel cursorPaginate()",
          flutterFile: "lib/feed/infinite_feed_controller.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `// Flutter: Infinite scroll handler
void onScroll() {
  if (controller.position.extentAfter < 300 && !isLoading && nextCursor != null) {
    loadNextPage();
  }
}

Future<void> loadNextPage() async {
  final res = await dio.get('/posts', queryParameters: {'cursor': nextCursor});
  items.addAll((res.data['data'] as List).map((i) => Post.fromJson(i)));
  nextCursor = res.data['next_cursor']; // Base64 cursor token
}`,
          laravelCode: `public function index() {
    // Returns { data: [...], next_cursor: "eyJpZCI6MTUs...", prev_cursor: null }
    return PostResource::collection(
        Post::latest('id')->cursorPaginate(15)
    );
}`,
          explanation:
            "Traditional offset pagination returns page numbers (page=2, page=3). Cursor pagination returns opaque tokens (next_cursor) encoding the exact point in the index where the query stopped. Flutter stores this token and passes it to subsequent page calls, ensuring sub-5ms lookups regardless of feed depth.",
        },
        content: [
          "Cursor response structure contains 'data', 'per_page', 'next_cursor', and 'prev_cursor'.",
          "Flutter state controllers maintain a String? nextCursor variable to track pagination position.",
          "When next_cursor is null, Flutter knows the absolute end of the feed has been reached and can disable listeners.",
          "cursorPaginate() never executes expensive COUNT(*) queries, preventing severe database latency spikes under heavy traffic.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Extract the next page cursor token from the Laravel API response.",
          code: `nextCursor = response.data['{{blank}}'];`,
          options: ["next_cursor", "next_page", "cursor", "pagination_token"],
          correctAnswer: "next_cursor",
          explanation:
            "Laravel's cursorPaginate() sets 'next_cursor' in the root response dictionary with an encoded string pointer or null if no further items exist.",
          xp: 25,
        },
      },
      {
        id: "m12l3",
        moduleId: "m12",
        title: "Dynamic Query Filtering with when() & Scopes",
        readTime: "7 min",
        xp: 50,
        summary:
          "Replace tangled if-else query spaghetti with clean, chainable Eloquent when() filters and relationship query constraints.",
        flutterParallel: {
          concept: "Filter sheet with optional checkboxes vs Laravel $query->when()",
          flutterFile: "lib/explore/filter_sheet.dart",
          laravelFile: "app/Http/Controllers/PostFilterController.php",
          flutterCode: `// Flutter: Assembling optional query params
final query = <String, dynamic>{};
if (selectedStatus != null) query['status'] = selectedStatus;
if (minPrice != null) query['min_price'] = minPrice;
if (tagSlug != null) query['tag'] = tagSlug;

final res = await dio.get('/search', queryParameters: query);`,
          laravelCode: `public function index(Request $request) {
    $posts = Post::query()
        // Only filters by status if client provided it
        ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
        // Numeric range filter
        ->when($request->filled('min_price'), fn($q) => $q->where('price', '>=', $request->min_price))
        // Relationship filter
        ->when($request->filled('tag'), fn($q, $tag) => $q->whereRelation('tags', 'slug', $tag))
        ->cursorPaginate(20);

    return PostResource::collection($posts);
}`,
          explanation:
            "Without when(), developers write messy if ($request->has('tag')) { $query = $query->where(...); } blocks. Laravel's when($condition, $callback) method executes the closure only when the first argument evaluates to true, resulting in clean, declarative query pipelines.",
        },
        content: [
          "$query->when($request->filled('key'), fn($q) => ...) only applies SQL constraints if the request parameter was provided.",
          "$request->filled('key') verifies the parameter exists AND is not empty or null.",
          "whereRelation('tags', 'slug', $tag) filters models by related table attributes in a single expressive call.",
          "Extracting filters into dedicated Query Pipeline classes keeps controllers exceptionally lean and testable.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Conditionally apply a query constraint only if the search parameter is present.",
          code: `$query->{{blank}}($request->filled('search'), function ($q) use ($request) {
    $q->whereFullText(['title', 'body'], $request->search);
});`,
          options: ["when", "if", "filter", "condition"],
          correctAnswer: "when",
          explanation:
            "$query->when($condition, $closure) conditionally executes the query building closure only if the condition evaluates to true.",
          xp: 25,
        },
      },
      {
        id: "m12l4",
        moduleId: "m12",
        title: "Multi-Column Sorting, Search & Fulltext Indexes",
        readTime: "6 min",
        xp: 45,
        summary:
          "Safely handle dynamic sort orders without SQL injection, and implement lightning-fast MySQL/PostgreSQL FULLTEXT search.",
        flutterParallel: {
          concept: "Sort dropdown in Flutter vs Server-side column whitelisting",
          flutterFile: "lib/explore/sort_dropdown.dart",
          laravelFile: "app/Http/Controllers/CatalogController.php",
          flutterCode: `// Flutter: Sort option enum
enum SortOption { newest, priceAsc, priceDesc, popular }

final query = {
  'sort': 'price',
  'order': 'asc', // or 'desc'
};`,
          laravelCode: `public function index(Request $request) {
    // Whitelist allowable sort columns
    $sortCol = match($request->input('sort')) {
        'price' => 'price',
        'title' => 'title',
        default => 'created_at',
    };
    $direction = $request->input('order') === 'desc' ? 'desc' : 'asc';

    $items = Product::query()
        ->when($request->search, fn($q, $s) => $q->whereFullText(['name', 'description'], $s))
        ->orderBy($sortCol, $direction)
        ->cursorPaginate(15);

    return ProductResource::collection($items);
}`,
          explanation:
            "Passing raw client input to orderBy($request->sort) creates serious vulnerabilities and allows attackers to trigger slow file sorts on unindexed columns. Whitelisting permitted sort columns with match() or in_array() ensures rock-solid security, while whereFullText() leverages database inverted indexes for millisecond search speeds.",
        },
        content: [
          "Always whitelist allowable sort keys with match() or in_array() to avoid SQL injection and unindexed table scans.",
          "Ensure direction is strictly sanitized to 'asc' or 'desc'.",
          "whereFullText(['title', 'body'], $query) searches database FULLTEXT indexes in natural language mode.",
          "For massive enterprise search workloads, Laravel Scout integrates Meilisearch or Algolia with zero extra boilerplate.",
        ],
        challenge: {
          type: "mcq",
          question: "Why must sort column names never be passed directly from $request->input('sort') into orderBy()?",
          options: [
            "Eloquent does not support strings in orderBy()",
            "It exposes the database to SQL injection or catastrophic unindexed column table scans",
            "It automatically deletes existing table indexes",
            "Flutter Dio cannot serialize sort strings",
          ],
          correctAnswer: 1,
          explanation:
            "Unsanitized sort columns allow attackers to perform blind SQL injection or force slow full-table filesorts on unindexed database columns.",
          xp: 25,
        },
      },
    ],
  },

  // ==============================================================================
  // TRACK 4: ADVANCED API ENGINEERING & DEVOPS
  // ==============================================================================

  {
    id: "m13",
    index: 13,
    trackId: "track-4",
    trackName: "Track 4: Advanced & Capstone",
    title: "Multipart File & Media Uploads",
    tagline: "From phone camera to cloud storage",
    description:
      "Multipart/form-data protocol, image validation, storage disks, and presigned S3 direct uploads.",
    color: "#34d399",
    icon: "upload-cloud",
    lessons: [
      {
        id: "m13l1",
        moduleId: "m13",
        title: "Uploading Images via Multipart/Form-Data",
        readTime: "6 min",
        xp: 45,
        summary:
          "Stream binary camera photos from Flutter Dio to Laravel, validate MIME types and file sizes, and store to disk.",
        flutterParallel: {
          concept: "Dio FormData.fromMap vs Laravel $request->file('avatar')",
          flutterFile: "lib/services/upload_service.dart",
          laravelFile: "app/Http/Controllers/AvatarController.php",
          flutterCode: `final formData = FormData.fromMap({
  'avatar': await MultipartFile.fromFile(
    pickedFile.path,
    filename: 'avatar.jpg',
  ),
});
await dio.post('/avatar', data: formData);`,
          laravelCode: `public function update(Request $request) {
    $request->validate([
        'avatar' => ['required', 'image', 'mimes:jpg,png,webp', 'max:2048'],
    ]);

    $path = $request->file('avatar')->store('avatars', 'public');
    $request->user()->update(['avatar_url' => Storage::url($path)]);
    return response()->json(['url' => Storage::url($path)]);
}`,
          explanation:
            "Binary photos cannot be sent inside standard application/json payloads. You send multipart/form-data with binary stream boundaries. Laravel validates that the file is truly an image (not an executable renamed .jpg) and saves it to cloud or local disk.",
        },
        content: [
          "Validation rule 'image' verifies true image headers (magic bytes), not just the file extension.",
          "Validation rule 'max:2048' limits file size to 2048 Kilobytes (2 Megabytes).",
          "Laravel abstraction: Storage::disk('s3')->putFile('photos', $file) works identically for local disk, Amazon S3, or Google Cloud Storage.",
          "The php artisan storage:link command creates a symbolic link from storage/app/public to public/storage for public HTTP access.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Store the uploaded avatar on the public storage disk.",
          code: `$path = $request->file('avatar')->{{blank}}('avatars', 'public');`,
          options: ["store", "save", "upload", "write"],
          correctAnswer: "store",
          explanation:
            "$request->file('avatar')->store('dir', 'disk') generates a unique hash filename and writes the file to the chosen disk.",
          xp: 25,
        },
      },
      {
        id: "m13l2",
        moduleId: "m13",
        title: "Validating File Uploads Securely",
        readTime: "7 min",
        xp: 45,
        summary:
          "Enforce strict MIME type sniffing, maximum file sizes in kilobytes, and image pixel dimension constraints to block malicious uploads.",
        flutterParallel: {
          concept: "Client-side image picker limits vs Laravel server-side magic byte validation",
          flutterFile: "lib/media/image_uploader.dart",
          laravelFile: "app/Http/Requests/UploadAvatarRequest.php",
          flutterCode: `// Flutter: Client file check
final file = await picker.pickImage(source: ImageSource.gallery);
final bytes = await file?.length() ?? 0;
if (bytes > 2 * 1024 * 1024) {
  showError('File must be smaller than 2MB');
}`,
          laravelCode: `public function rules(): array {
    return [
        'avatar' => [
            'required',
            'image', // Sniffs magic bytes (rejects shell script disguised as .jpg)
            'mimes:jpg,jpeg,png,webp',
            'max:2048', // Max 2048 KB (2MB)
            'dimensions:min_width=100,min_height=100,max_width=4000',
        ],
    ];
}`,
          explanation:
            "Attackers can bypass Flutter client checks using tools like curl to upload executable malware disguised with a .png extension. Laravel's 'image' rule ignores extensions and inspects the binary magic bytes using PHP's Fileinfo extension, guaranteeing the payload is a genuine raster graphic.",
        },
        content: [
          "The 'image' rule validates the file's binary stream (magic bytes), not just its filename extension.",
          "The 'max:2048' rule sets the limit in Kilobytes (2048 KB = 2 MB).",
          "The 'dimensions' rule enforces minimum and maximum pixel bounds to prevent image decompression bombs.",
          "The 'mimes:jpg,png,webp' rule verifies that the MIME type strictly matches safe, supported formats.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Validate that the uploaded photo is an authentic image under 2MB.",
          code: `'photo' => ['required', '{{blank}}', 'max:2048'],`,
          options: ["image", "file", "picture", "raster"],
          correctAnswer: "image",
          explanation:
            "The 'image' validation rule verifies that the file is an actual image (jpeg, png, bmp, gif, svg, or webp) based on its binary header bytes.",
          xp: 25,
        },
      },
      {
        id: "m13l3",
        moduleId: "m13",
        title: "Storage Disks, Visibility & Public URLs",
        readTime: "6 min",
        xp: 45,
        summary:
          "Configure Flysystem disks (local, public, S3), understand the storage:link symlink, and generate public CDN URLs for Flutter Image.network widgets.",
        flutterParallel: {
          concept: "Rendering server images in Flutter vs Laravel Storage::disk and storage:link",
          flutterFile: "lib/widgets/avatar_image.dart",
          laravelFile: "config/filesystems.php",
          flutterCode: `// Flutter: Displaying public image from API URL
Image.network(
  user.avatarUrl, // 'https://cdn.example.com/avatars/abc123.jpg'
  loadingBuilder: (ctx, child, progress) => ...,
  errorBuilder: (ctx, err, stack) => Icon(Icons.person),
)`,
          laravelCode: `// Store on 'public' disk (storage/app/public)
$path = $request->file('avatar')->store('avatars', 'public');

// Expose via symlink: php artisan storage:link
// Generates: '/storage/avatars/abc123.jpg'
$url = Storage::disk('public')->url($path);

// Seamlessly swap to S3 in .env without changing controller code:
// FILESYSTEM_DISK=s3`,
          explanation:
            "Web servers only serve files directly out of the public/ root folder. Laravel's php artisan storage:link creates a symbolic link from public/storage to storage/app/public. Laravel's Flysystem abstraction means changing FILESYSTEM_DISK=s3 in .env automatically redirects storage calls to Amazon S3 or Cloudflare R2 without changing a line of controller code.",
        },
        content: [
          "Laravel uses Flysystem to provide a single, unified API across Local, S3, MinIO, and Google Cloud Storage.",
          "The 'public' disk stores files meant for public web access in storage/app/public.",
          "php artisan storage:link connects storage/app/public to public/storage so the web server can serve files directly.",
          "Storage::disk('s3')->url($path) generates the fully-qualified CloudFront/S3 public CDN URL.",
        ],
        challenge: {
          type: "mcq",
          question: "Which Artisan command creates the symbolic link allowing public web browsers and mobile apps to access files stored on the 'public' disk?",
          options: [
            "php artisan storage:link",
            "php artisan files:publish",
            "php artisan disk:connect",
            "php artisan media:serve",
          ],
          correctAnswer: 0,
          explanation:
            "php artisan storage:link creates a filesystem symlink from public/storage to storage/app/public, enabling public HTTP access.",
          xp: 25,
        },
      },
      {
        id: "m13l4",
        moduleId: "m13",
        title: "Direct Cloud Uploads (Presigned S3 URLs)",
        readTime: "7 min",
        xp: 50,
        summary:
          "Offload multi-megabyte media uploads from your Laravel server: issue temporary presigned S3 URLs so Flutter streams directly to the cloud.",
        flutterParallel: {
          concept: "Direct S3 binary upload from Flutter vs Laravel presigned upload endpoint",
          flutterFile: "lib/media/direct_cloud_uploader.dart",
          laravelFile: "app/Http/Controllers/Api/MediaUploadController.php",
          flutterCode: `// 1. Ask backend for presigned URL:
final res = await dio.post('/api/media/presign', data: {'filename': 'video.mp4'});
final uploadUrl = res.data['upload_url'];

// 2. Upload directly to AWS S3 (zero server RAM used!):
await dio.put(uploadUrl, data: videoFileStream, options: Options(
  headers: {'Content-Type': 'video/mp4'},
));`,
          laravelCode: `public function presign(Request $request) {
    $path = 'uploads/' . Str::uuid() . '.' . $request->extension;

    // Presigned PUT URL valid for 15 minutes
    $url = Storage::disk('s3')->temporaryUploadUrl(
        $path,
        now()->addMinutes(15)
    );

    return response()->json(['upload_url' => $url, 'path' => $path]);
}`,
          explanation:
            "Routing 100MB camera video uploads through your PHP backend ties up PHP-FPM worker processes and bloats server memory. With Presigned URLs, Laravel generates a signed, time-limited cryptographic AWS URL. Flutter uploads the binary payload directly to S3's high-speed ingress, freeing your Laravel backend completely.",
        },
        content: [
          "Presigned URLs eliminate server memory bottlenecks by bypassing the Laravel backend for large binary media transfers.",
          "Storage::disk('s3')->temporaryUploadUrl($path, $expiration) generates a signed PUT destination with AWS signature v4.",
          "Flutter streams raw binary directly to S3 using an HTTP PUT request.",
          "Once S3 responds with 200 OK, Flutter informs the Laravel backend to attach the file key to the target database record.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Generate a temporary presigned cloud upload URL with a 15-minute expiration.",
          code: `$url = Storage::disk('s3')->{{blank}}($path, now()->addMinutes(15));`,
          options: ["temporaryUploadUrl", "signedUrl", "getUploadUrl", "presign"],
          correctAnswer: "temporaryUploadUrl",
          explanation:
            "temporaryUploadUrl() creates a signed URL that allows a client to perform a direct PUT upload to Amazon S3 within the specified timeframe.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m14",
    index: 14,
    trackId: "track-4",
    trackName: "Track 4: Advanced & Capstone",
    title: "Background Queues & FCM Push Notifications",
    tagline: "Never keep the mobile user waiting for a slow task",
    description:
      "Asynchronous jobs, Redis queue workers, retry backoff strategies, and Firebase Cloud Messaging (FCM).",
    color: "#34d399",
    icon: "bell",
    lessons: [
      {
        id: "m14l1",
        moduleId: "m14",
        title: "Offloading Heavy Work to Background Queues",
        readTime: "6 min",
        xp: 45,
        summary:
          "Don't make users stare at a spinner while your server generates PDFs or sends emails. Respond in 50ms and queue the work.",
        flutterParallel: {
          concept: "Fast 202 Accepted response vs synchronous blocking",
          flutterFile: "lib/checkout/checkout_service.dart",
          laravelFile: "app/Jobs/SendOrderConfirmationJob.php",
          flutterCode: `// Mobile expects instant response to display success screen:
final res = await dio.post('/orders');
// If server blocks sending emails, request times out!`,
          laravelCode: `// Controller: responds in 40ms
public function store(Request $request) {
    $order = Order::create($request->validated());
    
    // Dispatched to Redis queue in the background
    SendOrderConfirmationJob::dispatch($order);

    return response()->json($order, 201);
}`,
          explanation:
            "Slow tasks (emails, payment webhooks, image transcoding) must never run inside the HTTP request-response cycle. By dispatching a Job implementing ShouldQueue, Laravel serializes the job into Redis and returns a 201 immediately. A queue worker process handles it in the background.",
        },
        content: [
          "Jobs implementing ShouldQueue are automatically serialized into the queue driver (Redis, database, Amazon SQS).",
          "Queue workers run as persistent daemon processes via php artisan queue:work.",
          "Failed jobs: configure public $tries = 3; and public $backoff = [10, 60, 300]; for automatic exponential retry.",
          "Send mobile push notifications using Laravel's notification system targeting the FCM channel.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Mark a Laravel Job class to be processed asynchronously by queue workers.",
          code: `class ProcessVideoJob implements {{blank}} {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
}`,
          options: ["ShouldQueue", "AsyncJob", "QueueWorker", "BackgroundJob"],
          correctAnswer: "ShouldQueue",
          explanation:
            "Implementing the ShouldQueue interface tells Laravel to push the job to the queue rather than executing it synchronously.",
          xp: 25,
        },
      },
      {
        id: "m14l2",
        moduleId: "m14",
        title: "Job Lifecycle: Retries, Backoff & Failed Jobs",
        readTime: "7 min",
        xp: 45,
        summary:
          "Handle network hiccups and third-party API timeouts with automated exponential retry backoff and the failed_jobs database table.",
        flutterParallel: {
          concept: "Network reconnect retry loops in Flutter vs Laravel queue retry & backoff",
          flutterFile: "lib/core/retry_scheduler.dart",
          laravelFile: "app/Jobs/ChargeStripePaymentJob.php",
          flutterCode: `// Flutter: Client-side retry with exponential delay
Future<void> retryWithBackoff(Future<void> Function() fn) async {
  for (final delay in [1, 5, 20]) {
    try { return await fn(); }
    catch (_) { await Future.delayed(Duration(seconds: delay)); }
  }
}`,
          laravelCode: `class ChargePaymentJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Retry up to 3 times before giving up
    public int $tries = 3;

    // Exponential delay in seconds: 10s, 60s, 300s
    public array $backoff = [10, 60, 300];

    public function failed(?Throwable $exception): void {
        // Runs only after all 3 attempts fail
        Notification::route('slack', env('SLACK_WEBHOOK'))
            ->notify(new PaymentFailedAlert($this->order));
    }
}`,
          explanation:
            "Payment gateways, SMS services, and external APIs frequently suffer temporary blips. By specifying $tries and $backoff, Laravel automatically pauses and retries the job. If all attempts are exhausted, the job moves to the failed_jobs table and executes your failed() method for cleanup.",
        },
        content: [
          "public int $tries = 3 dictates how many times a worker attempts the job before classifying it as failed.",
          "public array $backoff = [10, 60, 300] implements exponential backoff to avoid hammering a recovering server.",
          "The failed(?Throwable $e) method runs on final failure: ideal for alerting engineers and marking records as failed.",
          "Artisan tools: php artisan queue:failed lists crashes; php artisan queue:retry all re-enqueues failed jobs after a fix.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Specify an exponential retry delay sequence of 10, 30, and 120 seconds.",
          code: `public array \${{blank}} = [10, 30, 120];`,
          options: ["backoff", "retryAfter", "delay", "pause"],
          correctAnswer: "backoff",
          explanation:
            "The $backoff property on a queued job specifies the number of seconds Laravel waits between consecutive retry attempts.",
          xp: 25,
        },
      },
      {
        id: "m14l3",
        moduleId: "m14",
        title: "Laravel Notifications & FCM Push",
        readTime: "7 min",
        xp: 50,
        summary:
          "Dispatch multi-channel alerts (database, mail, SMS, and Firebase Cloud Messaging) to Flutter devices from a single Notification class.",
        flutterParallel: {
          concept: "Receiving FCM pushes in Flutter vs Laravel Notification dispatching",
          flutterFile: "lib/notifications/fcm_handler.dart",
          laravelFile: "app/Notifications/OrderShippedNotification.php",
          flutterCode: `// Flutter: Listen for incoming push notification
FirebaseMessaging.onMessage.listen((RemoteMessage msg) {
  final title = msg.notification?.title;
  final orderId = msg.data['order_id'];
  showLocalNotification(title, 'Tap to view order #\${orderId}');
});`,
          laravelCode: `class OrderShippedNotification extends Notification implements ShouldQueue {
    public function via($notifiable): array {
        // Deliver to DB in-app feed AND send FCM mobile push
        return ['database', FcmChannel::class];
    }

    public function toFcm($notifiable): FcmMessage {
        return FcmMessage::create()
            ->setData(['order_id' => (string) $this->order->id])
            ->setNotification(AndroidNotification::create()
                ->setTitle('Order Shipped!')
                ->setBody('Your package is on its way.'));
    }
}

// Controller:
$user->notify(new OrderShippedNotification($order));`,
          explanation:
            "Instead of hardcoding Firebase API calls in random controllers, Laravel Notifications abstract message delivery. One notification class sends a database in-app notification, an email receipt, and an FCM push notification to Flutter, executing entirely in background queues.",
        },
        content: [
          "Laravel Notifications dispatch across database, mail, SMS (Twilio), and FCM from one unified class.",
          "The via($notifiable) method dynamically selects which delivery channels apply to the recipient.",
          "Mobile devices send their FCM device token to POST /api/device-token on app startup.",
          "$user->notify(new NotificationClass()) sends the notification; implementing ShouldQueue offloads transmission to workers.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Send a queued notification to the user model instance.",
          code: `$user->{{blank}}(new OrderShippedNotification($order));`,
          options: ["notify", "send", "alert", "dispatch"],
          correctAnswer: "notify",
          explanation:
            "The Notifiable trait on the User model provides the notify() method to dispatch notification instances across configured channels.",
          xp: 25,
        },
      },
      {
        id: "m14l4",
        moduleId: "m14",
        title: "Chained Jobs & Job Batching",
        readTime: "6 min",
        xp: 45,
        summary:
          "Orchestrate complex asynchronous workflows: run dependent jobs sequentially with Bus::chain() and track multi-job progress with Bus::batch().",
        flutterParallel: {
          concept: "Multi-step async progress bar vs Laravel Bus::batch and Bus::chain",
          flutterFile: "lib/media/upload_progress_indicator.dart",
          laravelFile: "app/Http/Controllers/VideoProcessingController.php",
          flutterCode: `// Flutter: Poll batch progress percentage
Timer.periodic(Duration(seconds: 2), (t) async {
  final res = await dio.get('/api/batches/\${batchId}');
  final progress = res.data['progress']; // 0 to 100%
  if (progress == 100) t.cancel();
});`,
          laravelCode: `// Sequential: Step 2 only runs if Step 1 succeeds
Bus::chain([
    new TranscodeVideoJob($video),
    new ExtractThumbnailsJob($video),
    new SendPushNotificationJob($user),
])->dispatch();

// Parallel batch: Runs 50 jobs concurrently with progress tracking
$batch = Bus::batch([
    new GenerateUserReportJob($userA),
    new GenerateUserReportJob($userB),
])->then(function (Batch $b) {
    // All jobs finished!
})->dispatch();`,
          explanation:
            "Real-world workflows often require multiple stages: you cannot extract a video thumbnail before transcoding finishes. Bus::chain() guarantees sequential execution and halts the chain if any job fails. Bus::batch() executes jobs concurrently and provides completion metrics for Flutter progress bars.",
        },
        content: [
          "Bus::chain([...]) runs jobs in strict sequential order; if one job fails, all subsequent jobs are canceled.",
          "Bus::batch([...]) executes independent jobs in parallel across multiple worker threads.",
          "$batch->progress() returns the percentage of completed jobs (0-100) for mobile progress bars.",
          "Callbacks: ->then(fn() => ...) fires on full success, while ->catch(fn() => ...) handles individual batch job errors.",
        ],
        challenge: {
          type: "mcq",
          question: "Which bus method should you use when Job B MUST wait for Job A to complete successfully first?",
          options: ["Bus::batch()", "Bus::chain()", "Bus::parallel()", "Bus::concurrent()"],
          correctAnswer: 1,
          explanation:
            "Bus::chain() executes an array of jobs sequentially, ensuring each step completes successfully before dispatching the next.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m15",
    index: 15,
    trackId: "track-4",
    trackName: "Track 4: Advanced & Capstone",
    title: "API Rate Limiting, Caching with Redis & CORS",
    tagline: "Protecting your API from abuse and traffic spikes",
    description:
      "RateLimiter throttling, HTTP 429 Too Many Requests, Redis response cache-aside, and CORS preflight policies.",
    color: "#34d399",
    icon: "activity",
    lessons: [
      {
        id: "m15l1",
        moduleId: "m15",
        title: "Rate Limiting & Redis Response Caching",
        readTime: "6 min",
        xp: 45,
        summary:
          "Throttling abuse with RateLimiter and caching database queries with Redis using the cache-aside pattern.",
        flutterParallel: {
          concept: "Handling HTTP 429 in Dio vs Server-side Rate Limiting",
          flutterFile: "lib/api/retry_interceptor.dart",
          laravelFile: "app/Providers/RouteServiceProvider.php",
          flutterCode: `// Flutter Dio handling 429 backoff
if (e.response?.statusCode == 429) {
  final retryAfter = int.parse(e.response?.headers.value('Retry-After') ?? '60');
  await Future.delayed(Duration(seconds: retryAfter));
}`,
          laravelCode: `// Server-side rate limiter configuration
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by(
        $request->user()?->id ?: $request->ip()
    );
});`,
          explanation:
            "Public APIs without rate limits get taken down by accidental while loops or DDoS bots. Laravel tracks request counts in Redis: exceeding the threshold returns HTTP 429 Too Many Requests with a Retry-After header. Cache-aside caches heavy endpoints in Redis for instant responses.",
        },
        content: [
          "RateLimiter::for('api') configures dynamic rate limits per user ID or client IP address.",
          "Cache-aside pattern: Cache::remember('posts:page:1', 300, fn() => Post::latest()->get()) returns cached data for 5 minutes.",
          "Cache invalidation: When a new post is created, call Cache::forget('posts:page:1') or use Cache Tags.",
          "CORS preflight: Configured in config/cors.php to specify which domains can access the API from web browsers.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Configure a 60-requests-per-minute limit in RateLimiter.",
          code: `RateLimiter::for('api', function (Request $request) {
    return Limit::{{blank}}(60)->by($request->ip());
});`,
          options: ["perMinute", "perSecond", "perHour", "throttle"],
          correctAnswer: "perMinute",
          explanation:
            "Limit::perMinute(60) permits up to 60 requests per 60-second sliding window per identifier.",
          xp: 25,
        },
      },
      {
        id: "m15l2",
        moduleId: "m15",
        title: "CORS Configuration for Flutter Web & Mobile",
        readTime: "6 min",
        xp: 45,
        summary:
          "Demystify Cross-Origin Resource Sharing (CORS), preflight OPTIONS requests, and eliminate 'XMLHttpRequest error' when running Flutter in the browser.",
        flutterParallel: {
          concept: "Flutter Web CORS preflight errors vs Laravel config/cors.php",
          flutterFile: "web/index.html",
          laravelFile: "config/cors.php",
          flutterCode: `// Flutter Web: Browser enforces Same-Origin Policy (SOP)
// Native iOS/Android apps ignore CORS, but Chrome blocks calls:
// Error: "ClientException: XMLHttpRequest error."
final res = await dio.get('https://api.myapp.com/posts');`,
          laravelCode: `// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // Permit local Flutter web development port & production domain
    'allowed_origins' => [
        'http://localhost:*',
        'https://app.laragram.com',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];`,
          explanation:
            "Native mobile apps (iOS & Android) communicate directly over raw TCP sockets and completely ignore CORS. However, if you compile Flutter for Web or macOS browser targets, Chrome intercepts every HTTP call. Browsers first send an HTTP OPTIONS 'preflight' probe: Laravel's HandleCors middleware must return proper Access-Control-Allow-Origin headers or the browser aborts the request.",
        },
        content: [
          "CORS is strictly a web browser security mechanism: native iOS and Android apps are unaffected.",
          "Preflight OPTIONS requests are sent automatically before requests with custom headers like Authorization: Bearer.",
          "Configure CORS in config/cors.php by specifying allowed_origins and allowed_methods.",
          "Never set allowed_origins => ['*'] in production when supports_credentials => true is required for cookies/sessions.",
        ],
        challenge: {
          type: "mcq",
          question: "Why does an API call that works perfectly on an Android emulator suddenly fail with 'XMLHttpRequest error' on Flutter Web?",
          options: [
            "Dart cannot compile HTTP requests on the web",
            "The browser enforces Cross-Origin Resource Sharing (CORS) and the Laravel backend rejected the preflight OPTIONS request",
            "Android emulators don't use TCP/IP",
            "Flutter Web only supports GraphQL",
          ],
          correctAnswer: 1,
          explanation:
            "Web browsers enforce Same-Origin Policy via CORS preflight checks, which will fail if the Laravel backend does not explicitly permit the origin domain in config/cors.php.",
          xp: 25,
        },
      },
      {
        id: "m15l3",
        moduleId: "m15",
        title: "Cache Invalidation Strategies & Cache Tags",
        readTime: "7 min",
        xp: 50,
        summary:
          "Prevent serving stale data: master the cache-aside pattern, atomic locks against cache stampedes, and Redis Cache Tags for instant multi-key flushing.",
        flutterParallel: {
          concept: "Local cache invalidation in Hive vs Redis Cache Tags in Laravel",
          flutterFile: "lib/repositories/post_repository.dart",
          laravelFile: "app/Services/PostCacheService.php",
          flutterCode: `// Flutter: Wipe local cache on mutation
Future<void> updatePost(Post p) async {
  await dio.put('/posts/\${p.id}', data: p.toJson());
  await hiveBox.delete('post_\${p.id}');
  await hiveBox.delete('feed_page_1'); // Invalidate stale feed!
}`,
          laravelCode: `// Group related keys with Cache Tags (Redis only)
public function getFeed(int $page) {
    return Cache::tags(['posts', 'feed'])->remember(
        "feed:page:{$page}",
        now()->addHours(6),
        fn() => Post::latest()->paginate(15)
    );
}

// When a new post is published, wipe all feed pages instantly:
public function onPostCreated() {
    Cache::tags('feed')->flush();
}`,
          explanation:
            "Caching without an invalidation plan leads to severe bugs: users create a post but cannot see it on their feed. With Redis Cache Tags, you can tag individual cache keys with multiple labels (e.g. ['posts', 'user:42', 'feed']). Calling Cache::tags('feed')->flush() purges thousands of cached pages in 1 millisecond.",
        },
        content: [
          "Cache-aside pattern: Cache::remember('key', $ttl, $closure) checks cache first and executes query only on miss.",
          "Cache Tags (supported by Redis and Memcached) allow tagging keys into logical groups.",
          "Cache::tags(['feed'])->flush() purges all keys associated with that tag in one atomic operation.",
          "Eloquent Model Observers (saved, deleted) automate cache purging whenever underlying records change.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Flush all cached records tagged under the 'products' label.",
          code: `Cache::tags(['products'])->{{blank}}();`,
          options: ["flush", "clear", "delete", "forget"],
          correctAnswer: "flush",
          explanation:
            "Cache::tags(['tag_name'])->flush() flushes all cache entries that were stored under the specified tag.",
          xp: 25,
        },
      },
      {
        id: "m15l4",
        moduleId: "m15",
        title: "HTTP Cache Headers & Conditional Requests (ETags)",
        readTime: "7 min",
        xp: 45,
        summary:
          "Save mobile battery and cellular data by leveraging ETag headers and 304 Not Modified conditional responses.",
        flutterParallel: {
          concept: "Dio Cache Interceptor and 304 Not Modified vs Laravel ETag generation",
          flutterFile: "lib/core/http_cache_interceptor.dart",
          laravelFile: "app/Http/Middleware/SetETagHeader.php",
          flutterCode: `// Flutter: Send cached ETag on repeat request
final etag = await cacheStore.getEtag('/profile');
final res = await dio.get('/profile', options: Options(
  headers: {'If-None-Match': etag},
));

if (res.statusCode == 304) {
  // 0 bytes payload downloaded! Use local disk cache
  return cachedProfile;
}`,
          laravelCode: `public function show(User $user, Request $request) {
    $etag = md5($user->updated_at->toISOString());

    if ($request->header('If-None-Match') === $etag) {
        // Return 304 Not Modified with ZERO response body:
        return response()->noContent(304);
    }

    return (new UserResource($user))
        ->response()
        ->header('ETag', $etag)
        ->header('Cache-Control', 'private, max-age=3600');
}`,
          explanation:
            "Mobile apps waste cellular bandwidth re-downloading unchanged profiles or catalogues. When Laravel includes an 'ETag' response header (a cryptographic hash of the content), Flutter caches it. On future calls, Flutter sends 'If-None-Match: <hash>'. If data hasn't changed, Laravel returns HTTP 304 with an empty body, saving battery and data.",
        },
        content: [
          "The ETag header provides an opaque hash fingerprint of a specific resource state.",
          "Clients send the stored ETag back inside the If-None-Match request header.",
          "HTTP 304 Not Modified contains no body (0 bytes), instructing Flutter to use its local cache.",
          "Cache-Control: private, max-age=3600 dictates client browser and mobile cache retention periods.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Which request header does the mobile client send with its cached ETag to perform a conditional request?",
          code: `headers: {'{{blank}}': cachedEtag}`,
          options: ["If-None-Match", "ETag", "If-Match", "If-Modified-Since"],
          correctAnswer: "If-None-Match",
          explanation:
            "Clients pass the ETag string inside the 'If-None-Match' header; if the server's current ETag matches, it returns 304 Not Modified.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m16",
    index: 16,
    trackId: "track-4",
    trackName: "Track 4: Advanced & Capstone",
    title: "Automated API Testing & MiniGram Capstone",
    tagline: "Deploy to production with 100% confidence",
    description:
      "Write automated Pest/PHPUnit feature tests, generate OpenAPI documentation, and review the MiniGram Capstone API.",
    color: "#34d399",
    icon: "terminal",
    lessons: [
      {
        id: "m16l1",
        moduleId: "m16",
        title: "Testing REST Endpoints with Pest / PHPUnit",
        readTime: "7 min",
        xp: 50,
        summary:
          "Write fast, automated tests asserting HTTP status codes, JSON shapes, and database mutations so your API never breaks unexpectedly.",
        flutterParallel: {
          concept: "Flutter testWidgets vs Laravel Feature Testing",
          flutterFile: "test/unit/api_test.dart",
          laravelFile: "tests/Feature/PostApiTest.php",
          flutterCode: `test('Fetch posts returns 200', () async {
  final res = await api.getPosts();
  expect(res.statusCode, equals(200));
  expect(res.data.isNotEmpty, isTrue);
});`,
          laravelCode: `it('creates a post and returns 201', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/v1/posts', [
            'title' => 'My New Post',
            'body' => 'Testing with Pest',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.title', 'My New Post');

    $this->assertDatabaseHas('posts', ['title' => 'My New Post']);
});`,
          explanation:
            "In Flutter, testing requires mocking HTTP responses. In Laravel feature tests, you execute real HTTP requests against an in-memory SQLite database using actingAs() to authenticate. The RefreshDatabase trait automatically resets the database after every test.",
        },
        content: [
          "The RefreshDatabase trait runs migrations once and wraps each test in a database transaction that rolls back automatically.",
          "actingAs($user, 'sanctum') authenticates the request as a specific user without needing real tokens.",
          "JSON assertions: assertJsonStructure(), assertJsonPath(), assertJsonValidationErrors().",
          "Automated tests run in continuous integration (GitHub Actions) before code is deployed to production.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Assert that the endpoint response status code was 201 Created.",
          code: `$response->{{blank}}(201);`,
          options: ["assertStatus", "assertCode", "assertResponse", "expectStatus"],
          correctAnswer: "assertStatus",
          explanation:
            "$response->assertStatus(201) checks that the HTTP response code matched 201.",
          xp: 25,
        },
      },
      {
        id: "m16l2",
        moduleId: "m16",
        title: "Database Testing & RefreshDatabase",
        readTime: "7 min",
        xp: 45,
        summary:
          "Test database state mutations with in-memory SQLite, automatic transaction rollbacks using RefreshDatabase, and Eloquent factories.",
        flutterParallel: {
          concept: "Mock repository tests in Flutter vs real database assertions in Laravel",
          flutterFile: "test/unit/post_repository_test.dart",
          laravelFile: "tests/Feature/PostDatabaseTest.php",
          flutterCode: `// Flutter: Testing with Mockito mocks
test('createPost updates local list', () async {
  when(mockApi.create(any)).thenAnswer((_) async => mockPost);
  await repo.addPost(mockPost);
  expect(repo.posts.length, 1);
});`,
          laravelCode: `uses(RefreshDatabase::class);

it('stores post in database and persists relationship', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/posts', [
            'title' => 'Database Test Post',
            'content' => 'Verified with assertDatabaseHas',
        ])
        ->assertStatus(201);

    // Verify row actually exists in SQLite test database:
    $this->assertDatabaseHas('posts', [
        'title' => 'Database Test Post',
        'user_id' => $user->id,
    ]);
});`,
          explanation:
            "Flutter unit tests mock network calls, meaning subtle SQL constraint errors or foreign key mismatches are never caught. Laravel tests run against a real SQLite database. The RefreshDatabase trait executes migrations once and wraps each test in a database transaction that rolls back instantly when the test finishes.",
        },
        content: [
          "The RefreshDatabase trait guarantees complete database isolation between tests without manual cleanup.",
          "Model Factories (e.g. User::factory()->create()) generate realistic, randomized mock rows in milliseconds.",
          "$this->assertDatabaseHas('table', ['col' => 'val']) asserts that matching records exist in the table.",
          "$this->assertDatabaseMissing('table', ['id' => $id]) verifies that soft-deletes or hard-deletes succeeded.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Assert that the database contains a matching user record.",
          code: `$this->{{blank}}('users', ['email' => 'alex@flutter.dev']);`,
          options: ["assertDatabaseHas", "assertRowExists", "assertModel", "assertDbRecord"],
          correctAnswer: "assertDatabaseHas",
          explanation:
            "assertDatabaseHas('table', [...]) verifies that a record matching the key-value attributes exists in the database.",
          xp: 25,
        },
      },
      {
        id: "m16l3",
        moduleId: "m16",
        title: "Testing Authentication & Permission Matrix",
        readTime: "7 min",
        xp: 50,
        summary:
          "Assert that guests receive 401s, unauthorized owners receive 403s, and scoped tokens only execute permitted abilities.",
        flutterParallel: {
          concept: "Testing route guards in Flutter vs testing Sanctum permission gates",
          flutterFile: "test/widget/auth_guard_test.dart",
          laravelFile: "tests/Feature/PostAuthorizationTest.php",
          flutterCode: `// Flutter: Assert unauthenticated redirect to Login
testWidgets('Guest navigating to /profile redirects to Login', (tester) async {
  await tester.pumpWidget(MyApp(initialRoute: '/profile'));
  expect(find.byType(LoginScreen), findsOneWidget);
});`,
          laravelCode: `it('blocks guest from creating post', function () {
    // Calling protected route without actingAs():
    $this->postJson('/api/posts', ['title' => 'Hack'])
        ->assertStatus(401);
});

it('blocks non-owner from updating post with 403 Forbidden', function () {
    $author = User::factory()->create();
    $post = Post::factory()->for($author)->create();
    $stranger = User::factory()->create();

    $this->actingAs($stranger, 'sanctum')
        ->putJson("/api/posts/{$post->id}", ['title' => 'Stolen'])
        ->assertStatus(403);
});`,
          explanation:
            "Security regressions happen when developers forget to add middleware or policy checks. Writing automated tests for guest state (expecting 401) and unauthorized user state (expecting 403) guarantees your API security rules remain inviolable across code refactors.",
        },
        content: [
          "Always test the unauthenticated state: assertStatus(401) ensures middleware is properly applied to routes.",
          "actingAs($user, 'sanctum') simulates an authenticated session without issuing real tokens.",
          "Sanctum::actingAs($user, ['posts:read']) allows testing specific token abilities and scope barriers.",
          "Testing authorization policies: assertStatus(403) confirms that users cannot mutate other users' entities.",
        ],
        challenge: {
          type: "mcq",
          question: "When a guest requests a protected Sanctum route without providing a token, what status code should your automated test assert?",
          options: ["200 OK", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
          correctAnswer: 1,
          explanation:
            "Unauthenticated requests lacking valid credentials must return HTTP 401 Unauthorized. (403 Forbidden is reserved for authenticated users lacking permission).",
          xp: 25,
        },
      },
      {
        id: "m16l4",
        moduleId: "m16",
        title: "OpenAPI / Swagger Documentation for Mobile Clients",
        readTime: "7 min",
        xp: 45,
        summary:
          "Generate interactive OpenAPI / Swagger specifications directly from your Laravel codebase and generate type-safe Dart models automatically.",
        flutterParallel: {
          concept: "Auto-generating Dart models from openapi.json vs manual model authoring",
          flutterFile: "pubspec.yaml",
          laravelFile: "config/scribe.php",
          flutterCode: `// flutter pub run swagger_parser:
// Reads http://api.myapp.com/docs/openapi.json
// Automatically creates PostModel.dart, UserModel.dart, and ApiClient.dart!
// 100% type-safe, zero manual JSON boilerplate!`,
          laravelCode: `/**
 * @group Posts
 * 
 * Endpoints for managing community feed articles.
 * 
 * @response 201 {
 *   "id": 42,
 *   "title": "Laravel for Mobile Devs",
 *   "created_at": "2026-10-01T08:00:00Z"
 * }
 */
public function store(StorePostRequest $request) { ... }`,
          explanation:
            "Writing API docs manually in Notion or Confluence leads to stale documentation and communication friction between backend and Flutter engineers. Tools like Scribe or L5-Swagger extract endpoint schemas, query parameters, and example responses straight from Laravel code, producing an OpenAPI JSON spec that Flutter tools use to auto-generate Dart models.",
        },
        content: [
          "OpenAPI (Swagger) defines a standardized, vendor-neutral machine-readable description of your REST API.",
          "Laravel Scribe inspects FormRequests, Routes, and docblocks to generate live interactive documentation.",
          "Dart generation: swagger_parser and openapi-generator transform openapi.json into typed Dart DTOs.",
          "Self-documenting code: Any time a FormRequest rule updates, API documentation updates synchronously on git commit.",
        ],
        challenge: {
          type: "fill-blank",
          question: "What open standard schema allows mobile clients to auto-generate typed models and HTTP clients?",
          code: `// Generate client from {{blank}} 3.0 specification file`,
          options: ["OpenAPI", "GraphQL", "Protobuf", "JSON-RPC"],
          correctAnswer: "OpenAPI",
          explanation:
            "OpenAPI (formerly Swagger) is the international standard specification for describing and generating clients for RESTful APIs.",
          xp: 25,
        },
      },
    ],
  },

  // ==============================================================================
  // TRACK 5: REAL-WORLD ARCHITECTURE & PATTERNS
  // ==============================================================================

  {
    id: "m17",
    index: 17,
    trackId: "track-5",
    trackName: "Track 5: Real-World Architecture & Patterns",
    title: "Service Layer & Repository Pattern",
    tagline: "Clean Architecture for scalable enterprise codebases",
    description:
      "Separate presentation logic from business domain and data persistence. Escape massive controller syndrome with Services, Repositories, and Actions.",
    color: "#fbbf24",
    icon: "layers",
    lessons: [
      {
        id: "m17l1",
        moduleId: "m17",
        title: "Fat Controllers = Fat Problems (Bloated BLoC vs Service Layer)",
        readTime: "7 min",
        xp: 45,
        summary:
          "Controllers handling validation, DB queries, emails, and payments become untestable monoliths. Move business logic into dedicated Service classes.",
        flutterParallel: {
          concept: "Bloated StatefulWidget vs Clean BLoC / Service Layer",
          flutterFile: "lib/features/orders/presentation/order_cubit.dart",
          laravelFile: "app/Services/OrderService.php",
          flutterCode: `// BLoC / Service delegates heavy logic away from UI:
class OrderCubit extends Cubit<OrderState> {
  final OrderService _orderService;
  OrderCubit(this._orderService) : super(OrderInitial());

  Future<void> checkout(Cart cart) async {
    emit(OrderLoading());
    try {
      final order = await _orderService.processOrder(cart);
      emit(OrderSuccess(order));
    } catch (e) {
      emit(OrderFailure(e.toString()));
    }
  }
}`,
          laravelCode: `// Thin controller delegates to injected OrderService:
class OrderController extends Controller {
  public function __construct(
    private OrderService \$orderService
  ) {}

  public function store(StoreOrderRequest \$request): JsonResponse {
    \$order = \$this->orderService->processCheckout(
      \$request->user(),
      \$request->validated()
    );
    return response()->json(\$order, 201);
  }
}`,
          explanation:
            "In Flutter, putting network requests and business calculations directly inside build() or setState() makes UI unmaintainable; you extract it into BLoCs or Services. Similarly in Laravel, Controllers should only orchestrate: parse HTTP input, call a domain Service, and return a JSON response.",
        },
        content: [
          "The Single Responsibility Principle (SRP) states that a class should have one, and only one, reason to change.",
          "A Controller's sole responsibility is HTTP orchestration: accepting requests, calling domain logic, and formatting responses.",
          "When order calculation, Stripe charges, and email dispatches are crammed into controller methods, testing without spinning up full HTTP requests becomes impossible.",
          "Service classes encapsulate domain business rules so they can be reused across HTTP controllers, Artisan CLI commands, and asynchronous queue jobs.",
        ],
        challenge: {
          type: "mcq",
          question:
            "What is the primary architectural danger of writing database queries, external payment calls, and emails directly inside a Laravel Controller?",
          options: [
            "It makes the business logic impossible to reuse in Artisan CLI commands or queue jobs without faking HTTP requests",
            "Laravel will refuse to compile controllers that have more than 50 lines of code",
            "It forces MySQL to downgrade to table-level locking",
            "It disables PHP 8 type hinting for all parameters",
          ],
          correctAnswer: 0,
          explanation:
            "When business logic is trapped inside a Controller, you cannot execute that same logic from an Artisan console command, a queue job, or a test without constructing mock HTTP requests.",
          xp: 25,
        },
      },
      {
        id: "m17l2",
        moduleId: "m17",
        title: "The Repository Pattern for Data Access",
        readTime: "8 min",
        xp: 50,
        summary:
          "Decouple domain business logic from Eloquent persistence with interfaces and Laravel's IoC container bindings.",
        flutterParallel: {
          concept: "Abstract Repository in Flutter Clean Architecture vs Laravel Repository Interface",
          flutterFile: "lib/features/posts/domain/repositories/post_repository.dart",
          laravelFile: "app/Repositories/Contracts/PostRepositoryInterface.php",
          flutterCode: `// Abstract repository interface in Dart:
abstract class PostRepository {
  Future<List<Post>> getPublished();
  Future<Post> findById(int id);
  Future<void> save(Post post);
}

// Implementation injected via GetIt / Provider:
class PostRepositoryImpl implements PostRepository {
  final ApiClient api;
  final CacheBox cache;
  PostRepositoryImpl(this.api, this.cache);
  ...
}`,
          laravelCode: `// Interface:
interface PostRepositoryInterface {
  public function getPublished(int \$limit = 20): Collection;
  public function findById(int \$id): ?Post;
}

// Eloquent implementation:
class EloquentPostRepository implements PostRepositoryInterface {
  public function getPublished(int \$limit = 20): Collection {
    return Post::where('is_published', true)->latest()->take(\$limit)->get();
  }
}`,
          explanation:
            "Clean Architecture in Flutter relies on abstract repository contracts so data sources (Remote API, Local Hive/Isar DB) can be swapped or mocked in unit tests. Laravel uses PHP interfaces bound to Eloquent implementations in AppServiceProvider, allowing seamless mocking in unit tests.",
        },
        content: [
          "The Repository pattern mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects.",
          "By depending on PostRepositoryInterface rather than the concrete Post Eloquent model directly, your services remain isolated from SQL or ORM specifics.",
          "Laravel's Service Container allows binding interfaces to implementations: $this->app->bind(PostRepositoryInterface::class, EloquentPostRepository::class);.",
          "In unit tests, you can swap the database repository with an in-memory array repository or a Mockery mock without touching a real database.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Where do you bind an interface to its concrete implementation in Laravel's Service Container?",
          code: `// In app/Providers/AppServiceProvider.php:\n\$this->app->{{blank}}(PostRepositoryInterface::class, EloquentPostRepository::class);`,
          options: ["bind", "singleton", "scoped", "alias"],
          correctAnswer: "bind",
          explanation:
            "$this->app->bind(Interface::class, Implementation::class) instructs the Laravel IoC container which concrete class to instantiate whenever the interface is type-hinted.",
          xp: 30,
        },
      },
      {
        id: "m17l3",
        moduleId: "m17",
        title: "Single-Responsibility Action Classes",
        readTime: "6 min",
        xp: 45,
        summary:
          "Structure complex workflows into single-method invokable Action classes matching Clean Architecture UseCases.",
        flutterParallel: {
          concept: "Dart UseCase / Interactor vs Laravel Invokable Action Class",
          flutterFile: "lib/features/auth/domain/usecases/register_user_usecase.dart",
          laravelFile: "app/Actions/CreateUserAction.php",
          flutterCode: `// Dart Clean Architecture UseCase:
class RegisterUserUseCase {
  final AuthRepository _repo;
  RegisterUserUseCase(this._repo);

  Future<User> call(RegisterParams params) async {
    // Verify unique email, hash token, persist
    return await _repo.register(params);
  }
}

// Invoked directly:
final user = await registerUser(params);`,
          laravelCode: `// PHP 8 Invokable Action Class:
class CreateUserAction {
  public function __invoke(UserData \$data): User {
    return DB::transaction(function () use (\$data) {
      \$user = User::create([
        'name' => \$data->name,
        'email' => \$data->email,
        'password' => Hash::make(\$data->password),
      ]);
      event(new UserRegistered(\$user));
      return \$user;
    });
  }
}`,
          explanation:
            "In Flutter domain-driven design, each business user story has its own UseCase with a single call() method. In modern Laravel, invokable Action classes implement __invoke() so they can be executed as $createUserAction($data). This keeps classes laser-focused on one job.",
        },
        content: [
          "Service classes can sometimes become 'god objects' if they accumulate dozens of disparate methods like createUser, banUser, resetPassword, exportUserCsv.",
          "Action classes solve this by following the Command/UseCase pattern: one class per business action with a single public __invoke() or execute() method.",
          "Actions are trivially testable, easily composed within other actions, and can be dispatched directly as queued background jobs.",
          "Because actions encapsulate database transactions (DB::transaction), data consistency is guaranteed across all callers.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Which PHP magic method allows an Action class instance to be invoked directly like a function (e.g. $action($data))?",
          options: ["__invoke()", "__call()", "__construct()", "__execute()"],
          correctAnswer: 0,
          explanation:
            "__invoke() is the PHP magic method that enables an object instance to be called directly as if it were a function.",
          xp: 25,
        },
      },
      {
        id: "m17l4",
        moduleId: "m17",
        title: "Data Transfer Objects (DTOs)",
        readTime: "7 min",
        xp: 45,
        summary:
          "Replace loose associative arrays with typed, immutable PHP 8 readonly DTOs for rock-solid type safety.",
        flutterParallel: {
          concept: "Freezed / Equatable Dart Params vs PHP 8.2 readonly DTOs",
          flutterFile: "lib/features/posts/data/models/create_post_dto.dart",
          laravelFile: "app/DTOs/CreatePostDTO.php",
          flutterCode: `// Immutable typed Dart model:
@freezed
class CreatePostDTO with _\$CreatePostDTO {
  const factory CreatePostDTO({
    required String title,
    required String content,
    @Default(false) bool isDraft,
    List<int>? tagIds,
  }) = _CreatePostDTO;
}`,
          laravelCode: `// PHP 8.2 readonly DTO:
readonly class CreatePostDTO {
  public function __construct(
    public string \$title,
    public string \$content,
    public bool \$isDraft = false,
    public array \$tagIds = [],
  ) {}

  public static function fromRequest(StorePostRequest \$request): self {
    return new self(
      title: \$request->string('title'),
      content: \$request->string('content'),
      isDraft: \$request->boolean('is_draft', false),
      tagIds: \$request->input('tag_ids', []),
    );
  }
}`,
          explanation:
            "Passing raw Map<String, dynamic> around a Flutter app loses compiler guarantees and auto-completion. In PHP, passing raw associative arrays ($request->all()) has the same flaw. Modern Laravel applications transform FormRequests into typed readonly DTOs.",
        },
        content: [
          "Associative arrays like ['title' => '...'] provide zero IDE autocomplete and no static analysis protection against typos like $data['titel'].",
          "PHP 8.2 introduced readonly class, where every property is immutable once assigned in constructor property promotion.",
          "Static factory methods like fromRequest(StorePostRequest $request) provide a clean translation layer between HTTP inputs and domain types.",
          "DTOs can be safely passed to actions, services, events, and background queue workers without unexpected mutation.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which PHP 8 keyword ensures all properties in a class are immutable after initial instantiation?",
          code: `{{blank}} class CreatePostDTO {\n  public function __construct(public string \$title) {}\n}`,
          options: ["readonly", "final", "immutable", "static"],
          correctAnswer: "readonly",
          explanation:
            "In PHP 8.2+, marking a class as readonly automatically marks all declared properties as readonly and prevents dynamic properties from being set.",
          xp: 30,
        },
      },
    ],
  },

  {
    id: "m18",
    index: 18,
    trackId: "track-5",
    trackName: "Track 5: Real-World Architecture & Patterns",
    title: "Events, Listeners & The Observer Pattern",
    tagline: "Decouple side-effects and asynchronous workflows",
    description:
      "Fire and forget domain events. Trigger emails, push notifications, and analytics without slowing down your HTTP response.",
    color: "#fbbf24",
    icon: "workflow",
    lessons: [
      {
        id: "m18l1",
        moduleId: "m18",
        title: "Eloquent Model Observers",
        readTime: "7 min",
        xp: 45,
        summary:
          "Hook into Eloquent lifecycle events (creating, created, updating, deleted) to automate slugs, audit trails, and UUIDs cleanly.",
        flutterParallel: {
          concept: "BlocObserver / ChangeNotifier vs Eloquent Model Observers",
          flutterFile: "lib/core/observers/app_bloc_observer.dart",
          laravelFile: "app/Observers/PostObserver.php",
          flutterCode: `// Flutter BlocObserver captures state transitions across all blocs:
class SimpleBlocObserver extends BlocObserver {
  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    print('Bloc: \${bloc.runtimeType}, Change: \$change');
  }
}`,
          laravelCode: `// Eloquent Observer hooks into model lifecycle:
class PostObserver {
  public function creating(Post \$post): void {
    if (empty(\$post->slug)) {
      \$post->slug = Str::slug(\$post->title);
    }
  }

  public function deleted(Post \$post): void {
    Log::info("Post deleted", ['id' => \$post->id]);
  }
}`,
          explanation:
            "In Flutter, BlocObserver intercepts lifecycle changes across the entire app state. In Laravel, Model Observers cleanly extract side effects out of the model class, firing automatically whenever a record is created, updated, or deleted.",
        },
        content: [
          "Eloquent fires several lifecycle events: retrieved, creating, created, updating, updated, saving, saved, deleting, deleted, restoring, restored.",
          "The -ing events (e.g. creating) fire before the database transaction commits, allowing you to modify model attributes or return false to abort the save.",
          "The -ed events (e.g. created) fire after the record is persisted, ideal for clearing caches or dispatching external notifications.",
          "In Laravel 11, observers can be registered using PHP 8 attributes: #[ObservedBy([PostObserver::class])] class Post extends Model { ... }.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Which observer lifecycle event should you use if you want to generate and assign a slug to an Eloquent model BEFORE it gets inserted into MySQL?",
          options: ["creating", "created", "saved", "retrieved"],
          correctAnswer: 0,
          explanation:
            "creating fires before the SQL INSERT statement executes, allowing you to set or modify attributes directly on the model instance.",
          xp: 25,
        },
      },
      {
        id: "m18l2",
        moduleId: "m18",
        title: "Events & Listeners: Decoupling Side-Effects",
        readTime: "7 min",
        xp: 50,
        summary:
          "Decouple core business transactions from secondary side-effects using Laravel's publish-subscribe EventDispatcher.",
        flutterParallel: {
          concept: "EventBus / StreamController in Flutter vs Laravel Events & Listeners",
          flutterFile: "lib/core/events/event_bus.dart",
          laravelFile: "app/Events/OrderPlaced.php",
          flutterCode: `// Dart EventBus / Stream-based pub-sub:
final eventBus = EventBus();

// Publish:
eventBus.fire(OrderPlacedEvent(order));

// Subscribe in separate services:
eventBus.on<OrderPlacedEvent>().listen((event) {
  notificationService.sendReceipt(event.order);
  analyticsService.trackPurchase(event.order);
});`,
          laravelCode: `// 1. Dispatch event in Controller/Service:
OrderPlaced::dispatch(\$order);

// 2. Independent listeners in app/Listeners/:
class SendOrderReceipt {
  public function handle(OrderPlaced \$event): void {
    Mail::to(\$event->order->user)->send(new OrderReceiptMail(\$event->order));
  }
}

class UpdateInventoryStock {
  public function handle(OrderPlaced \$event): void {
    InventoryService::decrement(\$event->order->items);
  }
}`,
          explanation:
            "In Flutter, an EventBus lets disparate widgets and services react to actions without direct coupling. In Laravel, firing an Event decouples the checkout process from sending emails, alerting Slack, and notifying inventory.",
        },
        content: [
          "The Publish-Subscribe pattern ensures the class executing the primary action doesn't know or care about who is listening.",
          "An Event class is a simple data container containing only the relevant models or DTOs (e.g. public Order $order).",
          "Multiple Listeners can subscribe to the same event. Laravel executes each listener's handle(Event $event) method.",
          "Event discovery in Laravel automatically binds listeners located in app/Listeners based on the type-hint in their handle() method.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "What static method on an Event class dispatches the event through Laravel's EventDispatcher?",
          code: `// In OrderService.php:\nOrderPlaced::{{blank}}(\$order);`,
          options: ["dispatch", "fire", "trigger", "emit"],
          correctAnswer: "dispatch",
          explanation:
            "EventName::dispatch(...$params) is the standard Laravel helper that instantiates and fires the event to all registered listeners.",
          xp: 30,
        },
      },
      {
        id: "m18l3",
        moduleId: "m18",
        title: "Asynchronous Queued Event Listeners",
        readTime: "7 min",
        xp: 50,
        summary:
          "Offload slow side-effects to background Redis queues by adding implements ShouldQueue to any Listener.",
        flutterParallel: {
          concept: "Dart Isolate / background compute() vs Laravel ShouldQueue Listeners",
          flutterFile: "lib/core/services/background_sync.dart",
          laravelFile: "app/Listeners/SendPushNotification.php",
          flutterCode: `// Dart background isolate for non-blocking UI:
Future<void> runHeavyTaskInBackground(Order order) async {
  // compute runs in a separate thread so UI does not stutter
  await compute(generatePdfReceipt, order.toJson());
}`,
          laravelCode: `// Just implement ShouldQueue to make it run in background:
class SendPushNotification implements ShouldQueue {
  use InteractsWithQueue;

  public function handle(OrderPlaced \$event): void {
    // Runs on background Redis queue worker!
    // The mobile Flutter client gets its HTTP 201 immediately!
    FcmService::send(
      \$event->order->user->fcm_token,
      'Your order has been placed successfully!'
    );
  }
}`,
          explanation:
            "In Flutter, running CPU-heavy or slow operations on the main thread causes UI frame drops (jank), so you spawn background isolates. On the backend, sending FCM push notifications or external webhook calls in the HTTP request blocks the Flutter user from getting a response. implements ShouldQueue serializes the listener to Redis and returns the response in ~15ms.",
        },
        content: [
          "Any Listener implementing the Illuminate\\Contracts\\Queue\\ShouldQueue interface is automatically pushed to the queue instead of running synchronously.",
          "This guarantees HTTP latency stays below 50ms regardless of whether 10 emails or external webhooks need to be triggered.",
          "Queued listeners support retry attempts (public $tries = 3;), timeouts, and custom queue channels (e.g. public $queue = 'notifications';).",
          "Failed queued listeners automatically write to the failed_jobs database table and can be retried via php artisan queue:retry.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Which interface must a Laravel Listener implement to instruct Laravel to execute its handle() method asynchronously via background queue workers?",
          options: ["ShouldQueue", "IsAsync", "QueueableInterface", "BackgroundWorker"],
          correctAnswer: 0,
          explanation:
            "Implementing Illuminate\\Contracts\\Queue\\ShouldQueue marks the listener for queue serialization without needing any changes to the dispatching code.",
          xp: 25,
        },
      },
      {
        id: "m18l4",
        moduleId: "m18",
        title: "Event Sourcing & CQRS Mental Models",
        readTime: "8 min",
        xp: 50,
        summary:
          "Understand Event Sourcing and Command Query Responsibility Segregation (CQRS) for high-audit fintech and gaming backends.",
        flutterParallel: {
          concept: "Redux State Machine / Replay vs Event Sourcing",
          flutterFile: "lib/features/wallet/state/wallet_state.dart",
          laravelFile: "app/Events/WalletCredited.php",
          flutterCode: `// Redux / HydratedBloc replays actions to restore balance:
int reduceWallet(int currentBalance, dynamic action) {
  if (action is DepositAction) return currentBalance + action.amount;
  if (action is WithdrawAction) return currentBalance - action.amount;
  return currentBalance;
}`,
          laravelCode: `// In Event Sourcing, state is reconstructed from past events:
class BankAccount {
  public int \$balance = 0;

  public function applyMoneyDeposited(MoneyDeposited \$event): void {
    \$this->balance += \$event->amount;
  }

  public function applyMoneyWithdrawn(MoneyWithdrawn \$event): void {
    \$this->balance -= \$event->amount;
  }
}`,
          explanation:
            "In standard CRUD, a user's wallet balance is stored as a mutable integer column in MySQL that gets updated. In Event Sourcing, the database stores an immutable append-only ledger of events (Deposited, Withdrawn, Transferred). Current balance is computed by projecting that event stream, guaranteeing a tamper-proof audit trail.",
        },
        content: [
          "Traditional CRUD updates mutate state in place: UPDATE accounts SET balance = balance + 100 WHERE id = 1 destroys past state history.",
          "Event Sourcing stores domain events in an immutable, append-only event store: AccountCreated, FundsDeposited, CardFrozen.",
          "CQRS (Command Query Responsibility Segregation) separates write commands (e.g., DepositFundsCommand) from read queries (e.g., optimized read tables or Elasticsearch indices).",
          "Packages like spatie/laravel-event-sourcing bring aggregate roots, projections, and stored event replays to Laravel.",
        ],
        challenge: {
          type: "mcq",
          question:
            "What is the primary difference between a traditional CRUD database table and an Event Sourced event store?",
          options: [
            "Event Sourcing uses an immutable append-only ledger of events rather than overwriting mutable rows in place",
            "Event Sourcing only works with NoSQL databases and cannot run on PostgreSQL or MySQL",
            "Event Sourcing requires Flutter mobile apps to run a local PHP runtime",
            "Event Sourcing eliminates the need for user authentication",
          ],
          correctAnswer: 0,
          explanation:
            "Event Sourcing models state as an append-only sequence of immutable events, allowing you to reconstruct state at any point in history and maintain a full audit trail.",
          xp: 30,
        },
      },
    ],
  },

  {
    id: "m19",
    index: 19,
    trackId: "track-5",
    trackName: "Track 5: Real-World Architecture & Patterns",
    title: "Laravel Policies & Authorization (Gates & RBAC)",
    tagline: "Fine-grained permissions and role-based access control",
    description:
      "Authentication proves who you are; Authorization controls what you can do. Master Gates, Model Policies, and Spatie RBAC.",
    color: "#fbbf24",
    icon: "lock",
    lessons: [
      {
        id: "m19l1",
        moduleId: "m19",
        title: "Authentication vs Authorization (401 vs 403)",
        readTime: "7 min",
        xp: 45,
        summary:
          "Understand the fundamental boundary between identifying a user (401 Unauthorized) and verifying their permissions (403 Forbidden).",
        flutterParallel: {
          concept: "AuthGuard vs RoleGuard in Flutter Navigation",
          flutterFile: "lib/core/router/route_guards.dart",
          laravelFile: "app/Providers/AuthServiceProvider.php",
          flutterCode: `// Flutter Route Guard checking auth vs permission:
String? guard(BuildContext context, GoRouterState state) {
  final user = authNotifier.currentUser;
  // 1. Not logged in -> 401 equivalent:
  if (user == null) return '/login';
  // 2. Logged in but not an admin -> 403 equivalent:
  if (state.matchedLocation.startsWith('/admin') && !user.isAdmin) {
    return '/forbidden';
  }
  return null;
}`,
          laravelCode: `// Gate definition in Laravel:
Gate::define('access-admin-panel', function (User \$user) {
  return \$user->is_admin;
});

// In Controller:
public function index() {
  // If not admin, aborts with HTTP 403 Forbidden!
  Gate::authorize('access-admin-panel');
  return AdminResource::collection(User::all());
}`,
          explanation:
            "HTTP 401 means 'You are not logged in; please authenticate'. HTTP 403 means 'We know who you are, but you lack permission to perform this action'. Laravel Gates let you define closure-based authorization checks easily.",
        },
        content: [
          "Authentication asks: 'Who are you?' (resolved by Sanctum, Session cookies, or Bearer tokens).",
          "Authorization asks: 'Are you permitted to do this specific action to this specific resource?'",
          "Laravel provides two primary mechanisms for authorization: Gates (closure-based) and Policies (class-based).",
          "Failing a Gate or Policy check automatically throws an AuthorizationException, which renders as an HTTP 403 Forbidden JSON response for API requests.",
        ],
        challenge: {
          type: "mcq",
          question:
            "When an authenticated user attempts to delete a blog post created by another user, which HTTP status code must the API return?",
          options: ["403 Forbidden", "401 Unauthorized", "404 Not Found", "422 Unprocessable Content"],
          correctAnswer: 0,
          explanation:
            "HTTP 403 Forbidden is used when the server understands who the user is, but refuses to authorize the operation due to insufficient permissions.",
          xp: 25,
        },
      },
      {
        id: "m19l2",
        moduleId: "m19",
        title: "Writing Model Policy Classes",
        readTime: "8 min",
        xp: 50,
        summary:
          "Organize authorization logic around Eloquent models using generated Policy classes and $this->authorize().",
        flutterParallel: {
          concept: "Conditional UI rendering in Flutter vs Server Policy Enforcement",
          flutterFile: "lib/features/posts/presentation/widgets/post_card.dart",
          laravelFile: "app/Policies/PostPolicy.php",
          flutterCode: `// Mobile UI conditionally displays edit button:
if (currentUser.id == post.authorId || currentUser.isAdmin)
  IconButton(
    icon: const Icon(Icons.edit),
    onPressed: () => context.push('/posts/\${post.id}/edit'),
  ),`,
          laravelCode: `// Server Policy enforces absolute security:
class PostPolicy {
  public function update(User \$user, Post \$post): bool {
    return \$user->id === \$post->user_id || \$user->is_admin;
  }

  public function delete(User \$user, Post \$post): bool {
    return \$user->id === \$post->user_id;
  }
}

// Controller usage:
public function update(UpdatePostRequest \$request, Post \$post) {
  \$this->authorize('update', \$post);
  \$post->update(\$request->validated());
  return new PostResource(\$post);
}`,
          explanation:
            "Never rely solely on Flutter UI hiding the 'Delete' button. A malicious client can send a raw PUT or DELETE request using curl or Postman. Laravel Policies enforce business authorization rules on the server.",
        },
        content: [
          "Policies are classes that organize authorization logic around a specific model. Create them with php artisan make:policy PostPolicy --model=Post.",
          "Laravel automatically detects policies matching the naming convention app/Policies/{Model}Policy.php.",
          "The first argument in policy methods is always the authenticated User model, injected automatically by Laravel.",
          "You can authorize requests in controllers via $this->authorize('update', $post); or inside FormRequests using the authorize() method.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "What controller method evaluates a policy method against a model instance and aborts with a 403 if unauthorized?",
          code: `public function update(Request \$request, Post \$post) {\n  \$this->{{blank}}('update', \$post);\n  \$post->update(\$request->all());\n}`,
          options: ["authorize", "can", "validate", "check"],
          correctAnswer: "authorize",
          explanation:
            "$this->authorize('update', $post) verifies the policy and automatically throws an AuthorizationException (HTTP 403) if it returns false.",
          xp: 30,
        },
      },
      {
        id: "m19l3",
        moduleId: "m19",
        title: "Role-Based Access Control (RBAC) with Spatie Permissions",
        readTime: "8 min",
        xp: 50,
        summary:
          "Implement industry-standard roles and granular permissions using spatie/laravel-permission.",
        flutterParallel: {
          concept: "Role-Based Access in Flutter State vs Backend Spatie RBAC",
          flutterFile: "lib/features/profile/domain/entities/user.dart",
          laravelFile: "database/seeders/RolesAndPermissionsSeeder.php",
          flutterCode: `// Flutter user checking permissions:
if (user.hasPermission('publish-articles')) {
  showPublishDialog();
} else {
  showUpgradePrompt();
}
`,
          laravelCode: `// Spatie Permissions setup:
\$editor = Role::create(['name' => 'editor']);
\$publish = Permission::create(['name' => 'publish-articles']);
\$editor->givePermissionTo(\$publish);

// User assignment:
\$user->assignRole('editor');

// Protection via middleware in routes/api.php:
Route::post('/articles/{id}/publish', [ArticleController::class, 'publish'])
  ->middleware('permission:publish-articles');`,
          explanation:
            "Hardcoding $user->is_admin does not scale when an app grows to require Managers, Editors, Moderators, and Support Agents. The spatie/laravel-permission package provides roles and granular permissions persisted in database tables.",
        },
        content: [
          "Role-Based Access Control (RBAC) maps permissions to roles, and assigns roles to users.",
          "Best practice: Always check for specific permissions ($user->can('edit-articles')) rather than role names ($user->hasRole('editor')) in business code.",
          "This allows roles to be modified or created dynamically from an admin dashboard without rewriting controller code.",
          "The Spatie package automatically caches all user roles and permissions in Redis or Memcached, keeping database overhead near zero.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Why is it considered an architectural best practice to check permissions (e.g. $user->can('publish-posts')) rather than role names (e.g. $user->hasRole('editor')) in controller code?",
          options: [
            "Permissions can be reassigned to different or new roles dynamically via database without changing code",
            "Role names are automatically converted to uppercase by PHP, causing string comparison bugs",
            "Checking role names disables database foreign key constraints",
            "Role checks only work when using GraphQL, not REST",
          ],
          correctAnswer: 0,
          explanation:
            "Decoupling code from role names means you can create a new role (e.g. 'Senior Journalist') and grant it existing permissions without modifying a single line of backend controller code.",
          xp: 25,
        },
      },
      {
        id: "m19l4",
        moduleId: "m19",
        title: "Combining Sanctum Token Abilities with Model Policies",
        readTime: "7 min",
        xp: 45,
        summary:
          "Secure mobile API tokens by binding granular abilities (['posts:read', 'orders:create']) with server-side authorization.",
        flutterParallel: {
          concept: "OAuth Token Scopes in Flutter Dio vs Sanctum Token Abilities",
          flutterFile: "lib/core/network/auth_interceptor.dart",
          laravelFile: "routes/api.php",
          flutterCode: `// Mobile Flutter client passing scoped bearer token:
dio.options.headers['Authorization'] = 'Bearer 3|m8e2V...';
// Mobile widget token configured strictly for read operations`,
          laravelCode: `// 1. Issue token with restricted abilities:
\$token = \$user->createToken('widget-token', ['posts:read'])->plainTextToken;

// 2. Protect route with ability middleware:
Route::delete('/posts/{id}', [PostController::class, 'destroy'])
  ->middleware(['auth:sanctum', 'ability:posts:delete']);

// 3. Or verify in Controller/Policy:
if (!\$request->user()->tokenCan('posts:delete')) {
  abort(403, 'Token lacks delete ability');
}`,
          explanation:
            "If a user has an admin role, but generates a token for a third-party webhook or a lightweight Flutter Home Screen widget, that token should NOT have full delete permissions. Sanctum token abilities limit what a specific API token is permitted to do.",
        },
        content: [
          "Laravel Sanctum allows tokens to be issued with custom abilities: $user->createToken('mobile', ['posts:create', 'posts:read']).",
          "The tokenCan(string $ability) method checks whether the active token possesses the required permission.",
          "The ability middleware (middleware('ability:posts:create')) requires the token to have all listed abilities.",
          "A complete authorization check validates BOTH: (1) Does the user have the permission? AND (2) Does this specific token grant this ability?",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which method on the authenticated user model checks whether the active Sanctum personal access token has a specific ability?",
          code: `if (!\$request->user()->{{blank}}('orders:refund')) {\n  abort(403, 'Unauthorized token');\n}`,
          options: ["tokenCan", "hasAbility", "canToken", "tokenHas"],
          correctAnswer: "tokenCan",
          explanation:
            "$user->tokenCan('ability') inspects the abilities array stored in the personal_access_tokens table for the current request.",
          xp: 30,
        },
      },
    ],
  },

  {
    id: "m20",
    index: 20,
    trackId: "track-5",
    trackName: "Track 5: Real-World Architecture & Patterns",
    title: "Global Error Handling, Logging & Sentry",
    tagline: "Production resilience, structured observability, and zero silent failures",
    description:
      "Tame unhandled exceptions, transform stack traces into predictable JSON API envelopes, configure Monolog channels, and track crashes in Sentry.",
    color: "#fbbf24",
    icon: "bug",
    lessons: [
      {
        id: "m20l1",
        moduleId: "m20",
        title: "Domain-Specific Custom Exception Classes",
        readTime: "7 min",
        xp: 45,
        summary:
          "Replace generic exceptions with semantic domain exceptions that encapsulate HTTP status codes and API error envelopes.",
        flutterParallel: {
          concept: "Custom Exception classes in Dart vs Self-Rendering Exceptions in Laravel",
          flutterFile: "lib/core/errors/exceptions.dart",
          laravelFile: "app/Exceptions/InsufficientFundsException.php",
          flutterCode: `// Custom Dart domain exceptions:
abstract class AppException implements Exception {
  final String message;
  final String code;
  AppException(this.message, this.code);
}

class InsufficientFundsException extends AppException {
  InsufficientFundsException([String? msg])
      : super(msg ?? 'Insufficient account balance', 'INSUFFICIENT_FUNDS');
}`,
          laravelCode: `// Self-rendering domain exception in Laravel:
class InsufficientFundsException extends Exception {
  public function __construct(
    public int \$available,
    public int \$required
  ) {
    parent::__construct("Required \${required} cents, but only \${available} available.");
  }

  public function render(Request \$request): JsonResponse {
    return response()->json([
      'error_code' => 'INSUFFICIENT_FUNDS',
      'message' => \$this->getMessage(),
      'details' => ['available' => \$this->available, 'required' => \$this->required],
    ], 422);
  }
}`,
          explanation:
            "Throwing generic \\Exception('Something went wrong') leads to messy 500 Internal Server Error responses. In modern Laravel, domain exceptions implement their own render($request) method, allowing domain classes to dictate the exact JSON payload and HTTP status code returned to Flutter.",
        },
        content: [
          "Custom domain exceptions provide clarity: throw new ProductOutOfStockException($product) explains the business rule failure immediately.",
          "Laravel recognizes the render(Request $request) method inside an exception class, automatically converting it to a response when thrown.",
          "Laravel also recognizes report() on custom exceptions, allowing you to log or ignore specific domain errors before sending to Sentry.",
          "This prevents business rule rejections (e.g. wrong coupon code) from polluting error tracking logs with false-positive 500 alerts.",
        ],
        challenge: {
          type: "mcq",
          question:
            "What method can you define on a custom PHP Exception class to instruct Laravel how to transform that exception into an HTTP JSON response?",
          options: ["render()", "toResponse()", "toJson()", "handle()"],
          correctAnswer: 0,
          explanation:
            "Laravel checks for a render($request) method on any caught exception and uses its return value as the HTTP response.",
          xp: 25,
        },
      },
      {
        id: "m20l2",
        moduleId: "m20",
        title: "Laravel 11 Global Exception Handler (bootstrap/app.php)",
        readTime: "8 min",
        xp: 50,
        summary:
          "Configure global exception interception in Laravel 11 using withExceptions() to ensure API requests never receive raw HTML.",
        flutterParallel: {
          concept: "Global Flutter onError Hook vs Laravel withExceptions",
          flutterFile: "lib/main.dart",
          laravelFile: "bootstrap/app.php",
          flutterCode: `// Catch-all Flutter global error boundaries:
void main() {
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    Sentry.captureException(details.exception, stackTrace: details.stack);
  };
  PlatformDispatcher.instance.onError = (error, stack) {
    Sentry.captureException(error, stackTrace: stack);
    return true;
  };
  runApp(const MyApp());
}`,
          laravelCode: `// In bootstrap/app.php (Laravel 11+):
return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(api: __DIR__.'/../routes/api.php')
  ->withExceptions(function (Exceptions \$exceptions) {
    // Intercept ModelNotFoundException for API routes:
    \$exceptions->render(function (NotFoundHttpException \$e, Request \$request) {
      if (\$request->is('api/*')) {
        return response()->json([
          'error' => 'RESOURCE_NOT_FOUND',
          'message' => 'The requested endpoint or record does not exist.'
        ], 404);
      }
    });
  })->create();`,
          explanation:
            "Nothing breaks a Flutter mobile app faster than receiving a 500 HTML stack trace page when Dio is expecting a JSON response (FormatException: Unexpected character). Configuring withExceptions ensures all uncaught exceptions return a standardized JSON error format.",
        },
        content: [
          "In Laravel 11, the legacy app/Exceptions/Handler.php class was replaced by the clean withExceptions() closure in bootstrap/app.php.",
          "The $exceptions->render() closure allows you to intercept any exception type (e.g. NotFoundHttpException, AuthenticationException) and return a custom JSON envelope.",
          "Always guard with if ($request->is('api/*') || $request->wantsJson()) so web routes (if any) retain their standard error pages.",
          "The $exceptions->dontReport([CustomExpectedException::class]) method prevents benign business exceptions from flooding log files.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which file in Laravel 11 configures the global exception handler and routing via fluid application builders?",
          code: `// In {{blank}}/app.php:\n->withExceptions(function (Exceptions \$exceptions) { ... })`,
          options: ["bootstrap", "config", "app", "routes"],
          correctAnswer: "bootstrap",
          explanation:
            "In Laravel 11, application bootstrapping, routing, middleware, and exception handling are centralized in bootstrap/app.php.",
          xp: 30,
        },
      },
      {
        id: "m20l3",
        moduleId: "m20",
        title: "Structured Contextual Logging with Monolog",
        readTime: "7 min",
        xp: 45,
        summary:
          "Implement searchable, structured JSON logging with Monolog channels to monitor transactions and debug production anomalies.",
        flutterParallel: {
          concept: "Talker / Logger structured logging in Flutter vs Laravel Log channels",
          flutterFile: "lib/core/utils/app_logger.dart",
          laravelFile: "config/logging.php",
          flutterCode: `// Structured logging in Flutter:
talker.warning('Payment retry initiated', {
  'attempt': 2,
  'cartId': 'cart_123',
  'userId': 42,
});`,
          laravelCode: `// Structured logging with context in Laravel:
Log::warning('Payment retry initiated', [
  'attempt' => 2,
  'cart_id' => \$cart->id,
  'user_id' => auth()->id(),
  'ip' => request()->ip(),
]);

// Urgent alerts straight to Slack / Discord webhook channel:
Log::channel('slack')->critical('Stripe webhook signature failed!', [
  'header' => request()->header('Stripe-Signature'),
]);`,
          explanation:
            "String concatenation logging like Log::info('User ' . $id . ' did order') is unsearchable in modern log tools like Datadog, AWS CloudWatch, or Grafana Loki. Passing an associative array as the second argument produces structured JSON logs with queryable attributes.",
        },
        content: [
          "Laravel uses Monolog under the hood, supporting multiple channels: single, daily, slack, syslog, errorlog, and stack.",
          "Daily logs automatically rotate log files (storage/logs/laravel-2026-10-01.log) and retain a configurable number of days.",
          "Log context: Log::withContext(['request_id' => Str::uuid()->toString()]) attaches metadata to every subsequent log entry in that request cycle.",
          "Channel routing: Direct critical errors to Slack or PagerDuty while sending standard debug info to daily files.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Why is passing context as an associative array to Log::info($msg, $context) superior to string concatenation?",
          options: [
            "It enables log aggregators (Datadog, CloudWatch) to parse, filter, and index fields as structured JSON",
            "It automatically encrypts the message using AES-256 before writing to disk",
            "It prevents MySQL queries from timing out during high load",
            "It translates English log messages to the user's localized language",
          ],
          correctAnswer: 0,
          explanation:
            "Passing structured context allows log processors to ingest entries as key-value JSON, making it effortless to filter by user_id, order_id, or status_code.",
          xp: 25,
        },
      },
      {
        id: "m20l4",
        moduleId: "m20",
        title: "Production Monitoring with Sentry & Distributed Tracing",
        readTime: "8 min",
        xp: 50,
        summary:
          "Integrate real-time crash reporting and distributed tracing across your Flutter client and Laravel API using Sentry.",
        flutterParallel: {
          concept: "Sentry Flutter SDK vs Sentry Laravel SDK Distributed Tracing",
          flutterFile: "lib/main.dart",
          laravelFile: "config/sentry.php",
          flutterCode: `// Flutter client sends traceparent header on HTTP calls:
await SentryFlutter.init(
  (options) => options.dsn = 'https://abc@sentry.io/123',
  appRunner: () => runApp(const MyApp()),
);
// Dio automatically propagates Sentry distributed tracing headers!`,
          laravelCode: `// Laravel automatically links backend spans to mobile trace:
// composer require sentry/sentry-laravel
// SENTRY_LARAVEL_DSN=https://xyz@sentry.io/456 in .env

// Any uncaught 500 is captured with:
// 1. Full stack trace & PHP line numbers
// 2. Exact SQL queries executed before crash
// 3. Authenticated user ID & request headers
// 4. Flutter client app version and device OS`,
          explanation:
            "When a Flutter user encounters a failed API call, Sentry's distributed tracing connects the client-side Dart stack trace directly to the backend Laravel exception and the exact database query that caused the failure.",
        },
        content: [
          "Sentry captures unhandled exceptions in real time, notifying engineers via Slack, email, or PagerDuty within seconds.",
          "Breadcrumbs track user actions before the crash: e.g. Route visited -> Button tapped -> SQL query executed -> Exception thrown.",
          "Distributed Tracing: The sentry-trace header links the mobile Flutter session directly to the server-side request lifecycle.",
          "Performance Monitoring flags slow database queries, external API bottlenecks, and queue latency regressions before users complain.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which environment variable in .env configures the destination endpoint for the Sentry Laravel SDK?",
          code: `// In .env:\n{{blank}}=https://examplePublicKey@o0.ingest.sentry.io/0`,
          options: ["SENTRY_LARAVEL_DSN", "SENTRY_API_KEY", "SENTRY_PROJECT_ID", "SENTRY_SECRET"],
          correctAnswer: "SENTRY_LARAVEL_DSN",
          explanation:
            "SENTRY_LARAVEL_DSN is the Data Source Name that tells the Sentry SDK where to securely submit crash reports and performance traces.",
          xp: 30,
        },
      },
    ],
  },

  // ==============================================================================
  // TRACK 6: DATABASE MASTERY & PERFORMANCE
  // ==============================================================================

  {
    id: "m21",
    index: 21,
    trackId: "track-6",
    trackName: "Track 6: Database Mastery & Performance",
    title: "Advanced Eloquent Techniques",
    tagline: "Polymorphism, soft deletes, and zero-memory data streaming",
    description:
      "Master polymorphic relations, model pruning, chunking, lazy collections, and custom enum attribute casts for high-throughput backends.",
    color: "#06b6d4",
    icon: "layers",
    lessons: [
      {
        id: "m21l1",
        moduleId: "m21",
        title: "Polymorphic Relationships (morphTo & morphMany)",
        readTime: "8 min",
        xp: 50,
        summary:
          "Attach comments, likes, or attachments to multiple models (Posts, Videos, Products) using a single polymorphic table.",
        flutterParallel: {
          concept: "Dart Polymorphic Interface vs Eloquent morphTo / morphMany",
          flutterFile: "lib/features/comments/domain/entities/commentable.dart",
          laravelFile: "app/Models/Comment.php",
          flutterCode: `// Dart polymorphic interface:
abstract class Commentable {
  int get id;
  String get title;
}

class Post implements Commentable { ... }
class Video implements Commentable { ... }

// Comment model referencing parent entity:
class Comment {
  final int id;
  final String body;
  final Commentable parent;
  Comment({required this.id, required this.body, required this.parent});
}`,
          laravelCode: `// Eloquent Polymorphic Model:
class Comment extends Model {
  // Returns either Post, Video, or Product instance!
  public function commentable(): MorphTo {
    return \$this->morphTo();
  }
}

class Post extends Model {
  public function comments(): MorphMany {
    return \$this->morphMany(Comment::class, 'commentable');
  }
}`,
          explanation:
            "Instead of creating separate post_comments, video_comments, and product_comments tables in your database, Laravel polymorphic relations store commentable_id (the target row PK) and commentable_type (e.g. 'App\\\\Models\\\\Post') on a single comments table.",
        },
        content: [
          "Polymorphic relations allow a model to belong to more than one other model on a single association.",
          "The child table requires two columns: `{name}_id` (integer/UUID) and `{name}_type` (string class name or morph alias).",
          "You can define morph maps in `AppServiceProvider`: `Relation::morphMap(['post' => Post::class, 'video' => Video::class]);` to avoid storing full PHP class strings in MySQL.",
          "Querying polymorphic children works identically to standard relations: `$post->comments()->create(['body' => 'Great tutorial!']);`.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which Eloquent relationship method defines a one-to-many polymorphic relationship on the parent model?",
          code: `public function comments(): MorphMany {\n  return \$this->{{blank}}(Comment::class, 'commentable');\n}`,
          options: ["morphMany", "morphTo", "hasManyThrough", "morphToMany"],
          correctAnswer: "morphMany",
          explanation:
            "$this->morphMany(Comment::class, 'commentable') establishes that the parent model owns many polymorphic Comment children.",
          xp: 30,
        },
      },
      {
        id: "m21l2",
        moduleId: "m21",
        title: "Soft Deletes & Automated Model Pruning",
        readTime: "7 min",
        xp: 45,
        summary:
          "Implement 'Undo Delete' in mobile apps with SoftDeletes and automatically purge stale records with the Prunable trait.",
        flutterParallel: {
          concept: "Trash Bin / Undo Delete UI vs Server-Side SoftDeletes",
          flutterFile: "lib/features/posts/presentation/widgets/trash_list.dart",
          laravelFile: "app/Models/Post.php",
          flutterCode: `// Flutter displaying trash bin items:
final trashedPosts = await api.getTrashedPosts();
// Tapping "Restore" sends PUT /api/posts/42/restore
IconButton(
  icon: const Icon(Icons.restore_from_trash),
  onPressed: () => restorePost(post.id),
);`,
          laravelCode: `use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Prunable;

class Post extends Model {
  use SoftDeletes, Prunable;

  // Automatically hard-delete trashed posts older than 30 days:
  public function prunable() {
    return static::where('deleted_at', '<=', now()->subDays(30));
  }
}

// In Controller:
Post::onlyTrashed()->find(\$id)->restore();`,
          explanation:
            "Calling $post->delete() on a soft-deleting model sets the deleted_at timestamp instead of running SQL DELETE. Eloquent automatically excludes deleted records from normal queries, while allowing you to query trashed items with Post::withTrashed() or Post::onlyTrashed().",
        },
        content: [
          "Soft deleting protects user data from accidental irreversible deletion and enables full 'Trash / Undo' mobile user experiences.",
          "The database migration must include `$table->softDeletes();` which creates a nullable `deleted_at` timestamp column.",
          "Normal queries like `Post::all()` automatically append `WHERE deleted_at IS NULL` under the hood.",
          "The `Prunable` trait pairs with Laravel's scheduler (`php artisan model:prune`) to permanently delete records after a retention period.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Which Eloquent query builder method allows you to query ONLY records that have been soft-deleted (ignoring active records)?",
          options: ["Post::onlyTrashed()", "Post::withTrashed()", "Post::getDeleted()", "Post::trashOnly()"],
          correctAnswer: 0,
          explanation:
            "Post::onlyTrashed() filters the query to return only records where deleted_at is NOT null.",
          xp: 25,
        },
      },
      {
        id: "m21l3",
        moduleId: "m21",
        title: "Chunking, Cursor & Lazy Collections",
        readTime: "8 min",
        xp: 50,
        summary:
          "Process millions of database rows without exhausting PHP memory using Generators, chunk(), and lazy().",
        flutterParallel: {
          concept: "ListView.builder Lazy Rendering vs PHP Generator Streaming",
          flutterFile: "lib/features/feed/presentation/infinite_feed.dart",
          laravelFile: "app/Jobs/ExportLargeDataset.php",
          flutterCode: `// Flutter ListView.builder renders items on-demand,
// keeping memory usage flat even with 100,000 list items:
ListView.builder(
  itemCount: 100000,
  itemBuilder: (context, index) => PostTile(post: posts[index]),
);`,
          laravelCode: `// BAD: User::all() loads 500k rows into RAM -> Fatal Memory Limit!
// GOOD: lazy() uses PHP Generators to stream rows with ~10MB RAM:
User::lazy()->each(function (User \$user) use (\$file) {
  fputcsv(\$file, [\$user->id, \$user->email]);
});

// Or chunk() for batch processing:
User::chunk(500, function (\$users) {
  foreach (\$users as \$user) {
    \$user->recalculateReputation();
  }
});`,
          explanation:
            "Just as Flutter's ListView.builder creates widgets on-demand as the user scrolls, Laravel's lazy() and cursor() methods use PHP Generators under the hood to fetch rows sequentially without buffering the entire table in server memory.",
        },
        content: [
          "Running `Model::all()` on a large production table causes PHP `Allowed memory size exhausted` fatal 500 crashes.",
          "`chunk($count, callable)` executes separate paginated SQL queries of size `$count`, freeing memory between batches.",
          "`cursor()` and `lazy()` execute a single SQL query and stream records one by one using a PHP Generator cursor.",
          "When modifying rows inside a chunk loop, always use `chunkById()` instead of `chunk()` to avoid skipping rows as primary keys shift.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Why is using `User::lazy()` or `User::cursor()` superior to `User::all()` when exporting 1,000,000 user rows to CSV?",
          options: [
            "It streams rows one by one using PHP Generators, keeping memory usage constant (~10MB) regardless of dataset size",
            "It automatically compresses the CSV file using GZIP in MySQL",
            "It translates PHP code into C++ binary for 10x faster execution",
            "It bypasses database authentication for higher throughput",
          ],
          correctAnswer: 0,
          explanation:
            "Generators yield one model instance at a time from the database cursor, preventing memory exhaustion on huge datasets.",
          xp: 30,
        },
      },
      {
        id: "m21l4",
        moduleId: "m21",
        title: "Attribute Casts, Enums & AsArrayObject",
        readTime: "7 min",
        xp: 45,
        summary:
          "Eliminate magic strings and JSON parsing boilerplate with PHP 8.1+ backed Enums and fluent Eloquent casts.",
        flutterParallel: {
          concept: "Dart Backed Enum Serialization vs PHP 8.2 Backed Enums in Eloquent",
          flutterFile: "lib/features/orders/domain/order_status.dart",
          laravelFile: "app/Models/Order.php",
          flutterCode: `// Dart Backed Enum:
enum OrderStatus {
  pending('pending'),
  processing('processing'),
  shipped('shipped'),
  delivered('delivered');

  final String value;
  const OrderStatus(this.value);
}`,
          laravelCode: `// PHP 8 Backed Enum:
enum OrderStatus: string {
  case Pending = 'pending';
  case Processing = 'processing';
  case Shipped = 'shipped';
  case Delivered = 'delivered';
}

class Order extends Model {
  protected function casts(): array {
    return [
      'status' => OrderStatus::class,
      'metadata' => AsArrayObject::class,
      'is_paid' => 'boolean',
    ];
  }
}`,
          explanation:
            "In Flutter, enums give compile-time safety over status values. In Laravel, declaring enum casts in the model automatically deserializes string database columns into typed PHP enum instances ($order->status === OrderStatus::Delivered) and serializes them back on save.",
        },
        content: [
          "Magic strings like `if ($order->status == 'delivred')` lead to silent production bugs that tests miss.",
          "In Laravel 11, define casts using the `protected function casts(): array` method on your model.",
          "Casting to a backed PHP Enum ensures invalid database values throw a `ValueError` immediately rather than propagating corrupt state.",
          "The `AsArrayObject` cast allows JSON columns to be mutated directly as in-memory arrays/objects: `$user->metadata['theme'] = 'dark'; $user->save();`.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which method in Laravel 11 models defines attribute type conversions such as enums and JSON objects?",
          code: `protected function {{blank}}(): array {\n  return ['status' => OrderStatus::class];\n}`,
          options: ["casts", "attributes", "mutators", "types"],
          correctAnswer: "casts",
          explanation:
            "In Laravel 11+, attribute casts are declared via the protected function casts(): array method on Eloquent models.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m22",
    index: 22,
    trackId: "track-6",
    trackName: "Track 6: Database Mastery & Performance",
    title: "Raw SQL, Query Builder & Index Optimization",
    tagline: "Sub-millisecond query execution and deep indexing",
    description:
      "When Eloquent is not enough: write raw SQL subqueries, analyze query plans with EXPLAIN ANALYZE, prevent race conditions with pessimistic locking, and profile queries.",
    color: "#06b6d4",
    icon: "zap",
    lessons: [
      {
        id: "m22l1",
        moduleId: "m22",
        title: "Raw SQL, Subqueries & whereExists",
        readTime: "8 min",
        xp: 50,
        summary:
          "Write high-performance correlated subqueries and advanced aggregations using DB::raw and selectSub.",
        flutterParallel: {
          concept: "In-Memory Dart List Calculations vs Server-Side SQL Subqueries",
          flutterFile: "lib/features/analytics/services/analytics_calculator.dart",
          laravelFile: "app/Services/UserMetricsService.php",
          flutterCode: `// Slow client-side calculation:
final users = await api.getUsersWithOrders();
// Calculating total spent in Dart memory across 50,000 items:
final topSpenders = users.where(
  (u) => u.orders.fold<double>(0, (sum, o) => sum + o.total) > 1000,
);`,
          laravelCode: `// Fast server-side SQL correlated subquery in 2ms:
\$topSpenders = User::select('users.*')
  ->selectSub(function (\$query) {
    \$query->from('orders')
      ->selectRaw('COALESCE(SUM(total_amount), 0)')
      ->whereColumn('orders.user_id', 'users.id');
  }, 'lifetime_spend')
  ->having('lifetime_spend', '>', 1000)
  ->get();`,
          explanation:
            "Never fetch thousands of records to the Flutter client just to perform mathematical sums or counts. Correlated SQL subqueries execute inside the database engine in milliseconds, returning only the exact computed numbers your UI needs.",
        },
        content: [
          "Eloquent's `selectSub()` attaches calculated subquery values to your models as if they were real table columns.",
          "`whereExists()` and `whereNotExists()` compile to fast correlated SQL `EXISTS (...)` filters, outperforming heavy `JOIN` operations on large tables.",
          "`DB::raw()` allows injecting raw SQL expressions into `select`, `where`, and `orderBy` clauses when standard query builder helpers fall short.",
          "Always use parameterized bindings when passing user input into raw expressions to prevent SQL injection vulnerabilities.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "What query builder method allows you to evaluate a correlated subquery and alias its computed scalar value as a column on the model?",
          code: `User::select('users.*')->{{blank}}(function (\$query) {\n  \$query->from('orders')->selectRaw('COUNT(*)')->whereColumn('orders.user_id', 'users.id');\n}, 'orders_count');`,
          options: ["selectSub", "withCount", "addSubSelect", "joinSub"],
          correctAnswer: "selectSub",
          explanation:
            "selectSub(Closure, alias) embeds a subquery into the SELECT clause and assigns its result to the specified attribute alias.",
          xp: 30,
        },
      },
      {
        id: "m22l2",
        moduleId: "m22",
        title: "Index Optimization & EXPLAIN ANALYZE",
        readTime: "8 min",
        xp: 50,
        summary:
          "Read query execution plans, eliminate Seq Scans, and design composite B-Tree indexes matching your WHERE and ORDER BY clauses.",
        flutterParallel: {
          concept: "Flutter DevTools Frame Profiling vs PostgreSQL EXPLAIN ANALYZE",
          flutterFile: "devtools/performance_profile.dart",
          laravelFile: "database/migrations/add_composite_index.php",
          flutterCode: `// Flutter DevTools shows 16ms jank frame when building list.
// Cause: Backend API endpoint takes 4.2 seconds to return!`,
          laravelCode: `// 1. Diagnose in PostgreSQL / MySQL:
// EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 42 ORDER BY created_at DESC;
// -> Seq Scan on posts (cost=14200.00..18900.00 rows=500000 width=128) [SLOW!]

// 2. Fix with Composite B-Tree Index:
Schema::table('posts', function (Blueprint \$table) {
  \$table->index(['user_id', 'created_at']);
});
// -> Index Scan using idx_posts_user_created (cost=0.42..8.45 rows=20) [2ms!]`,
          explanation:
            "When an API endpoint responds slowly, 95% of the time it is caused by a missing database index forcing MySQL to scan every single row on disk (Full Table / Seq Scan). EXPLAIN ANALYZE shows the exact execution plan and cost.",
        },
        content: [
          "A database index is a B-Tree data structure that allows binary search lookup in O(log N) time instead of O(N) table scans.",
          "Composite indexes `['user_id', 'created_at']` speed up queries filtering by `user_id` and sorting by `created_at` simultaneously.",
          "Leftmost Prefix Rule: An index on `(A, B, C)` can satisfy queries on `(A)`, `(A, B)`, or `(A, B, C)`, but NOT `(B)` or `(C)` alone.",
          "Over-indexing penalty: Every index speeds up `SELECT` queries but slows down `INSERT`, `UPDATE`, and `DELETE` queries as indexes must be rebalanced.",
        ],
        challenge: {
          type: "mcq",
          question:
            "According to the Leftmost Prefix rule, which query will NOT be able to utilize a composite index on columns `(user_id, status, created_at)`?",
          options: [
            "SELECT * FROM orders WHERE status = 'paid' AND created_at > NOW()",
            "SELECT * FROM orders WHERE user_id = 5",
            "SELECT * FROM orders WHERE user_id = 5 AND status = 'paid'",
            "SELECT * FROM orders WHERE user_id = 5 AND status = 'paid' ORDER BY created_at",
          ],
          correctAnswer: 0,
          explanation:
            "Because the query filters by 'status' without specifying the leading 'user_id' column, the B-tree index cannot be traversed from its root.",
          xp: 30,
        },
      },
      {
        id: "m22l3",
        moduleId: "m22",
        title: "Database Transactions & Concurrency Locking",
        readTime: "8 min",
        xp: 50,
        summary:
          "Prevent race conditions and double-spending using DB::transaction and pessimistic lockForUpdate().",
        flutterParallel: {
          concept: "Optimistic Concurrency in Client State vs Pessimistic DB Locking",
          flutterFile: "lib/features/wallet/presentation/transfer_dialog.dart",
          laravelFile: "app/Services/WalletTransferService.php",
          flutterCode: `// Mobile client triggers transfer button twice rapidly:
// Both requests hit the server at the exact same millisecond!`,
          laravelCode: `// Pessimistic Locking prevents double-spend race conditions:
DB::transaction(function () use (\$fromId, \$toId, \$amount) {
  // lockForUpdate() acquires an exclusive row lock in MySQL:
  \$sender = Wallet::where('id', \$fromId)->lockForUpdate()->first();
  \$receiver = Wallet::where('id', \$toId)->lockForUpdate()->first();

  if (\$sender->balance < \$amount) {
    throw new InsufficientFundsException();
  }

  \$sender->decrement('balance', \$amount);
  \$receiver->increment('balance', \$amount);
});`,
          explanation:
            "If a user taps 'Withdraw \$100' on their phone twice simultaneously, two server threads read balance=\$100 before either writes balance=\$0. Using lockForUpdate() forces the second request to pause until the first transaction commits.",
        },
        content: [
          "Race conditions occur when concurrent requests read stale state before previous mutations commit.",
          "`DB::transaction()` wraps database operations in `BEGIN` and `COMMIT`, automatically rolling back on any thrown exception.",
          "`lockForUpdate()` (Pessimistic Write Lock) instructs the database engine to lock selected rows until the surrounding transaction finishes.",
          "`sharedLock()` (Pessimistic Read Lock) prevents other transactions from mutating the row while allowing concurrent reads.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "What Eloquent method attaches a pessimistic 'SELECT ... FOR UPDATE' exclusive lock to a query inside a database transaction?",
          code: `\$wallet = Wallet::where('user_id', \$user->id)->{{blank}}()->first();`,
          options: ["lockForUpdate", "sharedLock", "lock", "pessimisticLock"],
          correctAnswer: "lockForUpdate",
          explanation:
            "lockForUpdate() acquires an exclusive row-level lock, blocking other transactions from modifying or locking the same row until commit.",
          xp: 30,
        },
      },
      {
        id: "m22l4",
        moduleId: "m22",
        title: "Database Query Profiling & Slow Query Logging",
        readTime: "7 min",
        xp: 45,
        summary:
          "Intercept database queries with DB::listen and configure automated alerts for slow SQL executions.",
        flutterParallel: {
          concept: "Dio Logging Interceptors vs Laravel DB::listen Query Hooks",
          flutterFile: "lib/core/network/dio_query_logger.dart",
          laravelFile: "app/Providers/AppServiceProvider.php",
          flutterCode: `// Flutter Dio interceptor logs HTTP latency:
dio.interceptors.add(InterceptorsWrapper(
  onResponse: (response, handler) {
    print('HTTP \${response.statusCode} in \${response.extra['duration']}ms');
  },
));`,
          laravelCode: `// In AppServiceProvider.php:
public function boot(): void {
  // Listen to every executed SQL query across the application:
  DB::listen(function (QueryExecuted \$query) {
    if (\$query->time > 100) { // Log queries taking longer than 100ms
      Log::warning("Slow Query Detected: {\$query->time}ms", [
        'sql' => \$query->sql,
        'bindings' => \$query->bindings,
        'connection' => \$query->connectionName,
      ]);
    }
  });
}`,
          explanation:
            "While client Dio interceptors measure round-trip network time, Laravel's DB::listen hook inspects the exact SQL statement and database execution duration for every query, letting you detect query regressions before they impact users.",
        },
        content: [
          "`DB::listen(callable)` registers a global callback executed after every database query runs.",
          "The `QueryExecuted` object exposes `$query->sql`, `$query->bindings`, `$query->time` (in milliseconds), and `$query->connectionName`.",
          "Tools like Laravel Telescope and Laravel Pulse visualize query execution time histograms and identify duplicate queries.",
          "In production, never log sensitive parameters (e.g. hashed passwords or credit card tokens) inside query bindings.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Where in a Laravel application should you register a global `DB::listen()` hook to monitor slow queries?",
          options: [
            "In the `boot()` method of `app/Providers/AppServiceProvider.php`",
            "Inside the `routes/api.php` file",
            "Inside the `.env` file directly",
            "In the `database/seeders/DatabaseSeeder.php` class",
          ],
          correctAnswer: 0,
          explanation:
            "AppServiceProvider's boot() method runs on every application request, making it the canonical place to register global query listeners.",
          xp: 25,
        },
      },
    ],
  },

  {
    id: "m23",
    index: 23,
    trackId: "track-6",
    trackName: "Track 6: Database Mastery & Performance",
    title: "Multi-Tenancy & Data Isolation",
    tagline: "Enterprise SaaS architecture and tenant security",
    description:
      "Build secure B2B multi-tenant backends. Isolate client data using Global Scopes, database multi-tenancy, and PostgreSQL Row-Level Security (RLS).",
    color: "#06b6d4",
    icon: "shield-check",
    lessons: [
      {
        id: "m23l1",
        moduleId: "m23",
        title: "Single DB vs Multi-DB Multi-Tenancy",
        readTime: "7 min",
        xp: 45,
        summary:
          "Evaluate multi-tenant architecture models: column-based tenant scoping, schema-per-tenant, and database-per-tenant.",
        flutterParallel: {
          concept: "Switching Organization / Workspace in Mobile App vs Backend Multi-Tenancy",
          flutterFile: "lib/features/workspace/presentation/workspace_selector.dart",
          laravelFile: "app/Http/Middleware/IdentifyTenant.php",
          flutterCode: `// Mobile client switches current organization:
await workspaceStore.switchWorkspace(orgId: 'org_acme');
// Future HTTP calls pass 'X-Tenant-ID: org_acme' in headers
dio.options.headers['X-Tenant-ID'] = 'org_acme';`,
          laravelCode: `// Multi-Tenancy Models in Laravel:
// Model 1: Column-based (tenant_id on every table) -> Simplest, lowest cost
// Model 2: Database-per-tenant -> Absolute data isolation, compliance
class IdentifyTenant {
  public function handle(Request \$request, Closure \$next) {
    \$tenantId = \$request->header('X-Tenant-ID') ?? \$request->user()?->tenant_id;
    abort_if(!\$tenantId, 400, 'Tenant identifier missing');
    app()->instance('current_tenant_id', \$tenantId);
    return \$next(\$request);
  }
}`,
          explanation:
            "In B2B SaaS apps (like Slack or Notion), users belong to distinct companies (tenants). Single-database tenancy adds a tenant_id column to every table; multi-database tenancy switches the active MySQL connection dynamically per request.",
        },
        content: [
          "Single-Database Multi-Tenancy: All tenants share the same database and tables, isolated by `tenant_id` column filters.",
          "Multi-Database Multi-Tenancy: Each company has its own isolated database instance, preventing accidental cross-tenant data leaks.",
          "Trade-off: Single DB is 10x cheaper to host and simpler to backup, but requires bulletproof application-level scoping.",
          "Packages like `spatie/laravel-multitenancy` and `stancl/tenancy` provide automatic domain, subdomain, and header-based tenant resolution.",
        ],
        challenge: {
          type: "mcq",
          question:
            "What is the primary benefit of Single-Database Multi-Tenancy compared to Database-per-Tenant architecture?",
          options: [
            "Significantly lower server hosting cost and simpler schema migration management across all tenants",
            "It guarantees that MySQL never requires database indexes",
            "It eliminates the need for user passwords",
            "It allows mobile Flutter apps to compile without Dart code",
          ],
          correctAnswer: 0,
          explanation:
            "Single-database tenancy requires running migrations on only one database rather than orchestrating schema updates across thousands of separate tenant databases.",
          xp: 25,
        },
      },
      {
        id: "m23l2",
        moduleId: "m23",
        title: "Global Scopes for Automatic Tenant Isolation",
        readTime: "8 min",
        xp: 50,
        summary:
          "Enforce tenant security automatically using Eloquent Global Scopes so developers never forget WHERE tenant_id = ?.",
        flutterParallel: {
          concept: "Base Repository Auto-Attaching Headers vs Eloquent Global Scopes",
          flutterFile: "lib/core/repositories/base_repository.dart",
          laravelFile: "app/Models/Scopes/TenantScope.php",
          flutterCode: `// Dart repository auto-attaches tenant parameter:
abstract class BaseRepository {
  Map<String, dynamic> withTenant(Map<String, dynamic> params) {
    return {...params, 'tenant_id': currentTenantId};
  }
}`,
          laravelCode: `// 1. Define Global Scope:
class TenantScope implements Scope {
  public function apply(Builder \$builder, Model \$model): void {
    if (app()->has('current_tenant_id')) {
      \$builder->where(\$model->getTable() . '.tenant_id', app('current_tenant_id'));
    }
  }
}

// 2. Attach to Model:
class Project extends Model {
  protected static function booted(): void {
    static::addGlobalScope(new TenantScope);
  }
}`,
          explanation:
            "Relying on developers to manually write where('tenant_id', $id) on every query is a major security vulnerability. Eloquent Global Scopes automatically intercept all SELECT, UPDATE, and DELETE queries to inject the active tenant filter.",
        },
        content: [
          "Global Scopes allow you to add constraints to all queries for a given model automatically.",
          "A `TenantScope` prevents cross-tenant data leaks by guaranteeing that `$project = Project::find($id)` only resolves if the record belongs to the active tenant.",
          "Automatic saving: Trait `BelongsToTenant` can hook into `creating` to set `$model->tenant_id = app('current_tenant_id')` automatically.",
          "Bypassing the scope: SuperAdmin analytics queries can use `Project::withoutGlobalScope(TenantScope::class)->get()`.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which Eloquent method registers a Global Scope inside a model's booted() lifecycle method?",
          code: `protected static function booted(): void {\n  static::{{blank}}(new TenantScope);\n}`,
          options: ["addGlobalScope", "applyScope", "registerScope", "withScope"],
          correctAnswer: "addGlobalScope",
          explanation:
            "static::addGlobalScope(ScopeInterface) attaches a global query scope to the model class.",
          xp: 30,
        },
      },
      {
        id: "m23l3",
        moduleId: "m23",
        title: "PostgreSQL Row-Level Security (RLS) with Laravel",
        readTime: "8 min",
        xp: 50,
        summary:
          "Enforce tenant data isolation at the database kernel level using PostgreSQL RLS policies and session variables.",
        flutterParallel: {
          concept: "Supabase RLS Policies vs PostgreSQL RLS in Laravel",
          flutterFile: "supabase/schema.sql",
          laravelFile: "app/Http/Middleware/SetDatabaseSessionTenant.php",
          flutterCode: `// Supabase RLS policy in PostgreSQL:
CREATE POLICY "Tenant isolation" ON projects
  FOR ALL USING (tenant_id = auth.jwt() ->> 'tenant_id');`,
          laravelCode: `// In Laravel Middleware:
public function handle(Request \$request, Closure \$next) {
  \$tenantId = \$request->header('X-Tenant-ID');
  // Set PostgreSQL local session config variable:
  DB::statement("SET LOCAL app.current_tenant_id = ?", [\$tenantId]);
  return \$next(\$request);
}

// In PostgreSQL Migration:
// CREATE POLICY tenant_isolation_policy ON projects
//   USING (tenant_id = current_setting('app.current_tenant_id', true));`,
          explanation:
            "Even if a rogue application query runs without a WHERE clause, PostgreSQL Row-Level Security (RLS) rejects the query at the database engine level if the tenant_id does not match the active session variable. This provides defense-in-depth security.",
        },
        content: [
          "Application-level scoping (Global Scopes) can still be accidentally bypassed by raw SQL queries or misconfigured third-party packages.",
          "PostgreSQL Row-Level Security (RLS) enforces authorization rules directly inside the database query planner.",
          "`SET LOCAL app.current_tenant_id = '...'` assigns a session variable valid only for the duration of the current database transaction.",
          "RLS ensures that even if an SQL injection vulnerability occurs, the attacker cannot read records belonging to other tenants.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Why does PostgreSQL Row-Level Security (RLS) provide stronger security guarantees than PHP application-level `WHERE` clauses?",
          options: [
            "It is enforced by the database kernel itself, preventing data leakage even if application code or raw SQL forgets the filter",
            "It automatically translates PostgreSQL tables into Redis key-value pairs",
            "It eliminates the need for database backups",
            "It forces Flutter mobile apps to run with root permissions",
          ],
          correctAnswer: 0,
          explanation:
            "RLS operates at the database engine layer, so no matter how a query is executed (raw SQL, Eloquent, or ORM), the database refuses to return unauthorized rows.",
          xp: 25,
        },
      },
      {
        id: "m23l4",
        moduleId: "m23",
        title: "Tenant Migrations & Safe Cross-Tenant Analytics",
        readTime: "7 min",
        xp: 45,
        summary:
          "Orchestrate migrations across tenant databases and execute aggregated platform reporting without compromising tenant boundaries.",
        flutterParallel: {
          concept: "SuperAdmin Dashboard in Flutter vs Cross-Tenant Backend Queries",
          flutterFile: "lib/features/admin/presentation/platform_stats_screen.dart",
          laravelFile: "app/Actions/CalculatePlatformRevenue.php",
          flutterCode: `// SuperAdmin Flutter screen aggregating metrics:
final metrics = await adminApi.getGlobalPlatformMetrics();
Text('Total Platform Revenue: \${metrics.totalRevenue}');`,
          laravelCode: `// Safe cross-tenant aggregation with explicit scope removal:
class CalculatePlatformRevenue {
  public function __invoke(): float {
    // Explicitly bypass TenantScope strictly within authorized admin action:
    return Order::withoutGlobalScope(TenantScope::class)
      ->where('status', 'paid')
      ->sum('total_amount');
  }
}`,
          explanation:
            "Platform administrators frequently need to view global analytics (total users, aggregate revenue) across all enterprise tenants. Using withoutGlobalScope(TenantScope::class) allows authorized admin actions to query the entire dataset safely.",
        },
        content: [
          "In multi-database architectures, Artisan commands like `tenancy:migrate` iterate over every tenant database to apply schema updates sequentially.",
          "`Model::withoutGlobalScope(TenantScope::class)` temporarily removes the tenant filter for system-level administrative operations.",
          "Always protect cross-tenant query actions behind strict Gate/Policy authorization (e.g. `Gate::authorize('view-platform-analytics')`).",
          "Read replicas or aggregated data warehouses (like Snowflake or BigQuery) are recommended when cross-tenant reporting queries become computationally heavy.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which Eloquent method temporarily bypasses a specific global scope for an administrative query?",
          code: `\$globalOrders = Order::{{blank}}(TenantScope::class)->where('status', 'paid')->get();`,
          options: ["withoutGlobalScope", "withoutScope", "ignoreScope", "bypassGlobalScope"],
          correctAnswer: "withoutGlobalScope",
          explanation:
            "withoutGlobalScope(ScopeClass) instructs Eloquent to remove the specified scope constraint for that query invocation.",
          xp: 30,
        },
      },
    ],
  },

  {
    id: "m24",
    index: 24,
    trackId: "track-6",
    trackName: "Track 6: Database Mastery & Performance",
    title: "Zero-Downtime Database Migrations & DevOps",
    tagline: "Deploy schema alterations to production with 0% downtime",
    description:
      "Execute zero-downtime schema changes, background data backfilling, schema dump squashing, and point-in-time recovery for mission-critical backends.",
    color: "#06b6d4",
    icon: "hard-drive",
    lessons: [
      {
        id: "m24l1",
        moduleId: "m24",
        title: "Safe Schema Alterations (Expand & Contract Pattern)",
        readTime: "8 min",
        xp: 50,
        summary:
          "Evolve database schemas without breaking running Flutter mobile clients or locking high-traffic MySQL tables.",
        flutterParallel: {
          concept: "Supporting Multiple Active Mobile App Versions vs Expand & Contract Migrations",
          flutterFile: "lib/features/profile/data/models/user_model.dart",
          laravelFile: "database/migrations/2026_10_01_expand_users_table.php",
          flutterCode: `// Mobile app v1 sends 'name', app v2 sends 'first_name' & 'last_name':
// The backend API must handle both during the transition period!`,
          laravelCode: `// The 3 Phases of Zero-Downtime Expand & Contract:
// Phase 1 (Expand): Add new columns as NULLABLE
Schema::table('users', function (Blueprint \$table) {
  \$table->string('first_name')->nullable();
  \$table->string('last_name')->nullable();
});

// Phase 2 (Transition): Application dual-writes to both old and new columns,
// while a background queue job backfills existing rows.

// Phase 3 (Contract): Drop old 'name' column once all mobile clients upgrade.`,
          explanation:
            "Renaming a column directly (RENAME COLUMN name TO full_name) in production causes immediate 500 errors for any active Flutter client or web server thread still executing queries. The Expand and Contract pattern ensures zero downtime.",
        },
        content: [
          "Never perform destructive schema operations (renaming columns, dropping columns, adding non-nullable columns) in a single deployment.",
          "Expand: Add new columns as nullable or with defaults so old application code continues functioning without error.",
          "Transition: Deploy updated backend code that writes to both old and new columns, and backfill historical rows via queue jobs.",
          "Contract: Once old mobile app versions are deprecated or traffic ceases, safely drop the old legacy column in a final migration.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Why is renaming a column directly with `RENAME COLUMN old_name TO new_name` in a high-traffic production database dangerous?",
          options: [
            "It immediately breaks running backend server threads and mobile clients that are still executing queries using the old column name",
            "It automatically deletes all foreign key constraints across the entire database",
            "MySQL will refuse to execute any further SELECT queries for 24 hours",
            "It disables HTTPS encryption on all incoming requests",
          ],
          correctAnswer: 0,
          explanation:
            "During a rolling deployment, some server instances run old code while others run new code. Renaming a column instantly breaks queries referencing the old name.",
          xp: 25,
        },
      },
      {
        id: "m24l2",
        moduleId: "m24",
        title: "Background Data Backfilling with Queued Jobs",
        readTime: "8 min",
        xp: 50,
        summary:
          "Backfill millions of database records asynchronously in controlled batches using chunkById and queued jobs.",
        flutterParallel: {
          concept: "Background Local Database Migration in Flutter vs Queued Data Backfills",
          flutterFile: "lib/core/database/local_migration.dart",
          laravelFile: "app/Jobs/BackfillUserUuidsJob.php",
          flutterCode: `// Flutter running SQLite data transform in background isolate:
await compute(migrateLegacyLocalTokens, dbPath);`,
          laravelCode: `class BackfillUserUuidsJob implements ShouldQueue {
  use Dispatchable, InteractsWithQueue, Queueable;

  public function handle(): void {
    // chunkById prevents table locking and infinite loops:
    User::whereNull('uuid')->chunkById(1000, function (\$users) {
      foreach (\$users as \$user) {
        \$user->updateQuietly(['uuid' => (string) Str::uuid()]);
      }
      // Pause slightly to let database replication catch up:
      usleep(50000); // 50ms sleep
    });
  }
}`,
          explanation:
            "Running UPDATE users SET uuid = UUID() directly in a migration will lock the entire users table for minutes, bringing down your production API. Moving the data backfill into a background queue job processes records safely without locking.",
        },
        content: [
          "Database migrations should only modify structure (DDL); they should never execute heavy data transformations (DML) on millions of rows.",
          "`updateQuietly()` updates the database record without firing Eloquent model events or updating `updated_at` timestamps.",
          "`chunkById()` uses primary key pagination (`WHERE id > last_seen_id`), preventing memory leaks and skipped records.",
          "Throttling backfill loops with `usleep()` gives database read replicas time to replicate changes without lag.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which Eloquent method updates model attributes in the database without triggering model events or touching timestamps?",
          code: `\$user->{{blank}}(['uuid' => (string) Str::uuid()]);`,
          options: ["updateQuietly", "saveQuietly", "rawUpdate", "silentUpdate"],
          correctAnswer: "updateQuietly",
          explanation:
            "updateQuietly() updates the database row while suppressing all Eloquent model event listeners and maintaining existing updated_at timestamps.",
          xp: 30,
        },
      },
      {
        id: "m24l3",
        moduleId: "m24",
        title: "Migration Squashing & Schema Dumps",
        readTime: "7 min",
        xp: 45,
        summary:
          "Consolidate hundreds of historical migration files into a single schema dump using php artisan schema:dump.",
        flutterParallel: {
          concept: "Squashing Git Commits vs Squashing Historical Laravel Migrations",
          flutterFile: "git_squash.sh",
          laravelFile: "database/schema/mysql-schema.sql",
          flutterCode: `// Squashing 200 old commits into a clean master branch:
git reset --soft HEAD~200 && git commit -m "Squashed initial release"`,
          laravelCode: `// In terminal:
// 1. Dumps existing schema into a single SQL file & deletes old migrations:
php artisan schema:dump --prune

// Result:
// - Creates database/schema/mysql-schema.sql
// - Removes 300 old migration files!
// - New migrations created after this date will run normally on top.`,
          explanation:
            "As an enterprise application matures, accumulating 300+ migration files slows down automated test suites significantly. Squashing migrations into a single schema file boots fresh test databases in milliseconds.",
        },
        content: [
          "When running tests with `RefreshDatabase`, Laravel executes all migrations from scratch. Running 300 individual migrations creates massive disk I/O.",
          "`php artisan schema:dump` extracts the current database structure into a single `database/schema/mysql-schema.sql` file.",
          "The `--prune` flag automatically deletes all archived migration files that were consolidated into the dump.",
          "When deploying or testing on a fresh database, Laravel loads the single schema SQL file first, then executes only new migrations created afterward.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Which Artisan command generates a single schema dump file and optionally prunes historical migration files?",
          code: `php artisan {{blank}}:dump --prune`,
          options: ["schema", "migrate", "db", "structure"],
          correctAnswer: "schema",
          explanation:
            "php artisan schema:dump creates a native SQL schema file and consolidates your migration history.",
          xp: 25,
        },
      },
      {
        id: "m24l4",
        moduleId: "m24",
        title: "Point-in-Time Recovery & Database Disaster Drills",
        readTime: "8 min",
        xp: 50,
        summary:
          "Implement automated WAL archiving, test recovery procedures, and verify zero data loss disaster recovery plans.",
        flutterParallel: {
          concept: "Cloud Backup Sync in Flutter vs Database Point-in-Time Recovery (PITR)",
          flutterFile: "lib/core/services/cloud_backup_service.dart",
          laravelFile: "config/backup.php",
          flutterCode: `// Mobile app uploading encrypted local backup snapshot to cloud:
await cloudBackup.uploadEncryptedSnapshot(localDbFile);`,
          laravelCode: `// Continuous PostgreSQL Write-Ahead Log (WAL) Archiving:
// - Full daily snapshot at 00:00 UTC
// - Continuous WAL streaming to Amazon S3 every 60 seconds

// Disaster Scenario: Developer runs accidental DROP TABLE at 14:32:15 UTC.
// Recovery: Restore 00:00 snapshot + replay WAL logs up to 14:32:14 UTC!
// Result: 0 data loss, zero customer impact!`,
          explanation:
            "Point-in-Time Recovery (PITR) pairs daily base backups with continuous transaction log (WAL) archiving, allowing you to restore the database to the exact second right before an accidental data corruption event occurred.",
        },
        content: [
          "The golden rule of DevOps: An untested backup is not a backup.",
          "Point-in-Time Recovery (PITR) allows database restoration to any arbitrary second in the past retention window.",
          "RPO (Recovery Point Objective): The maximum acceptable data loss time window (e.g. < 1 minute of transactions).",
          "RTO (Recovery Time Objective): The maximum acceptable downtime to restore the database online (e.g. < 15 minutes).",
        ],
        challenge: {
          type: "mcq",
          question:
            "What technology enables Point-in-Time Recovery (PITR) to restore a database to the exact second before an accidental DROP TABLE occurred?",
          options: [
            "Replaying continuous Write-Ahead Logs (WAL) on top of the latest base snapshot",
            "Refreshing the browser cache on client mobile devices",
            "Running `php artisan cache:clear` on all worker nodes",
            "Executing MySQL table repairs in single-user mode",
          ],
          correctAnswer: 0,
          explanation:
            "PITR restores the base snapshot and replays transaction logs (WAL) up to the exact target timestamp, recovering all transactions made prior to the error.",
          xp: 30,
        },
      },
    ],
  },
];

/* ------------------------- per-lesson visuals --------------------- */

export const lessonVisuals: Record<string, LessonVisual> = {
  // Track 1
  m1l1: {
    kind: "schema",
    tables: [
      {
        name: "users",
        color: "#38bdf8",
        badge: "schema contract",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "name", type: "varchar(255)" },
          { name: "email", type: "varchar(255)", unique: true },
          { name: "password", type: "varchar(255)" },
          { name: "created_at", type: "timestamp", nullable: true },
        ],
      },
    ],
    note: "Hover a column. PK marks the row's identity; UNIQUE means the database itself blocks duplicates — no Dart-side check required.",
  },
  m1l2: {
    kind: "schema",
    tables: [USERS_TABLE, POSTS_TABLE],
    note: "posts.user_id holds a reference to users.id. The arrow is the foreign key — the child always points at its parent.",
  },
  m1l3: {
    kind: "schema",
    tables: [
      {
        name: "posts",
        color: "#f43f5e",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "title", type: "varchar(255)" },
        ],
      },
      {
        name: "post_tag",
        color: "#a78bfa",
        badge: "pivot",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "post_id", type: "bigint unsigned", key: "FK", ref: { table: "posts", col: "id" } },
          { name: "tag_id", type: "bigint unsigned", key: "FK", ref: { table: "tags", col: "id" } },
        ],
      },
      {
        name: "tags",
        color: "#fbbf24",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "label", type: "varchar(50)", unique: true },
        ],
      },
    ],
    note: "Many-to-many, normalized: a pivot table with two foreign keys replaces the comma-joined 'tags' string entirely.",
  },

  m2l1: {
    kind: "pipeline",
    nodes: [
      { label: "Dart Type", lang: "dart", code: "int add(int a, int b) => a + b;" },
      { label: "PHP 8 Strict", lang: "php", code: "declare(strict_types=1);\nfn(int $a, int $b): int => $a + $b;" },
    ],
    note: "declare(strict_types=1) enforces compile-time style rigor onto PHP runtime execution.",
  },
  m2l2: {
    kind: "pipeline",
    nodes: [
      { label: "Dart Collections", lang: "dart", code: "final tags = ['mobile'];\nfinal user = {'name': 'Ada'};" },
      { label: "PHP Unified Array", lang: "php", code: "$tags = ['mobile'];\n$user = ['name' => 'Ada'];" },
    ],
    note: "One data structure to rule them all: PHP arrays handle both indexed lists and key-value maps.",
  },
  m2l3: {
    kind: "pipeline",
    nodes: [
      { label: "Dart Constructor", lang: "dart", code: "User({required this.id, required this.name});" },
      { label: "PHP 8 Promoted", lang: "php", code: "public function __construct(\n  public readonly int $id,\n  public readonly string $name\n) {}" },
    ],
    note: "Promoted properties eliminate 3x boilerplate, matching Dart's concise constructors.",
  },
  m2l4: {
    kind: "pipeline",
    nodes: [
      { label: "Dart Switch Expression", lang: "dart", code: "switch (status) {\n  Status.active => 200,\n  _ => 400\n};" },
      { label: "PHP 8 Match", lang: "php", code: "match ($status) {\n  Status::Active => 200,\n  default => 400\n};" },
    ],
    note: "PHP 8 match expressions are exhaustive, return values, and use strict (===) comparison.",
  },

  m3l1: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Flutter dio.get()", sub: "Packet leaves phone over TLS" },
      { icon: "server", title: "Nginx Proxy", sub: "Forwards to PHP-FPM socket" },
      { icon: "boot", title: "public/index.php", sub: "Laravel Kernel captures Request" },
      { icon: "shield", title: "Middleware Onion", sub: "CORS, Throttle & Auth checks" },
      { icon: "route", title: "Router & Controller", sub: "Route model binding resolves row" },
      { icon: "package", title: "JSON Response", sub: "Serialized and sent to Flutter" },
    ],
    note: "The full journey: from client network socket through server kernel, middleware, and back.",
  },
  m3l2: {
    kind: "pipeline",
    nodes: [
      { label: "GET (Safe, Idempotent)", lang: "http", code: "GET /api/posts/42\nNo state mutation" },
      { label: "POST (Create, Non-Idempotent)", lang: "http", code: "POST /api/posts\nCreates new row each time" },
      { label: "PUT / PATCH (Update)", lang: "http", code: "PUT: Full replace\nPATCH: Partial delta" },
    ],
    note: "HTTP verbs establish unambiguous intent between your Flutter client and server routes.",
  },
  m3l3: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Incoming Request", sub: "Headers, method, path" },
      { icon: "shield", title: "HandleCors", sub: "Allow Flutter client origin" },
      { icon: "activity", title: "ThrottleRequests", sub: "60 req/min limit check" },
      { icon: "key", title: "Authenticate", sub: "Verify Sanctum Bearer token" },
      { icon: "controller", title: "Controller", sub: "Runs your business logic" },
    ],
    note: "Middleware chains execute in strict order. If authentication fails, the controller never runs.",
  },
  m3l4: {
    kind: "pipeline",
    nodes: [
      { label: "Contract Interface", lang: "php", code: "interface PostRepositoryContract {\n  public function all();\n}" },
      { label: "Container Binding", lang: "php", code: "$app->bind(\n  PostRepositoryContract::class,\n  EloquentPostRepository::class\n);" },
      { label: "Controller Injection", lang: "php", code: "public function __construct(\n  protected PostRepositoryContract $repo\n) {}" },
    ],
    note: "The Service Container auto-resolves constructor dependencies via PHP reflection.",
  },

  m4l1: {
    kind: "schema",
    tables: [
      {
        name: "migrations",
        color: "#38bdf8",
        badge: "framework",
        columns: [
          { name: "id", type: "int", key: "PK" },
          { name: "migration", type: "varchar(255)" },
          { name: "batch", type: "int" },
        ],
      },
      ORDERS_TABLE,
    ],
    note: "Laravel tracks executed migrations in a migrations table, ensuring team members stay perfectly in sync.",
  },
  m4l2: {
    kind: "schema",
    tables: [
      ORDERS_TABLE,
      ORDER_ITEMS_TABLE,
    ],
    note: "Foreign key constraints ensure order_items can never reference a non-existent order_id.",
  },
  m4l3: {
    kind: "pipeline",
    nodes: [
      { label: "Faker Library", lang: "php", code: "$name = fake()->name();\n$email = fake()->email();" },
      { label: "Factory Blueprint", lang: "php", code: "User::factory()->count(50)" },
      { label: "Database Persist", lang: "php", code: "->create(); // 50 rows inserted!" },
    ],
    note: "Factories populate local development with realistic data in milliseconds.",
  },
  m4l4: {
    kind: "schema",
    tables: [USERS_TABLE, ORDERS_TABLE, ORDER_ITEMS_TABLE],
    note: "Hierarchical seeders populate parents first, then cascade to related children.",
  },

  // Track 2
  m5l1: {
    kind: "pipeline",
    nodes: [
      { label: "Client DAO Call", lang: "dart", code: "final dao = database.userDao;\nfinal user = await dao.findById(42);" },
      { label: "ActiveRecord Query", lang: "php", code: "$user = User::findOrFail(42);" },
      { label: "Compiled SQL", lang: "sql", code: "SELECT * FROM users WHERE id = 42 LIMIT 1;" },
    ],
    note: "ActiveRecord combines query builder and model state into a single cohesive class that queries itself.",
  },
  m5l2: {
    kind: "pipeline",
    nodes: [
      { label: "Insert", lang: "php", code: "$post = Post::create(['title' => 'Hello Flutter']);" },
      { label: "Safe Lookup", lang: "php", code: "$post = Post::findOrFail(42); // 404 on missing!" },
      { label: "Update & Delete", lang: "php", code: "$post->update(['views' => 10]);\n$post->delete();" },
    ],
    note: "findOrFail eliminates manual null checks by automatically halting with an HTTP 404 Not Found response.",
  },
  m5l3: {
    kind: "pipeline",
    nodes: [
      { label: "Scope Definition", lang: "php", code: "public function scopePublished($q) {\n  return $q->whereNotNull('published_at');\n}" },
      { label: "Chained Call", lang: "php", code: "$posts = Post::published()->latest()->get();" },
      { label: "Compiled SQL", lang: "sql", code: "SELECT * FROM posts\nWHERE published_at IS NOT NULL\nORDER BY created_at DESC;" },
    ],
    note: "Query scopes encapsulate common SQL WHERE clauses into readable, reusable domain methods.",
  },
  m5l4: {
    kind: "pipeline",
    nodes: [
      { label: "Raw SQL Values", lang: "sql", code: "status = 'paid'\nmetadata = '{\"theme\":\"dark\"}'" },
      { label: "Eloquent casts()", lang: "php", code: "protected function casts(): array {\n  return [\n    'status' => OrderStatus::class,\n    'metadata' => 'array',\n  ];\n}" },
      { label: "Hydrated Types", lang: "php", code: "$order->status; // OrderStatus::Paid\n$order->metadata['theme']; // 'dark'" },
    ],
    note: "Eloquent attribute casting automatically translates raw SQL column primitives into typed PHP 8 Enums and arrays.",
  },

  m6l1: {
    kind: "schema",
    tables: [USERS_TABLE, POSTS_TABLE],
    note: "One-to-many: Post belongsTo User, User hasMany Posts. The child table posts holds the foreign key user_id.",
  },
  m6l2: {
    kind: "schema",
    tables: [
      {
        name: "posts",
        color: "#f43f5e",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "title", type: "varchar(255)" },
        ],
      },
      {
        name: "post_tag",
        color: "#a78bfa",
        badge: "pivot",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "post_id", type: "bigint unsigned", key: "FK", ref: { table: "posts", col: "id" } },
          { name: "tag_id", type: "bigint unsigned", key: "FK", ref: { table: "tags", col: "id" } },
        ],
      },
      {
        name: "tags",
        color: "#fbbf24",
        columns: [
          { name: "id", type: "bigint unsigned", key: "PK" },
          { name: "name", type: "varchar(50)", unique: true },
        ],
      },
    ],
    note: "Many-to-many: The post_tag pivot table joins posts and tags. sync([1, 2, 3]) updates pivot records in one command.",
  },
  m6l3: {
    kind: "pipeline",
    nodes: [
      { label: "N+1 Vulnerability", lang: "php", code: "// 51 database queries!\nPost::all()->each(fn($p) => $p->author->name);" },
      { label: "Eager Loaded Fix", lang: "php", code: "// Exactly 2 database queries!\nPost::with('author')->get();" },
      { label: "SQL Batch Query", lang: "sql", code: "SELECT * FROM users\nWHERE id IN (1, 2, 3, ...);" },
    ],
    note: "with('relation') eager-loads relations in a single WHERE IN query, eliminating catastrophic N+1 database latency.",
  },
  m6l4: {
    kind: "pipeline",
    nodes: [
      { label: "Client Inefficiency", lang: "dart", code: "// Downloading 10,000 comment objects\nText('\${post.comments.length} Comments');" },
      { label: "Server withCount()", lang: "php", code: "$posts = Post::withCount('comments')->paginate(15);" },
      { label: "Generated SQL Subquery", lang: "sql", code: "SELECT posts.*,\n  (SELECT COUNT(*) FROM comments\n   WHERE comments.post_id = posts.id) AS comments_count\nFROM posts;" },
    ],
    note: "withCount() computes aggregate relationship counters directly in SQL, avoiding hydrating heavy models into server RAM.",
  },

  m7l1: {
    kind: "pipeline",
    nodes: [
      { label: "API Route Group", lang: "php", code: "Route::prefix('v1')->middleware('throttle:api')->group(...);" },
      { label: "Route Definition", lang: "php", code: "Route::get('/posts', [PostController::class, 'index']);" },
      { label: "Resolved URL", lang: "http", code: "GET /api/v1/posts (Rate limit: 60 req/min)" },
    ],
    note: "Route groups enforce clean API versioning, uniform path prefixes, and global security policies across endpoints.",
  },
  m7l2: {
    kind: "pipeline",
    nodes: [
      { label: "Route Wildcard", lang: "http", code: "GET /api/posts/42" },
      { label: "Route Model Binding", lang: "php", code: "public function show(Post $post) {\n  // Post #42 auto-fetched!\n  return $post;\n}" },
      { label: "Missing Model Guard", lang: "json", code: "GET /api/posts/999\n-> HTTP 404 { \"message\": \"Not Found\" }" },
    ],
    note: "Implicit Route Model Binding resolves models from URLs automatically and returns 404 on missing records.",
  },
  m7l3: {
    kind: "pipeline",
    nodes: [
      { label: "Single Declaration", lang: "php", code: "Route::apiResource('posts', PostController::class);" },
      { label: "Generated Endpoints", lang: "http", code: "GET    /posts          -> index\nPOST   /posts          -> store\nGET    /posts/{post}   -> show\nPUT    /posts/{post}   -> update\nDELETE /posts/{post}   -> destroy" },
    ],
    note: "apiResource registers the 5 core REST actions for mobile backends, omitting unused HTML web forms.",
  },
  m7l4: {
    kind: "pipeline",
    nodes: [
      { label: "Dedicated Endpoint", lang: "http", code: "POST /api/checkout" },
      { label: "Invokable Controller", lang: "php", code: "class CheckoutController extends Controller {\n  public function __invoke(CheckoutRequest $req) {\n    // Single-purpose use-case execution\n  }\n}" },
      { label: "Route Mapping", lang: "php", code: "Route::post('/checkout', CheckoutController::class);" },
    ],
    note: "Invokable single-action controllers keep complex business processes isolated, matching Flutter Clean Architecture UseCases.",
  },

  // Track 3
  m8l1: {
    kind: "pipeline",
    nodes: [
      { label: "201 Created", lang: "http", code: "POST /posts -> HTTP 201 Created\nBody: { id: 42, title: '...' }" },
      { label: "422 Unprocessable", lang: "http", code: "POST /posts -> HTTP 422\nBody: { errors: { email: [...] } }" },
    ],
    note: "Status codes tell the mobile HTTP client what happened before JSON parsing begins.",
  },
  m8l2: {
    kind: "pipeline",
    nodes: [
      { label: "Safe & Idempotent (GET)", lang: "http", code: "GET /posts/1\n- Safe: No state mutated\n- Idempotent: Repeatable 100x" },
      { label: "Idempotent Only (PUT/DELETE)", lang: "http", code: "PUT /posts/1\nDELETE /posts/1\n- Changes state, but same end state" },
      { label: "Non-Idempotent (POST)", lang: "http", code: "POST /orders\n- Repeated calls create duplicate records\n- Needs Idempotency-Key" },
    ],
    note: "Understanding idempotency allows mobile clients to safely retry failed network requests without creating duplicate records.",
  },
  m8l3: {
    kind: "pipeline",
    nodes: [
      { label: "Mobile v1 Client", lang: "http", code: "GET /api/v1/posts\n-> Api\\V1\\PostController::class" },
      { label: "Mobile v2 Client", lang: "http", code: "GET /api/v2/posts\n-> Api\\V2\\PostController::class" },
      { label: "Sunset Notice", lang: "http", code: "Sunset: Wed, 11 Nov 2026 00:00:00 GMT\nDeprecation: true" },
    ],
    note: "URI versioning allows legacy mobile app store versions to operate safely alongside modernized API revisions.",
  },
  m8l4: {
    kind: "pipeline",
    nodes: [
      { label: "Collection Sub-route", lang: "http", code: "GET  /posts/42/comments\nPOST /posts/42/comments" },
      { label: "Laravel ->shallow()", lang: "php", code: "Route::apiResource('posts.comments',\n    CommentController::class)->shallow();" },
      { label: "Clean Shallow Endpoints", lang: "http", code: "GET    /comments/99\nPUT    /comments/99\nDELETE /comments/99" },
    ],
    note: "Shallow routing generates hierarchical URLs for collection endpoints and concise, direct URLs for individual resource mutations.",
  },

  m9l1: {
    kind: "pipeline",
    nodes: [
      { label: "FormRequest Rules", lang: "php", code: "return ['email' => 'required|email|unique:users'];" },
      { label: "422 Error Envelope", lang: "json", code: "{\n  \"message\": \"The email has already been taken.\",\n  \"errors\": {\n    \"email\": [\"The email has already been taken.\"]\n  }\n}" },
    ],
    note: "Laravel standardizes validation failures into an error dictionary that maps directly to mobile forms.",
  },
  m9l2: {
    kind: "pipeline",
    nodes: [
      { label: "Incoming Payload", lang: "json", code: "{\n  \"category_id\": 999,\n  \"slug\": \"tech-news\"\n}" },
      { label: "Database Validation", lang: "php", code: "'category_id' => 'exists:categories,id'\n'slug' => 'unique:posts,slug,' . $id" },
      { label: "SQL Integrity Check", lang: "sql", code: "SELECT count(*) FROM categories WHERE id = 999;\n// Fails -> HTTP 422" },
    ],
    note: "Database validation rules verify foreign keys and uniqueness directly in SQL before controller code executes.",
  },
  m9l3: {
    kind: "pipeline",
    nodes: [
      { label: "Laravel 422 JSON", lang: "json", code: "{\n  \"errors\": {\n    \"email\": [\"Email already taken.\"],\n    \"password\": [\"Too short.\"]\n  }\n}" },
      { label: "Dio Interceptor", lang: "dart", code: "final errors = res.data['errors'];\nthrow ValidationException(errors);" },
      { label: "Flutter Form UI", lang: "dart", code: "TextFormField(\n  decoration: InputDecoration(\n    errorText: errors['email']?[0],\n  ),\n)" },
    ],
    note: "A dedicated Dio interceptor parses Laravel's 422 envelope and binds backend validation messages straight into Flutter text fields.",
  },
  m9l4: {
    kind: "pipeline",
    nodes: [
      { label: "Rule Definition", lang: "php", code: "class ValidPhoneNumber implements ValidationRule {\n  public function validate($attr, $val, $fail) {\n    if (!isE164($val)) $fail(\"...\");\n  }\n}" },
      { label: "FormRequest Authorization", lang: "php", code: "public function authorize(): bool {\n  return $this->user()->can('update', $post);\n}" },
      { label: "Guarded Execution", lang: "http", code: "Authorize false -> HTTP 403 Forbidden\nValidation fail -> HTTP 422 Unprocessable" },
    ],
    note: "Custom ValidationRule classes encapsulate reusable business logic, while authorize() guards endpoint access before validation runs.",
  },

  m10l1: {
    kind: "pipeline",
    nodes: [
      { label: "Eloquent Model", lang: "php", code: "$post = Post::find(1);\n// Holds raw DB columns & hidden fields" },
      { label: "JsonResource", lang: "php", code: "return new PostResource($post);\n// Transforms into explicit mobile contract" },
    ],
    note: "API Resources shield mobile apps from internal database schema refactors.",
  },
  m10l2: {
    kind: "pipeline",
    nodes: [
      { label: "Parent Resource", lang: "php", code: "PostResource extends JsonResource {\n  'author' => new UserResource(\n    $this->whenLoaded('author')\n  )\n}" },
      { label: "Query Without Eager Load", lang: "php", code: "Post::all();\n// 'author' key is cleanly omitted" },
      { label: "Query With Eager Load", lang: "php", code: "Post::with('author')->get();\n// 'author' object included without N+1" },
    ],
    note: "whenLoaded() prevents accidental N+1 queries during serialization by omitting unloaded relationships.",
  },
  m10l3: {
    kind: "pipeline",
    nodes: [
      { label: "Paginated Eloquent", lang: "php", code: "$posts = Post::latest()->paginate(15);" },
      { label: "Resource Collection", lang: "php", code: "return PostResource::collection($posts);" },
      { label: "Unified Envelope", lang: "json", code: "{\n  \"data\": [...],\n  \"links\": { \"next\": \"...\" },\n  \"meta\": { \"current_page\": 1, \"total\": 100 }\n}" },
    ],
    note: "Resource collections wrap paginated models with standardized navigation links and page metadata for mobile clients.",
  },
  m10l4: {
    kind: "pipeline",
    nodes: [
      { label: "Success Envelope (200/201)", lang: "json", code: "{\n  \"success\": true,\n  \"message\": \"Post published\",\n  \"data\": { \"id\": 42 }\n}" },
      { label: "Error Envelope (4xx/5xx)", lang: "json", code: "{\n  \"success\": false,\n  \"message\": \"Validation failed\",\n  \"error\": { \"code\": \"VAL_ERR\", \"details\": {...} }\n}" },
      { label: "Dart Generic Consumer", lang: "dart", code: "final response = ApiResponse<PostModel>.fromJson(json);\nif (response.success) show(response.data);" },
    ],
    note: "A consistent response envelope allows the entire Flutter app to deserialize server payloads through a single generic wrapper.",
  },

  m11l1: {
    kind: "schema",
    tables: [USERS_TABLE, TOKENS_TABLE],
    note: "Sanctum hashes personal access tokens using SHA-256 before saving to the database.",
  },
  m11l2: {
    kind: "pipeline",
    nodes: [
      { label: "Mobile Signup", lang: "json", code: "POST /register\n{\n  \"name\": \"Alex\",\n  \"email\": \"alex@flutter.dev\",\n  \"password\": \"secret123\"\n}" },
      { label: "Bcrypt Hash", lang: "php", code: "'password' => Hash::make($req->password)\n// 12-round salted bcrypt hash" },
      { label: "Immediate Token", lang: "php", code: "$token = $user->createToken('mobile')->plainTextToken;\nreturn response()->json(['token' => $token], 201);" },
    ],
    note: "Hash::make() secures passwords with modern one-way hashing; issuing a token on registration eliminates an extra login step.",
  },
  m11l3: {
    kind: "pipeline",
    nodes: [
      { label: "Dio Header", lang: "http", code: "Authorization: Bearer 1|k8f9a2b0c3d4..." },
      { label: "auth:sanctum Middleware", lang: "php", code: "// Hashes token with SHA-256\n// Finds row in personal_access_tokens\n// Binds user to request" },
      { label: "Controller Access", lang: "php", code: "$user = $request->user();\nreturn new UserResource($user);" },
    ],
    note: "The auth:sanctum middleware verifies incoming Bearer tokens statelessly and populates the authenticated User instance.",
  },
  m11l4: {
    kind: "pipeline",
    nodes: [
      { label: "Single Device Logout", lang: "php", code: "$request->user()->currentAccessToken()->delete();\n// Only current phone session revoked" },
      { label: "All Devices Logout", lang: "php", code: "$request->user()->tokens()->delete();\n// Revokes phone, tablet, and web sessions" },
      { label: "Local Cleanup", lang: "dart", code: "await secureStorage.delete(key: 'token');\n// Prevents sending stale tokens" },
    ],
    note: "Sanctum enables granular session invalidation for single device sign-out or account-wide security resets.",
  },
  m11l5: {
    kind: "pipeline",
    nodes: [
      { label: "Scoped Token Creation", lang: "php", code: "$token = $user->createToken('feed-reader',\n  ['posts:read']\n)->plainTextToken;" },
      { label: "Permission Check", lang: "php", code: "if (!$request->user()->tokenCan('posts:create')) {\n  abort(403, 'Forbidden');\n}" },
      { label: "Route Middleware", lang: "php", code: "Route::delete('/posts/{post}')\n  ->middleware('ability:posts:delete');" },
    ],
    note: "Token abilities constrain mobile tokens to specific capabilities, preventing companion widgets or third parties from executing unauthorized actions.",
  },

  m12l1: {
    kind: "pipeline",
    nodes: [
      { label: "Offset Pagination (Slow)", lang: "sql", code: "SELECT * FROM posts OFFSET 100000 LIMIT 15;\n// Scans 100,015 rows!" },
      { label: "Cursor Pagination (Fast)", lang: "sql", code: "SELECT * FROM posts WHERE id < 4220 LIMIT 15;\n// Instant indexed O(1) lookup!" },
    ],
    note: "Cursor pagination is constant time O(1) and prevents duplicate items in infinite scroll feeds.",
  },
  m12l2: {
    kind: "pipeline",
    nodes: [
      { label: "Flutter Feed Scroll", lang: "dart", code: "if (scrollController.position.extentAfter < 300) {\n  loadMore(nextCursor);\n}" },
      { label: "Cursor Request", lang: "http", code: "GET /posts?cursor=eyJpZCI6NDIs... HTTP/1.1" },
      { label: "Paginated Response", lang: "json", code: "{\n  \"data\": [...],\n  \"next_cursor\": \"eyJpZCI6Mjcs...\"\n}" },
    ],
    note: "Infinite scroll feeds store and transmit opaque cursor tokens to stream database records with zero OFFSET degradation.",
  },
  m12l3: {
    kind: "pipeline",
    nodes: [
      { label: "Query Builder", lang: "php", code: "$query = Post::query();" },
      { label: "when() Conditions", lang: "php", code: "->when($req->status, fn($q, $s) => $q->where('status', $s))\n->when($req->tag, fn($q, $t) => $q->whereRelation('tags', 'slug', $t))" },
      { label: "Compiled SQL", lang: "sql", code: "SELECT * FROM posts WHERE status = 'active'\nAND id IN (SELECT post_id FROM post_tag WHERE tag_id = 4);" },
    ],
    note: "Eloquent's when() method cleanly builds conditional SQL WHERE clauses without nested if-else statements.",
  },
  m12l4: {
    kind: "pipeline",
    nodes: [
      { label: "Column Whitelist", lang: "php", code: "$sort = match($req->sort) {\n  'price' => 'price',\n  default => 'created_at',\n};" },
      { label: "FULLTEXT Search", lang: "sql", code: "WHERE MATCH(title, body) AGAINST('laravel flutter' IN NATURAL LANGUAGE MODE)" },
      { label: "Indexed Speed", lang: "http", code: "Executed in 3ms across 2,000,000 rows" },
    ],
    note: "Whitelisting prevents SQL injection and unindexed table scans, while FULLTEXT indexes deliver instant search results.",
  },

  // Track 4
  m13l1: {
    kind: "pipeline",
    nodes: [
      { label: "Dio Multipart", lang: "dart", code: "FormData.fromMap({\n  'avatar': await MultipartFile.fromFile(path)\n});" },
      { label: "Storage Put", lang: "php", code: "$path = $request->file('avatar')->store('avatars', 'public');\n$url = Storage::url($path);" },
    ],
    note: "Multipart uploads stream binary images directly to storage disks without memory bloat.",
  },
  m13l2: {
    kind: "pipeline",
    nodes: [
      { label: "Client Binary", lang: "http", code: "POST /avatar (multipart/form-data)\nHeader: Content-Type: multipart/form-data" },
      { label: "MIME Magic Sniff", lang: "php", code: "'avatar' => ['required', 'image', 'mimes:jpg,png,webp']\n// Validates actual binary header bytes" },
      { label: "Size & Dimensions", lang: "php", code: "'max:2048' // Max 2MB\n'dimensions:min_width=100,max_width=4000'" },
    ],
    note: "The 'image' rule inspects actual file magic bytes to prevent attackers from executing scripts uploaded with false extensions.",
  },
  m13l3: {
    kind: "pipeline",
    nodes: [
      { label: "Local App Storage", lang: "bash", code: "storage/app/public/avatars/abc123.jpg\n(Private by default, blocked from web)" },
      { label: "Symlink Bridge", lang: "bash", code: "php artisan storage:link\n-> Links public/storage to storage/app/public" },
      { label: "Public CDN URL", lang: "http", code: "GET https://api.myapp.com/storage/avatars/abc123.jpg\nRendered in Flutter Image.network(url)" },
    ],
    note: "storage:link exposes storage/app/public to the web root, enabling high-performance direct web server file delivery.",
  },
  m13l4: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Presign Request", sub: "Flutter calls POST /media/presign" },
      { icon: "key", title: "AWS Signature", sub: "Laravel generates signed S3 PUT URL (15 min)" },
      { icon: "upload-cloud", title: "Direct Upload", sub: "Flutter streams video directly to S3 (0 backend RAM)" },
      { icon: "check-circle", title: "S3 200 OK", sub: "AWS confirms upload completion" },
      { icon: "database", title: "Record Link", sub: "Flutter sends S3 key to POST /posts to attach" },
    ],
    note: "Presigned S3 URLs bypass server RAM completely, allowing mobile clients to upload huge files directly to cloud storage.",
  },

  m14l1: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Mobile Request", sub: "POST /checkout" },
      { icon: "server", title: "Controller", sub: "Saves order row in 20ms" },
      { icon: "activity", title: "Queue Job", sub: "SendOrderConfirmationJob dispatched" },
      { icon: "package", title: "Immediate 201", sub: "Mobile displays success screen" },
      { icon: "bell", title: "Worker Process", sub: "FCM Push & Email sent asynchronously" },
    ],
    note: "Background queues keep API responses lightning-fast by offloading heavy work to queue workers.",
  },
  m14l2: {
    kind: "pipeline",
    nodes: [
      { label: "Attempt 1 Failed", lang: "php", code: "// Network timeout to payment gateway\npublic int $tries = 3;" },
      { label: "Exponential Backoff", lang: "php", code: "public array $backoff = [10, 60, 300];\n// Waits 10s, then 1m, then 5m" },
      { label: "failed() Hook", lang: "php", code: "public function failed(Throwable $e) {\n  // Writes to failed_jobs table & alerts team\n}" },
    ],
    note: "Exponential backoff delays retries gracefully during external API downtime before logging to the failed_jobs table.",
  },
  m14l3: {
    kind: "lifecycle",
    steps: [
      { icon: "activity", title: "Trigger Event", sub: "$user->notify(new OrderShipped($order))" },
      { icon: "database", title: "Database Channel", sub: "Inserts in-app alert into notifications table" },
      { icon: "bell", title: "FCM Channel", sub: "Dispatches push payload to Firebase Cloud Messaging" },
      { icon: "globe", title: "Flutter Reception", sub: "FirebaseMessaging.onMessage displays heads-up notification" },
    ],
    note: "A single Laravel Notification class effortlessly targets multiple simultaneous delivery channels including FCM push and database.",
  },
  m14l4: {
    kind: "pipeline",
    nodes: [
      { label: "Step 1: Transcode", lang: "php", code: "new TranscodeVideoJob($video)" },
      { label: "Step 2: Thumbnails", lang: "php", code: "new ExtractThumbnailsJob($video)\n// Runs only if Step 1 succeeds!" },
      { label: "Step 3: Notify", lang: "php", code: "new SendPushNotificationJob($user)\n// Bus::chain guarantees strict order" },
    ],
    note: "Bus::chain() coordinates dependent asynchronous tasks in strict sequence, safely halting if any step encounters failure.",
  },

  m15l1: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Client Call", sub: "GET /feed" },
      { icon: "activity", title: "RateLimiter", sub: "Check 60 req/min quota" },
      { icon: "server", title: "Redis Cache Hit", sub: "Return cached JSON in 2ms" },
    ],
    note: "Rate limiting prevents API denial-of-service; Redis cache-aside eliminates database strain.",
  },
  m15l2: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Flutter Web Call", sub: "Browser initiates GET /api/posts" },
      { icon: "shield-check", title: "OPTIONS Preflight", sub: "Browser sends preflight probe to verify origin" },
      { icon: "server", title: "config/cors.php", sub: "HandleCors matches allowed_origins whitelist" },
      { icon: "check-circle", title: "Preflight 204", sub: "Browser proceeds with real GET request" },
    ],
    note: "CORS preflight requests protect web users; config/cors.php explicitly permits Flutter Web domains to communicate with the API.",
  },
  m15l3: {
    kind: "pipeline",
    nodes: [
      { label: "Tagged Cache", lang: "php", code: "Cache::tags(['posts', 'feed'])->remember(\n  'feed:page:1', 3600, fn() => Post::paginate(15)\n);" },
      { label: "Content Mutation", lang: "php", code: "Post::create($validated);\n// Model Observer or Action triggered" },
      { label: "Instant Invalidation", lang: "php", code: "Cache::tags('feed')->flush();\n// Clears all cached feed pages in 1ms!" },
    ],
    note: "Redis Cache Tags allow you to group related cached responses and flush entire categories in a single operation.",
  },
  m15l4: {
    kind: "pipeline",
    nodes: [
      { label: "Initial Request", lang: "http", code: "GET /profile -> HTTP 200 OK\nHeader: ETag: \"7c8d9e0f1a2b3c4d\"\nFlutter caches hash locally" },
      { label: "Conditional Repeat", lang: "http", code: "GET /profile\nHeader: If-None-Match: \"7c8d9e0f1a2b3c4d\"" },
      { label: "304 Not Modified", lang: "http", code: "HTTP 304 Not Modified (0 bytes transferred!)\nFlutter reuses cached profile instantly" },
    ],
    note: "ETags and 304 Not Modified conditional requests eliminate redundant data transfer, saving mobile battery and bandwidth.",
  },

  m16l1: {
    kind: "pipeline",
    nodes: [
      { label: "Pest Test", lang: "php", code: "$this->actingAs($user, 'sanctum')\n  ->postJson('/api/posts', $data)\n  ->assertStatus(201);" },
      { label: "Database State", lang: "sql", code: "$this->assertDatabaseHas('posts', [\n  'title' => 'My New Post'\n]);" },
    ],
    note: "Automated endpoint tests ensure your mobile API never breaks when backend code evolves.",
  },
  m16l2: {
    kind: "pipeline",
    nodes: [
      { label: "Test Setup", lang: "php", code: "uses(RefreshDatabase::class);\n$user = User::factory()->create();" },
      { label: "Feature Action", lang: "php", code: "$this->actingAs($user, 'sanctum')\n  ->postJson('/api/posts', $data);" },
      { label: "Database Assertion", lang: "sql", code: "$this->assertDatabaseHas('posts', [\n  'user_id' => $user->id,\n  'title' => 'My Post'\n]);" },
    ],
    note: "RefreshDatabase provides complete isolation by rolling back transactions after every test against an in-memory SQLite database.",
  },
  m16l3: {
    kind: "pipeline",
    nodes: [
      { label: "Guest Request", lang: "http", code: "POST /api/posts (No token)\n-> Assert: assertStatus(401)" },
      { label: "Unauthorized Owner", lang: "http", code: "PUT /api/posts/42 (Logged in as Stranger)\n-> Assert: assertStatus(403)" },
      { label: "Authorized Owner", lang: "http", code: "PUT /api/posts/42 (Logged in as Author)\n-> Assert: assertStatus(200)" },
    ],
    note: "Automating guest (401) and forbidden (403) assertions ensures critical API security boundaries are never accidentally removed.",
  },
  m16l4: {
    kind: "pipeline",
    nodes: [
      { label: "Laravel Annotations", lang: "php", code: "/**\n * @group Posts\n * @response 201 { \"id\": 42, \"title\": \"...\" }\n */" },
      { label: "OpenAPI Generator", lang: "bash", code: "php artisan scribe:generate\n-> Produces public/docs/openapi.json" },
      { label: "Dart Client Generator", lang: "bash", code: "flutter pub run swagger_parser\n-> Generates typed PostModel.dart & ApiClient.dart" },
    ],
    note: "OpenAPI specifications keep backend code and Flutter mobile data models perfectly synchronized with zero manual friction.",
  },

  // Track 5: Real-World Architecture & Patterns
  m17l1: {
    kind: "pipeline",
    nodes: [
      { label: "HTTP Request", lang: "http", code: "POST /api/orders\nContent-Type: application/json\n{ \"cart_id\": 88 }" },
      { label: "Thin Controller", lang: "php", code: "public function store(StoreOrderRequest \$req) {\n  return \$this->orderService->processCheckout(\$req->user(), \$req->validated());\n}" },
      { label: "Domain Service", lang: "php", code: "class OrderService {\n  // Orchestrates: calculate, charge Stripe, save DB, fire Event\n}" },
    ],
    note: "Separating HTTP transport from business domain logic makes your application maintainable and reusable in queue workers and CLI commands.",
  },
  m17l2: {
    kind: "pipeline",
    nodes: [
      { label: "Service Layer", lang: "php", code: "class PostService {\n  public function __construct(private PostRepositoryInterface \$repo) {}\n}" },
      { label: "Repository Contract", lang: "php", code: "interface PostRepositoryInterface {\n  public function getPublished(): Collection;\n}" },
      { label: "Eloquent Implementation", lang: "sql", code: "class EloquentPostRepository implements PostRepositoryInterface {\n  // SELECT * FROM posts WHERE is_published = 1\n}" },
    ],
    note: "The repository interface decouples your business domain from database technology, enabling instant mock testing without MySQL.",
  },
  m17l3: {
    kind: "pipeline",
    nodes: [
      { label: "Validated DTO", lang: "php", code: "\$dto = CreateUserDTO::fromRequest(\$request);" },
      { label: "Single-Action Class", lang: "php", code: "class CreateUserAction {\n  public function __invoke(CreateUserDTO \$data): User {\n    return DB::transaction(...);\n  }\n}" },
      { label: "Direct Invocation", lang: "php", code: "\$user = \$createUserAction(\$dto);\n// Reusable in API, Webhooks, Seeders & CLI!" },
    ],
    note: "Invokable Action classes act as single-responsibility UseCases that can be invoked directly as \$action(\$dto).",
  },
  m17l4: {
    kind: "pipeline",
    nodes: [
      { label: "HTTP Payload", lang: "json", code: "{\n  \"title\": \"Enterprise Laravel\",\n  \"is_draft\": false\n}" },
      { label: "FormRequest", lang: "php", code: "\$validated = \$request->validated();\n// Returns loose untyped associative array" },
      { label: "Readonly DTO", lang: "php", code: "readonly class CreatePostDTO {\n  public string \$title;\n  public bool \$isDraft;\n}\n// 100% typed, immutable, full IDE autocomplete!" },
    ],
    note: "Readonly DTOs convert unstructured request arrays into type-safe immutable value objects before entering your domain layer.",
  },

  m18l1: {
    kind: "pipeline",
    nodes: [
      { label: "Model Action", lang: "php", code: "Post::create(['title' => 'Flutter to Laravel']);" },
      { label: "Observer: creating()", lang: "php", code: "\$post->slug = Str::slug(\$post->title);\n// Modifies attributes before DB insert" },
      { label: "Database Insert", lang: "sql", code: "INSERT INTO posts (title, slug) VALUES (...);" },
      { label: "Observer: created()", lang: "php", code: "Cache::forget('latest_posts');\n// Post-persistence cleanup & notifications" },
    ],
    note: "Model Observers intercept lifecycle events (creating, created, deleted) cleanly without cluttering your Eloquent model file.",
  },
  m18l2: {
    kind: "pipeline",
    nodes: [
      { label: "Core Transaction", lang: "php", code: "\$order = Order::create(\$data);\nOrderPlaced::dispatch(\$order);" },
      { label: "Event Dispatcher", lang: "php", code: "Event::dispatch() distributes to all registered listeners" },
      { label: "Listener 1: Mail", lang: "php", code: "SendOrderReceipt::class" },
      { label: "Listener 2: Inventory", lang: "php", code: "UpdateInventoryStock::class" },
    ],
    note: "Events decouple primary operations from side-effects, keeping controller code short and single-responsibility.",
  },
  m18l3: {
    kind: "pipeline",
    nodes: [
      { label: "Event Dispatched", lang: "php", code: "OrderPlaced::dispatch(\$order);" },
      { label: "HTTP Response (15ms)", lang: "http", code: "201 Created -> Returns to Flutter mobile client immediately!" },
      { label: "Redis Queue", lang: "bash", code: "Queued: SendPushNotificationListener (ShouldQueue)" },
      { label: "Worker Process", lang: "bash", code: "php artisan queue:work\n-> Executes FCM Push in background" },
    ],
    note: "Queued event listeners move slow operations (emails, push notifications, webhooks) out of the HTTP thread into background workers.",
  },
  m18l4: {
    kind: "pipeline",
    nodes: [
      { label: "Command", lang: "php", code: "\$wallet->deposit(amount: 5000);" },
      { label: "Domain Event", lang: "php", code: "FundsDeposited { amount: 5000, timestamp: 1727769600 }" },
      { label: "Append-Only Event Store", lang: "sql", code: "INSERT INTO stored_events (event_name, event_data) VALUES (...);" },
      { label: "Projected Read Model", lang: "sql", code: "Current Balance = SUM(all past deposit & withdrawal events)" },
    ],
    note: "Event Sourcing records every state change as an immutable event, providing a tamper-proof audit trail for financial transactions.",
  },

  m19l1: {
    kind: "pipeline",
    nodes: [
      { label: "Incoming Request", lang: "http", code: "GET /api/admin/metrics\nAuthorization: Bearer <token>" },
      { label: "Authentication (401)", lang: "php", code: "Is token valid? No -> 401 Unauthorized\nYes -> \$user identified" },
      { label: "Authorization (403)", lang: "php", code: "Does \$user have 'view-metrics' gate? No -> 403 Forbidden\nYes -> Proceed" },
    ],
    note: "401 means 'identify yourself' (Authentication). 403 means 'you are identified, but lack permission' (Authorization).",
  },
  m19l2: {
    kind: "pipeline",
    nodes: [
      { label: "Mobile Client", lang: "http", code: "PUT /api/posts/42\nAuthorization: Bearer token_bob" },
      { label: "Controller Check", lang: "php", code: "\$this->authorize('update', \$post);" },
      { label: "PostPolicy@update", lang: "php", code: "public function update(User \$user, Post \$post) {\n  return \$user->id === \$post->user_id;\n}" },
      { label: "Security Verdict", lang: "http", code: "Bob !== Alice (Author) -> Abort 403 Forbidden!" },
    ],
    note: "Policies organize resource permissions into dedicated classes, preventing unauthorized data tampering across all endpoints.",
  },
  m19l3: {
    kind: "pipeline",
    nodes: [
      { label: "User Entity", lang: "php", code: "\$user = User::find(1);\n\$user->assignRole('editor');" },
      { label: "Spatie Permission Map", lang: "sql", code: "Role: editor -> Permissions: ['posts.edit', 'posts.publish']" },
      { label: "Route Middleware", lang: "php", code: "Route::post('/publish', ...)->middleware('permission:posts.publish');" },
    ],
    note: "Role-Based Access Control maps users to roles and roles to granular permissions, fully cached in Redis for fast checks.",
  },
  m19l4: {
    kind: "pipeline",
    nodes: [
      { label: "Token Generation", lang: "php", code: "\$user->createToken('widget', ['posts:read']);" },
      { label: "Request with Token", lang: "http", code: "DELETE /api/posts/42\nAuthorization: Bearer <widget_token>" },
      { label: "Ability Inspection", lang: "php", code: "\$request->user()->tokenCan('posts:delete') === false" },
      { label: "Enforced Boundary", lang: "http", code: "HTTP 403: 'Token lacks required ability'" },
    ],
    note: "Sanctum token abilities restrict what a specific API token can do, even if the parent user account holds broader admin privileges.",
  },

  m20l1: {
    kind: "pipeline",
    nodes: [
      { label: "Domain Rule Violation", lang: "php", code: "if (\$cart->total > \$balance) {\n  throw new InsufficientFundsException(\$balance, \$cart->total);\n}" },
      { label: "Exception render()", lang: "php", code: "public function render(\$request) {\n  return response()->json(['error' => 'INSUFFICIENT_FUNDS'], 422);\n}" },
      { label: "Flutter Client", lang: "json", code: "HTTP 422: {\n  \"error\": \"INSUFFICIENT_FUNDS\",\n  \"available\": 2000,\n  \"required\": 4500\n}" },
    ],
    note: "Self-rendering domain exceptions transform domain rule failures into clean, structured HTTP responses without controller clutter.",
  },
  m20l2: {
    kind: "pipeline",
    nodes: [
      { label: "Uncaught Exception", lang: "php", code: "ModelNotFoundException / Fatal Error" },
      { label: "bootstrap/app.php", lang: "php", code: "->withExceptions(function (Exceptions \$exceptions) {\n  \$exceptions->render(fn(NotFoundHttpException \$e, \$req) => ...);\n})" },
      { label: "Guaranteed JSON", lang: "json", code: "{\n  \"error\": \"RESOURCE_NOT_FOUND\",\n  \"message\": \"Record not found\"\n} (HTTP 404)" },
    ],
    note: "Centralized exception handling in bootstrap/app.php prevents raw HTML error pages from breaking mobile JSON decoders.",
  },
  m20l3: {
    kind: "pipeline",
    nodes: [
      { label: "Application Event", lang: "php", code: "Log::withContext(['request_id' => \$reqId]);" },
      { label: "Structured Logging", lang: "php", code: "Log::warning('Payment failed', ['cart_id' => 12, 'gateway' => 'stripe']);" },
      { label: "Log Channels", lang: "bash", code: "storage/logs/laravel.log (JSON format)\nSlack / Discord Webhook (Critical alerts)" },
    ],
    note: "Structured contextual logging replaces unsearchable text logs with queryable JSON objects indexed in log aggregators.",
  },
  m20l4: {
    kind: "pipeline",
    nodes: [
      { label: "Flutter Mobile App", lang: "dart", code: "Dio sends: 'traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736...'" },
      { label: "Laravel API Span", lang: "php", code: "Sentry middleware continues distributed trace across HTTP & SQL queries" },
      { label: "Exception / 500", lang: "php", code: "Sentry captures stack trace, bindings, user context & sends to dashboard" },
    ],
    note: "Distributed tracing connects mobile client events directly to backend database queries and exceptions in a unified timeline.",
  },
  m21l1: {
    kind: "pipeline",
    nodes: [
      { label: "Parent Models", lang: "php", code: "Post::class (id: 42) & Video::class (id: 19)" },
      { label: "MorphMap Aliasing", lang: "php", code: "Relation::enforceMorphMap([\n  'post' => Post::class,\n  'video' => Video::class\n]);" },
      { label: "Comments Table", lang: "sql", code: "commentable_type: 'post' | commentable_id: 42\ncommentable_type: 'video' | commentable_id: 19" },
    ],
    note: "Polymorphic relations allow a single comments table to attach to multiple entity types safely via morphMap aliases.",
  },
  m21l2: {
    kind: "pipeline",
    nodes: [
      { label: "Soft Deletes", lang: "php", code: "\$user->delete(); // sets deleted_at timestamp" },
      { label: "Prunable Trait", lang: "php", code: "public function prunable() {\n  return static::where('deleted_at', '<=', now()->subDays(30));\n}" },
      { label: "Artisan Daemon", lang: "bash", code: "php artisan model:prune\n// Automatically purges expired rows permanently" },
    ],
    note: "Model Pruning automatically sweeps soft-deleted or stale records from the database in memory-efficient batches.",
  },
  m21l3: {
    kind: "pipeline",
    nodes: [
      { label: "Traditional ->get()", lang: "php", code: "User::all(); // 1,000,000 rows in RAM -> Out of Memory! (1.2GB)" },
      { label: "LazyCollection ->lazy()", lang: "php", code: "User::lazy(1000)->each(fn (\$u) => ...); // Uses PHP Generators" },
      { label: "DB Cursor ->cursor()", lang: "php", code: "User::cursor(); // Single SQL cursor stream (Flat 12MB RAM usage)" },
    ],
    note: "Cursors and LazyCollections stream millions of database rows sequentially with a constant low memory footprint.",
  },
  m21l4: {
    kind: "pipeline",
    nodes: [
      { label: "JSON DB Column", lang: "sql", code: "settings JSONB DEFAULT '{\"theme\": \"dark\", \"notifications\": {\"push\": true}}'" },
      { label: "Eloquent Model Cast", lang: "php", code: "protected \$casts = [\n  'settings' => AsArrayObject::class,\n  'status' => UserStatus::class\n];" },
      { label: "Object Access & Mutation", lang: "php", code: "\$user->settings['theme'] = 'cyberpunk';\n\$user->save(); // Automatically serialized to JSON" },
    ],
    note: "AsArrayObject and PHP 8.1+ backed Enums provide typed, mutable object access to JSON columns without manual encoding.",
  },
  m22l1: {
    kind: "pipeline",
    nodes: [
      { label: "Query Intent", lang: "dart", code: "Find users who have at least 1 completed order over \$100" },
      { label: "Correlated Subquery", lang: "php", code: "User::whereExists(function (\$query) {\n  \$query->select(DB::raw(1))\n    ->from('orders')\n    ->whereColumn('orders.user_id', 'users.id')\n    ->where('total_usd', '>', 100);\n})->get();" },
      { label: "Optimized SQL", lang: "sql", code: "SELECT * FROM users WHERE EXISTS (\n  SELECT 1 FROM orders WHERE orders.user_id = users.id AND total_usd > 100\n);" },
    ],
    note: "whereExists and DB::raw produce ultra-efficient correlated subqueries that stop scanning immediately upon the first match.",
  },
  m22l2: {
    kind: "pipeline",
    nodes: [
      { label: "Unindexed Query", lang: "sql", code: "Seq Scan on orders (cost=0.00..38520.00 rows=42 width=64) [Time: 420ms]" },
      { label: "Composite Index", lang: "php", code: "\$table->index(['tenant_id', 'status', 'created_at']);" },
      { label: "Index Scan (EXPLAIN)", lang: "sql", code: "Index Scan using orders_tenant_status_created_idx (cost=0.42..8.44) [Time: 1.2ms]" },
    ],
    note: "EXPLAIN ANALYZE unmasks full sequential table scans and proves 100x speedups with composite B-Tree indexes.",
  },
  m22l3: {
    kind: "pipeline",
    nodes: [
      { label: "Race Condition", lang: "dart", code: "Two simultaneous requests try to withdraw \$50 from a \$60 balance" },
      { label: "Pessimistic Lock", lang: "php", code: "DB::transaction(function () {\n  \$wallet = Wallet::where('id', 1)->lockForUpdate()->first();\n  \$wallet->balance -= 50;\n  \$wallet->save();\n});" },
      { label: "Row-Level DB Lock", lang: "sql", code: "SELECT * FROM wallets WHERE id = 1 FOR UPDATE; -- Blocks 2nd transaction" },
    ],
    note: "lockForUpdate acquires row-level locks inside database transactions, preventing double-spend race conditions.",
  },
  m22l4: {
    kind: "pipeline",
    nodes: [
      { label: "DB Query Listener", lang: "php", code: "DB::whenQueryingForLongerThan(500, function (\$connection) {\n  Log::warning('Slow query detected', ['time' => \$connection->totalQueryDuration()]);\n});" },
      { label: "Query Execution", lang: "sql", code: "SELECT * FROM large_table WHERE unindexed_col = 'test'; // 840ms" },
      { label: "Pulse / Sentry Alert", lang: "bash", code: "ALERT [Laravel Pulse]: Slow query 840ms on /api/v1/feed dispatched to Slack" },
    ],
    note: "Proactive query duration thresholds trigger real-time telemetry alerts before slow queries impact user experience.",
  },
  m23l1: {
    kind: "pipeline",
    nodes: [
      { label: "Mobile Client", lang: "dart", code: "Dio headers: {'X-Tenant-ID': 'acme-corp'}" },
      { label: "Tenant Middleware", lang: "php", code: "\$tenant = Tenant::where('subdomain', \$slug)->firstOrFail();\ntenant_manager()->setCurrentTenant(\$tenant);" },
      { label: "Data Isolation Strategy", lang: "bash", code: "Single DB (Shared columns + Scopes) OR Multi DB (Dynamic Connection switching)" },
    ],
    note: "Multi-tenancy identifies the organization from the incoming request and isolates all Eloquent queries accordingly.",
  },
  m23l2: {
    kind: "pipeline",
    nodes: [
      { label: "Global Tenant Scope", lang: "php", code: "class TenantScope implements Scope {\n  public function apply(Builder \$b, Model \$m) {\n    \$b->where('tenant_id', current_tenant_id());\n  }\n}" },
      { label: "Eloquent Query", lang: "php", code: "Invoice::all(); // Query automatically becomes WHERE tenant_id = 42" },
      { label: "Admin Bypass", lang: "php", code: "Invoice::withoutGlobalScope(TenantScope::class)->get();" },
    ],
    note: "Global Scopes transparently append tenant constraints to every query, making multi-tenant data leaks impossible.",
  },
  m23l3: {
    kind: "pipeline",
    nodes: [
      { label: "App Middleware", lang: "sql", code: "SET LOCAL app.current_tenant_id = 'org_987';" },
      { label: "PostgreSQL RLS Policy", lang: "sql", code: "CREATE POLICY tenant_isolation_policy ON invoices\nFOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::int);" },
      { label: "Engine-Level Guarantee", lang: "bash", code: "Even raw SQL 'SELECT * FROM invoices' returns only org_987 rows!" },
    ],
    note: "PostgreSQL Row-Level Security (RLS) enforces tenant boundaries at the database engine level, independent of application code.",
  },
  m23l4: {
    kind: "pipeline",
    nodes: [
      { label: "Super Admin Request", lang: "dart", code: "GET /api/v1/admin/analytics/total-mrr" },
      { label: "Tenant Aggregation", lang: "php", code: "Tenant::chunk(50, function (\$tenants) {\n  foreach (\$tenants as \$tenant) {\n    \$tenant->execute(fn () => Invoice::paid()->sum('amount_cents'));\n  }\n});" },
      { label: "Aggregated Metrics", lang: "json", code: "{\"total_mrr_usd\": 148500, \"active_tenants\": 312, \"status\": \"success\"}" },
    ],
    note: "Super-admin reporting iterates through isolated tenant partitions to compute global platform revenue and health metrics.",
  },
  m24l1: {
    kind: "pipeline",
    nodes: [
      { label: "1. Expand (Additive)", lang: "php", code: "Schema::table('users', fn (\$t) => \$t->string('new_phone')->nullable());" },
      { label: "2. Dual-Write Code", lang: "php", code: "\$user->phone = \$val; \$user->new_phone = \$val; // Deploy code" },
      { label: "3. Contract (Cleanup)", lang: "php", code: "Schema::table('users', fn (\$t) => \$t->dropColumn('phone'));" },
    ],
    note: "The Expand and Contract pattern eliminates migration lockups and prevents 500 errors during rolling zero-downtime deployments.",
  },
  m24l2: {
    kind: "pipeline",
    nodes: [
      { label: "Schema Created", lang: "sql", code: "ALTER TABLE transactions ADD COLUMN uuid UUID NULL;" },
      { label: "Queued Backfill Job", lang: "php", code: "BackfillTransactionUuids::dispatch(\$startId, \$endId)->onQueue('migrations');" },
      { label: "Throttled Worker", lang: "bash", code: "Processes 5,000 rows/sec without locking master DB or exhausting IOPS" },
    ],
    note: "Asynchronous backfilling populates large tables in throttled background queue batches instead of blocking blocking migration steps.",
  },
  m24l3: {
    kind: "pipeline",
    nodes: [
      { label: "Legacy Migrations", lang: "bash", code: "database/migrations/ (280 migration files, takes 45s to migrate:fresh)" },
      { label: "Artisan Squashing", lang: "bash", code: "php artisan schema:dump --prune" },
      { label: "Single SQL Schema", lang: "sql", code: "database/schema/pgsql-schema.sql (Instant 1.2s fresh setup for CI & dev)" },
    ],
    note: "Schema dumping squashes years of incremental migrations into a single high-performance schema file.",
  },
  m24l4: {
    kind: "pipeline",
    nodes: [
      { label: "Continuous WAL Archiving", lang: "bash", code: "PostgreSQL WAL (Write-Ahead Logs) continuously streamed to S3 bucket" },
      { label: "Accidental DROP TABLE", lang: "sql", code: "DROP TABLE payments; -- Occurred at 2026-10-01 14:32:15 UTC" },
      { label: "PITR Replay", lang: "bash", code: "recovery_target_time = '2026-10-01 14:32:14 UTC'\n// Restores state to 1 second before disaster" },
    ],
    note: "Point-in-Time Recovery (PITR) replays Write-Ahead Logs to restore database state to the exact second prior to corruption.",
  },
};

/* ----------------------------- helpers ---------------------------- */

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export const totalLessons = allLessons.length;

export const totalXp =
  allLessons.reduce((s, l) => s + l.xp + (l.challenge.xp ?? 25), 0);

export function moduleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function lessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function moduleOfLesson(lessonId: string): Module | undefined {
  return modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function nextLessonOf(lessonId: string): Lesson | undefined {
  const i = allLessons.findIndex((l) => l.id === lessonId);
  return i >= 0 ? allLessons[i + 1] : undefined;
}

export function isLessonUnlocked(lessonId: string, completed: string[]): boolean {
  const i = allLessons.findIndex((l) => l.id === lessonId);
  if (i <= 0) return true;
  return completed.includes(allLessons[i - 1].id);
}

export function isModuleUnlocked(moduleId: string, completed: string[]): boolean {
  const i = modules.findIndex((m) => m.id === moduleId);
  if (i <= 0) return true;
  return modules[i - 1].lessons.every((l) => completed.includes(l.id));
}

export function moduleProgress(m: Module, completed: string[]) {
  const done = m.lessons.filter((l) => completed.includes(l.id)).length;
  return { done, total: m.lessons.length, pct: Math.round((done / m.lessons.length) * 100) };
}

export function firstIncompleteLesson(completed: string[]): Lesson {
  return allLessons.find((l) => !completed.includes(l.id)) ?? allLessons[0];
}

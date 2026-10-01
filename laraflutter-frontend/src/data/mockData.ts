export interface FlutterParallel {
  concept: string;
  flutterCode: string;
  laravelCode: string;
  explanation: string;
}

export interface Challenge {
  type: "mcq" | "drag-drop" | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  items?: string[]; // for drag-drop
  blanks?: string[]; // for fill-blank
}

export interface TableColumn {
  name: string;
  type: string;
  constraints?: string[];
}

export interface SchemaTable {
  name: string;
  columns: TableColumn[];
  relations?: { table: string; via: string }[];
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

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  totalXp: number;
}

export const modules: Module[] = [
  {
    id: "module-1",
    title: "Relational Database Design & Schema Architecture",
    description:
      "Master the building blocks of relational databases: tables, foreign keys, normalization, and how data is structured on the server.",
    icon: "Database",
    color: "from-violet-600 to-purple-700",
    totalXp: 300,
    lessons: [
      {
        id: "lesson-1-1",
        moduleId: "module-1",
        title: "Tables, Rows & Columns — The Flutter Model's Backend Twin",
        readTime: "6 min",
        xp: 100,
        summary:
          "Understand how a SQL database table maps directly to a Dart model class, and why relational structure beats nested JSON for scalability.",
        flutterParallel: {
          concept: "Dart Model Class vs. SQL Table",
          flutterCode: `// Flutter: Dart Model Class
class User {
  final int id;
  final String name;
  final String email;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}`,
          laravelCode: `-- SQL: users table (MySQL/PostgreSQL)
CREATE TABLE users (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)    NOT NULL,
  email       VARCHAR(255)    NOT NULL UNIQUE,
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Each column = a field in your Dart model
-- Each row    = one User instance
-- PRIMARY KEY = the 'id' you parse with fromJson`,
          explanation:
            "A database table is essentially a blueprint — like a Dart class — while each row is an instance. The columns define the schema, just like class fields. The big difference? The database enforces types, uniqueness, and relationships at the data layer, not just in your app.",
        },
        content: [
          "A **relational database** organizes data into tables (think spreadsheets) where each table has a fixed schema of typed columns.",
          "**Primary Keys (PK):** Every table should have a unique identifier — typically an auto-incrementing `id` or a UUID. This is what you use in your Flutter `fromJson` to distinguish records.",
          "**Data Types matter:** `VARCHAR(255)` for strings, `BIGINT` for large integers, `BOOLEAN` for true/false, `TIMESTAMP` for dates. Mismatching types causes silent bugs.",
          "**NULL vs NOT NULL:** Marking a column `NOT NULL` is like Dart's non-nullable types — it enforces data integrity at the database level, before Laravel or Flutter ever touch it.",
          "**Indexes** speed up `SELECT` queries on columns you frequently filter by (e.g., `email`, `user_id`). Without them, the DB scans every row — catastrophic at scale.",
        ],
        challenge: {
          type: "mcq",
          question:
            "In SQL, what is the equivalent of a Dart class's non-nullable field (e.g., `required String name`)?",
          options: [
            "A column with DEFAULT NULL",
            "A column with NOT NULL constraint",
            "A column with PRIMARY KEY",
            "A column with UNIQUE constraint",
          ],
          correctAnswer: 1,
          explanation:
            "NOT NULL constraint ensures the column always has a value, just like Dart's `required` keyword prevents null values in a constructor. DEFAULT NULL would allow empty values.",
        },
        schema: [
          {
            name: "users",
            columns: [
              { name: "id", type: "BIGINT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
              { name: "name", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
              { name: "email", type: "VARCHAR(255)", constraints: ["NOT NULL", "UNIQUE"] },
              { name: "created_at", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"] },
            ],
          },
        ],
      },
      {
        id: "lesson-1-2",
        moduleId: "module-1",
        title: "Foreign Keys & Relationships — Linking Tables Like a Pro",
        readTime: "7 min",
        xp: 100,
        summary:
          "Learn how foreign keys create typed, enforced links between tables — the server-side equivalent of referencing a nested object in Flutter.",
        flutterParallel: {
          concept: "Nested Object Reference vs. Foreign Key",
          flutterCode: `// Flutter: Nested object (no enforcement)
class Post {
  final int id;
  final String title;
  final User author; // Entire object embedded

  Post({required this.id, required this.title, required this.author});
}

// Problem: What if author is deleted?
// Flutter has no built-in referential integrity.
// You must handle this manually in your API.`,
          laravelCode: `-- SQL: posts table with foreign key
CREATE TABLE posts (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title      VARCHAR(255)    NOT NULL,
  body       TEXT            NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,  -- FK reference
  created_at TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE  -- Auto-delete posts when user deleted
);

-- The DB enforces: you CANNOT insert a post
-- with a user_id that doesn't exist in users.`,
          explanation:
            "Instead of embedding a full User object inside a Post (like Flutter does with nested models), SQL stores just the `user_id` — a reference (foreign key). The database ENFORCES this link: you cannot have a post pointing to a non-existent user. `ON DELETE CASCADE` means deleting a user auto-deletes all their posts.",
        },
        content: [
          "A **Foreign Key (FK)** is a column that references the Primary Key of another table. It's how tables 'talk' to each other.",
          "**Referential Integrity:** The DB rejects inserts/updates that would create orphaned records. Try inserting `posts.user_id = 999` when no user with id=999 exists → constraint error.",
          "**ON DELETE options:** `CASCADE` (delete children), `RESTRICT` (block parent deletion), `SET NULL` (nullify FK), `NO ACTION` (same as RESTRICT). Choose based on your business logic.",
          "**One-to-Many:** One user → many posts. The FK lives on the 'many' side (`posts.user_id`). This is the most common relationship.",
          "**Many-to-Many:** Users ↔ Roles. Requires a **pivot/junction table** (`user_roles`) with two FKs. This is what Eloquent's `belongsToMany` handles.",
          "**Normalization** means avoiding data duplication. Instead of storing `author_name` in every post row, you store `user_id` and JOIN when needed.",
        ],
        challenge: {
          type: "mcq",
          question:
            "In a one-to-many relationship between `users` and `posts`, where does the foreign key column live?",
          options: [
            "In the users table as posts_id",
            "In a separate junction table",
            "In the posts table as user_id",
            "In both tables mirrored",
          ],
          correctAnswer: 2,
          explanation:
            "The foreign key always lives on the 'many' side. Since one user has many posts, `posts` is the 'many' side — so `posts.user_id` references `users.id`. This prevents data duplication and is the foundation of relational design.",
        },
        schema: [
          {
            name: "users",
            columns: [
              { name: "id", type: "BIGINT", constraints: ["PRIMARY KEY"] },
              { name: "name", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
              { name: "email", type: "VARCHAR(255)", constraints: ["UNIQUE"] },
            ],
            relations: [{ table: "posts", via: "users.id → posts.user_id" }],
          },
          {
            name: "posts",
            columns: [
              { name: "id", type: "BIGINT", constraints: ["PRIMARY KEY"] },
              { name: "title", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
              { name: "body", type: "TEXT", constraints: [] },
              { name: "user_id", type: "BIGINT", constraints: ["FK → users.id", "NOT NULL"] },
            ],
          },
        ],
      },
      {
        id: "lesson-1-3",
        moduleId: "module-1",
        title: "Normalization — Designing a Schema That Scales",
        readTime: "8 min",
        xp: 100,
        summary:
          "Explore 1NF, 2NF, and 3NF through practical examples, and understand why flat JSON responses from Flutter APIs can hide deeply inefficient database designs.",
        flutterParallel: {
          concept: "Denormalized JSON vs. Normalized Tables",
          flutterCode: `// Flutter API response (denormalized - BAD)
{
  "post_id": 1,
  "title": "My First Post",
  "author_name": "Alice",        // Duplicated!
  "author_email": "alice@x.com", // In every post row!
  "category_name": "Laravel",    // What if it changes?
}

// If Alice changes her email, you need to update
// EVERY post row in the database. 😱`,
          laravelCode: `-- Normalized schema (GOOD)
-- users table: single source of truth for author data
-- categories table: single source of truth for category
-- posts table: only stores what's unique to posts

SELECT
  posts.id,
  posts.title,
  users.name  AS author_name,
  users.email AS author_email,
  categories.name AS category_name
FROM posts
JOIN users      ON posts.user_id      = users.id
JOIN categories ON posts.category_id  = categories.id;
-- Alice updates email once in users → all posts reflect it`,
          explanation:
            "Normalization eliminates data redundancy. Your Flutter app might display `author_name` in every post card — but the DB only stores it ONCE in the `users` table. Laravel's Eloquent relationships (with, load) handle fetching related data efficiently via JOINs, keeping your schema clean and your data consistent.",
        },
        content: [
          "**1NF (First Normal Form):** Each column holds atomic (indivisible) values. No arrays or comma-separated lists in a single column.",
          "**2NF:** Every non-key column must depend on the ENTIRE primary key (eliminates partial dependencies). Applies to composite PKs.",
          "**3NF:** No transitive dependencies — non-key columns must depend ONLY on the PK, not on other non-key columns.",
          "**Practical rule:** If you're copying the same data into multiple rows, you need a new table and a FK reference.",
          "**The JOIN trade-off:** Normalized data requires JOINs to reassemble, which adds query complexity but gains consistency and write efficiency. Eloquent's eager loading (`with()`) abstracts this beautifully.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Fill in the blank: Storing `author_email` directly in the `posts` table instead of using a `user_id` foreign key violates database _____, leading to update anomalies.",
          blanks: ["normalization"],
          correctAnswer: "normalization",
          explanation:
            "Storing author data directly in the posts table violates normalization principles — specifically the 'single source of truth' rule. If Alice changes her email, you'd need to update every one of her posts instead of just her users row.",
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "The Server-Side Lifecycle",
    description:
      "Demystify routing, middleware, HTTP verbs, and how a Laravel server processes a request from Flutter client to database and back.",
    icon: "Server",
    color: "from-blue-600 to-cyan-600",
    totalXp: 200,
    lessons: [
      {
        id: "lesson-2-1",
        moduleId: "module-2",
        title: "HTTP Verbs — What Your Flutter http Package Is Actually Doing",
        readTime: "5 min",
        xp: 100,
        summary:
          "Map familiar Flutter HTTP calls (GET, POST, PUT, DELETE) to Laravel routes and understand the RESTful conventions that govern API design.",
        flutterParallel: {
          concept: "Flutter http calls vs. Laravel Route Definitions",
          flutterCode: `import 'package:http/http.dart' as http;

// GET  — Fetch a list
final res = await http.get(Uri.parse('/api/posts'));

// POST — Create new resource
final res = await http.post(
  Uri.parse('/api/posts'),
  body: jsonEncode({'title': 'New Post', 'body': '...'}),
  headers: {'Content-Type': 'application/json'},
);

// PUT  — Replace entire resource
final res = await http.put(
  Uri.parse('/api/posts/1'),
  body: jsonEncode({'title': 'Updated', 'body': '...'}),
);

// DELETE — Remove resource
final res = await http.delete(Uri.parse('/api/posts/1'));`,
          laravelCode: `// Laravel: routes/api.php
use App\\Http\\Controllers\\PostController;

// Each Flutter call maps to one Route
Route::get('/posts',        [PostController::class, 'index']);
Route::post('/posts',       [PostController::class, 'store']);
Route::get('/posts/{id}',   [PostController::class, 'show']);
Route::put('/posts/{id}',   [PostController::class, 'update']);
Route::delete('/posts/{id}',[PostController::class, 'destroy']);

// Or even cleaner — one line generates all 5 routes:
Route::apiResource('posts', PostController::class);`,
          explanation:
            "Every `http.get()` or `http.post()` in Flutter lands on a specific route in Laravel's `routes/api.php`. Laravel uses the HTTP verb + URL path combination to determine which controller method handles the request. `Route::apiResource` is a shortcut that generates all standard RESTful routes automatically.",
        },
        content: [
          "**GET:** Retrieves data. Should be idempotent — calling it 100 times returns the same result and changes nothing.",
          "**POST:** Creates a new resource. Non-idempotent — calling it twice creates two records.",
          "**PUT/PATCH:** Updates a resource. PUT replaces the entire resource; PATCH updates only provided fields.",
          "**DELETE:** Removes a resource. Usually returns 204 No Content on success.",
          "**RESTful conventions:** `/api/posts` (collection) vs `/api/posts/{id}` (single resource). Laravel's route model binding auto-fetches the model by ID.",
          "**Status Codes:** 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 500 Server Error.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Your Flutter app sends `http.patch('/api/users/5', body: {'name': 'Bob'})`. Which Laravel route handles this?",
          options: [
            "Route::put('/users/{id}', ...)",
            "Route::post('/users', ...)",
            "Route::patch('/users/{id}', ...)",
            "Route::get('/users/{id}', ...)",
          ],
          correctAnswer: 2,
          explanation:
            "PATCH maps to `Route::patch()`. While PATCH and PUT both update resources, PATCH is for partial updates (only the fields you send), while PUT replaces the entire resource. Laravel's `apiResource` generates both `update` (PUT) and `update` (PATCH) routes.",
        },
      },
      {
        id: "lesson-2-2",
        moduleId: "module-2",
        title: "Middleware — The Airport Security of Your API",
        readTime: "6 min",
        xp: 100,
        summary:
          "Understand how Laravel middleware intercepts requests before they reach your controller — handling auth, CORS, rate limiting, and logging.",
        flutterParallel: {
          concept: "Flutter Dio Interceptor vs. Laravel Middleware",
          flutterCode: `// Flutter: Dio Interceptor (client-side middleware)
dio.interceptors.add(
  InterceptorsWrapper(
    onRequest: (options, handler) {
      // Add auth token to every request
      final token = storage.read('token');
      options.headers['Authorization'] = 'Bearer \$token';
      return handler.next(options);
    },
    onError: (error, handler) {
      if (error.response?.statusCode == 401) {
        // Redirect to login
        navigateTo('/login');
      }
      return handler.next(error);
    },
  ),
);`,
          laravelCode: `// Laravel: app/Http/Middleware/EnsureTokenIsValid.php
namespace App\\Http\\Middleware;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next)
    {
        // Check before controller runs
        if (!$request->bearerToken()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Pass to next middleware or controller
        return $next($request);
    }
}

// Apply to routes in api.php:
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});`,
          explanation:
            "Laravel middleware is identical in concept to Dio interceptors — code that runs BEFORE your main handler. The difference is it runs SERVER-SIDE, so every client (Flutter, web, Postman) is protected by the same rules. The middleware chain runs in sequence; if any returns early (e.g., 401), your controller never executes.",
        },
        content: [
          "**Middleware stack:** Laravel runs multiple middleware in sequence. Built-in ones include: `TrimStrings`, `ConvertEmptyStringsToNull`, `ValidatePostSize`, `ThrottleRequests`.",
          "**`auth:sanctum`:** Verifies the Bearer token in `Authorization` header. If invalid → 401 response, controller never runs.",
          "**CORS Middleware:** Handles `Access-Control-Allow-Origin` headers so your Flutter web or different-domain app can call the API.",
          "**Rate Limiting:** `ThrottleRequests:60,1` allows 60 requests per minute per user/IP. Returns 429 Too Many Requests when exceeded.",
          "**Route Groups:** Apply middleware to multiple routes at once using `Route::middleware()->group()`. Clean and DRY.",
          "**Custom Middleware:** `php artisan make:middleware CheckSubscription` generates a stub. Add your logic in `handle()` method.",
        ],
        challenge: {
          type: "drag-drop",
          question:
            "Arrange the Laravel request lifecycle steps in the correct order (drag to sort):",
          items: [
            "HTTP Request arrives at server",
            "Global middleware runs (CORS, TrimStrings)",
            "Route is matched (api.php)",
            "Route-specific middleware runs (auth:sanctum)",
            "Controller method executes",
            "Response is returned to Flutter",
          ],
          correctAnswer: "0,1,2,3,4,5",
          explanation:
            "Laravel processes requests in this exact sequence: Global middleware → Route matching → Route middleware → Controller. Each layer can short-circuit the chain by returning a response early (e.g., auth middleware returning 401).",
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Database Migrations & Eloquent ORM",
    description:
      "Learn how Laravel manages database schema changes over time with migrations, and how Eloquent ORM lets you interact with your database using expressive PHP — no raw SQL required.",
    icon: "GitBranch",
    color: "from-emerald-600 to-teal-600",
    totalXp: 300,
    lessons: [
      {
        id: "lesson-3-1",
        moduleId: "module-3",
        title: "Migrations — Version Control for Your Database",
        readTime: "7 min",
        xp: 100,
        summary:
          "Understand Laravel migrations as the database equivalent of Git commits — each migration is a versioned, reversible schema change that the whole team can run.",
        flutterParallel: {
          concept: "Flutter pubspec.yaml versions vs. Laravel Migrations",
          flutterCode: `# Flutter: pubspec.yaml tracks package versions
# But there's NO equivalent for database schema changes!

# If your backend team adds a new 'bio' column
# and you're testing locally, you have to:
# 1. Manually ALTER TABLE in MySQL Workbench
# 2. Hope your teammate does the same
# 3. Update your Dart model
# 4. Pray prod database is also updated 😅

# This is the problem Laravel Migrations solve.`,
          laravelCode: `// Laravel Migration file (auto-generated)
// database/migrations/2024_01_15_create_posts_table.php

public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();                    // BIGINT PK auto-increment
        $table->foreignId('user_id')     // user_id BIGINT
              ->constrained()            // FK → users.id
              ->onDelete('cascade');     // ON DELETE CASCADE
        $table->string('title');         // VARCHAR(255) NOT NULL
        $table->text('body');            // TEXT NOT NULL
        $table->boolean('published')
              ->default(false);
        $table->timestamps();            // created_at, updated_at
    });
}

public function down(): void
{
    Schema::dropIfExists('posts');  // Rollback = drop table
}

// Run with: php artisan migrate
// Rollback: php artisan migrate:rollback`,
          explanation:
            "Migrations are PHP files that describe schema changes in code. Run `php artisan migrate` and Laravel executes all pending migrations in order, tracking them in the `migrations` table. Roll back a mistake with `migrate:rollback`. The whole team runs the same commands — no more 'it works on my machine' database drift.",
        },
        content: [
          "**Migration files** live in `database/migrations/` and are timestamped (e.g., `2024_01_15_000000_create_users_table.php`) to ensure execution order.",
          "**Schema::create vs Schema::table:** `create` makes a new table; `table` modifies an existing one (add columns, indexes, FKs).",
          "**Blueprint methods:** `$table->string()` → VARCHAR, `$table->integer()` → INT, `$table->text()` → TEXT, `$table->timestamps()` → created_at + updated_at, `$table->softDeletes()` → deleted_at.",
          "**`php artisan migrate:status`** shows which migrations have run and which are pending. Essential for debugging team sync issues.",
          "**Seeders & Factories:** `php artisan db:seed` runs `DatabaseSeeder.php` to populate tables with test data. Factories (using Faker) generate realistic dummy records — like having pre-built mock JSON but saved to DB.",
          "**Never edit a migration that's already run in production.** Create a NEW migration to alter the schema. Treat old migrations as immutable history.",
        ],
        challenge: {
          type: "mcq",
          question:
            "A teammate adds a `phone_number` column via a new migration. What command do you run to apply their change to your local database?",
          options: [
            "php artisan migrate:fresh",
            "php artisan migrate",
            "php artisan db:seed",
            "php artisan schema:update",
          ],
          correctAnswer: 1,
          explanation:
            "`php artisan migrate` runs only the pending (not-yet-run) migrations. `migrate:fresh` drops ALL tables and reruns everything from scratch — useful in dev but dangerous in production. `db:seed` only populates data, not schema.",
        },
      },
      {
        id: "lesson-3-2",
        moduleId: "module-3",
        title: "Eloquent ORM — Your Database, Flutter-Style",
        readTime: "8 min",
        xp: 100,
        summary:
          "Discover how Eloquent lets you query, create, update, and delete database records using expressive PHP chains — similar to how you chain methods in Dart.",
        flutterParallel: {
          concept: "Dart List operations vs. Eloquent Query Builder",
          flutterCode: `// Flutter: Filtering a local list
final activePosts = posts
  .where((p) => p.isPublished)
  .where((p) => p.userId == currentUser.id)
  .toList()
  ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

// Flutter: Creating a new object (in memory only!)
final newPost = Post(
  title: 'Hello World',
  body: 'My first post',
  userId: currentUser.id,
);
// You still need to POST this to the API to persist it.`,
          laravelCode: `<?php
// Eloquent: Same operations, but on the DATABASE
use App\\Models\\Post;

// Select — like .where() but runs SQL
$posts = Post::where('published', true)
             ->where('user_id', $userId)
             ->orderBy('created_at', 'desc')
             ->get(); // Returns Collection (like a Dart List)

// Create — inserts a new row instantly
$post = Post::create([
    'title'   => 'Hello World',
    'body'    => 'My first post',
    'user_id' => $userId,
]);

// Update — finds by PK, updates, saves
Post::find(1)->update(['title' => 'Updated Title']);

// Delete — removes the row from DB
Post::find(1)->delete();`,
          explanation:
            "Eloquent's method chaining feels just like Dart's collection methods — but each chain builds a SQL query executed against the real database. `get()` is like `toList()` but triggers the SELECT. Eloquent also handles timestamps automatically — no need to set `created_at` manually.",
        },
        content: [
          "**Eloquent Model** = a PHP class that maps to a database table. `class Post extends Model` → Eloquent assumes a `posts` table (pluralized snake_case).",
          "**Mass Assignment:** `$fillable` property on the model lists columns that can be set via `create()` or `fill()`. Protects against malicious data injection.",
          "**Query scopes:** Define reusable query constraints as model methods: `scopePublished($query) { return $query->where('published', true); }` then use `Post::published()->get()`.",
          "**Collections:** Eloquent returns `Illuminate\\Support\\Collection` objects — supercharged arrays with 70+ methods: `filter()`, `map()`, `pluck()`, `groupBy()`, `chunk()`.",
          "**N+1 Problem:** Looping through posts and accessing `$post->user` inside the loop runs a query PER POST. Fix: `Post::with('user')->get()` (eager loading) runs just 2 queries total.",
          "**Raw queries when needed:** `DB::select('SELECT * FROM posts WHERE ...')` bypasses Eloquent for complex SQL. Use parameterized queries to prevent SQL injection.",
        ],
        challenge: {
          type: "fill-blank",
          question:
            "Complete the Eloquent query: `Post::___('user')->where('published', true)->get();` to solve the N+1 problem by eager loading the user relationship.",
          blanks: ["with"],
          correctAnswer: "with",
          explanation:
            "`Post::with('user')` tells Eloquent to eager load the related User model in a second query (SELECT * FROM users WHERE id IN (1,2,3...)), then map them in PHP. This replaces N individual queries (one per post) with just 2 total queries.",
        },
      },
      {
        id: "lesson-3-3",
        moduleId: "module-3",
        title: "Eloquent Relationships — hasMany, belongsTo & Beyond",
        readTime: "9 min",
        xp: 100,
        summary:
          "Map SQL foreign key relationships to Eloquent methods and understand how they translate to the nested objects you serialize into Flutter's fromJson models.",
        flutterParallel: {
          concept: "Flutter nested model vs. Eloquent relationship",
          flutterCode: `// Flutter: Post model with nested Author
class Post {
  final int id;
  final String title;
  final User author; // Entire User object

  Post.fromJson(Map<String, dynamic> json)
    : id     = json['id'],
      title  = json['title'],
      author = User.fromJson(json['author']); // Nested
}

// You expect the API to return:
// { "id": 1, "title": "...", "author": { "id": 5, ... } }
// Laravel must JOIN and nest this for you via Resources.`,
          laravelCode: `<?php
// app/Models/User.php
class User extends Model {
    // One user has MANY posts
    public function posts(): HasMany {
        return $this->hasMany(Post::class);
    }
}

// app/Models/Post.php
class Post extends Model {
    // Each post BELONGS TO one user
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}

// Usage:
$user  = User::find(1);
$posts = $user->posts; // SELECT * FROM posts WHERE user_id = 1

$post   = Post::find(1);
$author = $post->user;  // SELECT * FROM users WHERE id = ?

// Many-to-many (users ↔ roles via user_role pivot):
$user->roles;           // belongsToMany(Role::class)
$role->users;           // belongsToMany(User::class)`,
          explanation:
            "Eloquent relationships are PHP methods that return query builders. Calling `$user->posts` triggers a `WHERE user_id = {user->id}` query. These relationships are what Laravel API Resources use to build the nested JSON that your Flutter `fromJson` expects. No manual JOINs needed.",
        },
        content: [
          "**`hasMany`:** 'I own many of these.' User hasMany Posts → `posts.user_id` references `users.id`. The FK is on the OTHER table.",
          "**`belongsTo`:** 'I am owned by one of these.' Post belongsTo User → the FK `user_id` is on THIS model's table.",
          "**`hasOne`:** Like hasMany but returns a single model. User hasOne Profile.",
          "**`belongsToMany`:** Many-to-many. Requires a pivot table. User belongsToMany Roles via `role_user` table.",
          "**`hasManyThrough`:** Skip a level. Country hasManyThrough Posts through Users.",
          "**Relationship methods vs. properties:** `$user->posts()` (method with parentheses) returns the query builder for further chaining. `$user->posts` (property, no parentheses) executes the query and returns results.",
        ],
        challenge: {
          type: "mcq",
          question:
            "A `Tag` can belong to many `Posts` and a `Post` can have many `Tags`. Which Eloquent relationship type is needed on BOTH models?",
          options: [
            "hasMany on Post, belongsTo on Tag",
            "belongsToMany on both Post and Tag",
            "hasOne on Post, hasMany on Tag",
            "morphMany on Post, morphTo on Tag",
          ],
          correctAnswer: 1,
          explanation:
            "`belongsToMany` on both models establishes a many-to-many relationship. Eloquent will look for a pivot table named `post_tag` (alphabetical, snake_case) with `post_id` and `tag_id` columns. You can customize the pivot table name as the second argument.",
        },
      },
    ],
  },
  {
    id: "module-4",
    title: "Controllers, Validation & Error Handling",
    description:
      "Master the controller layer: parsing Flutter requests, validating input with Form Requests, and returning meaningful error responses your Dart code can handle.",
    icon: "Shield",
    color: "from-orange-500 to-red-600",
    totalXp: 200,
    lessons: [
      {
        id: "lesson-4-1",
        moduleId: "module-4",
        title: "Form Request Validation — Your API's Bouncer",
        readTime: "7 min",
        xp: 100,
        summary:
          "Learn how Laravel Form Requests auto-validate incoming Flutter data before it reaches your controller, returning structured 422 errors your Dart code can parse.",
        flutterParallel: {
          concept: "Flutter form validation vs. Laravel Form Request",
          flutterCode: `// Flutter: Client-side validation (runs on device)
TextFormField(
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Title is required';
    }
    if (value.length > 255) {
      return 'Max 255 characters';
    }
    return null; // Valid
  },
),

// Problem: Anyone with Postman/curl can bypass
// client-side validation completely!
// You ALWAYS need server-side validation too.`,
          laravelCode: `<?php
// php artisan make:request StorePostRequest
// app/Http/Requests/StorePostRequest.php

class StorePostRequest extends FormRequest
{
    public function authorize(): bool {
        return true; // or: auth()->check()
    }

    public function rules(): array {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string', 'min:10'],
            'tags'  => ['array'],
            'tags.*'=> ['exists:tags,id'], // Each tag must exist in DB
        ];
    }
}

// In Controller — validation is AUTOMATIC:
class PostController extends Controller {
    public function store(StorePostRequest $request) {
        // If we reach here, data is already valid!
        $post = Post::create($request->validated());
        return response()->json($post, 201);
    }
}
// Failed validation → auto 422 with errors JSON`,
          explanation:
            "Laravel Form Requests run before your controller method. If validation fails, Laravel automatically returns a 422 Unprocessable Entity response with a JSON `errors` object. Your Flutter code catches this in the error handler and can display field-specific error messages — server-validated, not just client-validated.",
        },
        content: [
          "**Why server validation:** Client-side validation (Flutter forms) is UX sugar. Anyone can send raw HTTP requests bypassing it. Server validation is your last defense.",
          "**Rule types:** `required`, `string`, `integer`, `email`, `min:X`, `max:X`, `unique:table,column`, `exists:table,column`, `nullable`, `confirmed` (password match), `array`.",
          "**422 response structure:** `{ 'message': 'The title field is required.', 'errors': { 'title': ['The title field is required.'], 'body': ['...'] } }` — perfect for mapping to Flutter form field errors.",
          "**`$request->validated()`:** Returns ONLY the validated fields — never accidentally pass unvalidated/extra data to your model.",
          "**`authorize()` method:** Return false to reject the request with 403 Forbidden before validation even runs. Ideal for permission checks.",
          "**Custom error messages:** Override `messages()` method in FormRequest to return custom error strings per rule.",
        ],
        challenge: {
          type: "mcq",
          question:
            "What HTTP status code does Laravel return when Form Request validation fails, and what JSON key contains the field errors?",
          options: [
            "400 Bad Request, key: 'error'",
            "422 Unprocessable Entity, key: 'errors'",
            "403 Forbidden, key: 'message'",
            "500 Internal Server Error, key: 'errors'",
          ],
          correctAnswer: 1,
          explanation:
            "Laravel returns 422 Unprocessable Entity for validation failures, with an `errors` key containing an object where each key is the field name and the value is an array of error messages. Your Flutter `catch` block should check for statusCode == 422 and parse `response['errors']` to show field-specific feedback.",
        },
      },
      {
        id: "lesson-4-2",
        moduleId: "module-4",
        title: "Controllers — Organizing Your Request Handlers",
        readTime: "6 min",
        xp: 100,
        summary:
          "Structure clean, single-responsibility controllers using RESTful conventions, and understand the full request-to-response cycle from a Flutter client perspective.",
        flutterParallel: {
          concept: "Flutter API service class vs. Laravel Controller",
          flutterCode: `// Flutter: PostService (client-side handler)
class PostService {
  Future<List<Post>> getPosts() async {
    final res = await dio.get('/api/posts');
    return (res.data as List)
        .map((j) => Post.fromJson(j))
        .toList();
  }

  Future<Post> createPost(Map<String, dynamic> data) async {
    final res = await dio.post('/api/posts', data: data);
    return Post.fromJson(res.data);
  }
}`,
          laravelCode: `<?php
// app/Http/Controllers/PostController.php
// php artisan make:controller PostController --api

class PostController extends Controller
{
    // GET /api/posts
    public function index(): JsonResponse {
        $posts = Post::with('user')->latest()->paginate(15);
        return PostResource::collection($posts);
    }

    // POST /api/posts
    public function store(StorePostRequest $request): JsonResponse {
        $post = Post::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);
        return new PostResource($post), 201);
    }

    // GET /api/posts/{post}
    public function show(Post $post): JsonResponse {
        return new PostResource($post->load('user', 'tags'));
    }

    // PUT /api/posts/{post}
    public function update(UpdatePostRequest $request, Post $post) {
        $post->update($request->validated());
        return new PostResource($post);
    }

    // DELETE /api/posts/{post}
    public function destroy(Post $post): JsonResponse {
        $post->delete();
        return response()->json(null, 204);
    }
}`,
          explanation:
            "A Laravel controller is the server-side mirror of your Flutter API service class. Each public method corresponds to one HTTP endpoint. Route model binding (`Post $post` in the method signature) auto-fetches the Post by the `{post}` route parameter — no manual `Post::find($id)` needed.",
        },
        content: [
          "**`--api` flag:** `make:controller PostController --api` generates a controller with 5 methods: index, store, show, update, destroy — no create/edit (those are for web forms, not APIs).",
          "**Route Model Binding:** Laravel automatically resolves `{post}` in the URL to a `Post` model instance. Returns 404 if not found. Custom resolution via `getRouteKeyName()`.",
          "**Single Responsibility:** Each controller method should do ONE thing: validate → create/read/update/delete → return response.",
          "**Thin controllers, fat models/services:** Business logic belongs in Model methods or dedicated Service classes, not crammed into controllers.",
          "**Dependency injection:** Laravel's service container auto-injects typed constructor/method params. `FormRequest` validation, `Request` access, custom services — all injected automatically.",
        ],
        challenge: {
          type: "mcq",
          question:
            "In a Laravel controller method `public function show(Post $post)`, what does PHP type-hinting `Post` as the parameter accomplish?",
          options: [
            "It creates a new Post instance",
            "It validates the post data with a Form Request",
            "It automatically fetches the Post from DB by the route {post} parameter",
            "It applies authorization policy to the post",
          ],
          correctAnswer: 2,
          explanation:
            "This is Route Model Binding. When Laravel sees a type-hinted Eloquent model (`Post $post`) matching a route parameter (`{post}`), it automatically runs `Post::findOrFail($routeParam)`. If no post exists with that ID, Laravel returns 404 — no manual lookup needed in your method.",
        },
      },
    ],
  },
  {
    id: "module-5",
    title: "API Resources, DTOs & JSON Serialization",
    description:
      "Master API Resources as the bridge between Laravel Eloquent models and Flutter's fromJson models — controlling exactly what JSON shape your mobile app receives.",
    icon: "Layers",
    color: "from-pink-600 to-rose-600",
    totalXp: 200,
    lessons: [
      {
        id: "lesson-5-1",
        moduleId: "module-5",
        title: "API Resources — Crafting Perfect JSON for Flutter",
        readTime: "8 min",
        xp: 100,
        summary:
          "Use Laravel API Resources as DTOs to transform Eloquent models into the exact JSON shape your Flutter fromJson factories expect — consistent, versioned, and decoupled.",
        flutterParallel: {
          concept: "Flutter fromJson vs. Laravel API Resource",
          flutterCode: `// Flutter: fromJson parses whatever the API returns
class Post {
  final int id;
  final String title;
  final String authorName; // Expects 'author_name' key

  Post.fromJson(Map<String, dynamic> json)
    : id         = json['id'] as int,
      title      = json['title'] as String,
      authorName = json['author']['name'] as String; // Nested

}

// ⚠️ If Laravel changes the JSON shape,
// your Flutter app breaks. API Resources fix this.`,
          laravelCode: `<?php
// php artisan make:resource PostResource
// app/Http/Resources/PostResource.php

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'body'        => $this->body,
            'xp_reward'   => $this->xp ?? 0, // Computed/renamed
            'author'      => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],
            'tags'        => TagResource::collection($this->tags),
            'created_at'  => $this->created_at->toISOString(),
            // published_at is NEVER included — hidden from API
        ];
    }
}

// In controller:
return new PostResource($post);           // Single
return PostResource::collection($posts);  // Collection`,
          explanation:
            "API Resources are transformation layers — your contract with Flutter. They let you rename fields (`published_at` → `created_at`), compute derived values (`xp_reward`), include conditional data, and nest related resources. When the DB schema changes, you update the Resource — not the Flutter model.",
        },
        content: [
          "**API Resource = DTO (Data Transfer Object):** Decouples your internal DB schema from the public API contract. Change column names without breaking Flutter.",
          "**Conditional fields:** `$this->when($this->isAdmin(), 'secret_data')` — include fields only for certain users or conditions.",
          "**Resource Collections:** `PostResource::collection($posts)` wraps a collection. Add metadata via `ResourceCollection::with()` for pagination info.",
          "**Nested resources:** Return another Resource class for related models: `'user' => new UserResource($this->user)`. Lazy loading is handled automatically.",
          "**`$this->whenLoaded('tags')`:** Include the relationship only if it was eager-loaded with `with('tags')`. Prevents unexpected queries.",
          "**API versioning:** Create `App\\Http\\Resources\\V2\\PostResource` for a v2 API — same model, different JSON shape.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Your Flutter app parses `json['author']['name']`. In your Laravel API Resource, how should you structure this?",
          options: [
            "'author_name' => $this->user->name",
            "'author' => $this->user->name",
            "'author' => ['name' => $this->user->name]",
            "'author' => new UserResource($this->user)",
          ],
          correctAnswer: 2,
          explanation:
            "Since Flutter accesses `json['author']['name']`, the JSON must have a nested `author` object with a `name` key. In the Resource: `'author' => ['name' => $this->user->name]`. Option 3 creates the correct nested structure. Option 0 would require `json['author_name']` in Flutter instead.",
        },
      },
      {
        id: "lesson-5-2",
        moduleId: "module-5",
        title: "Pagination & Filtering — Handling Large API Datasets",
        readTime: "6 min",
        xp: 100,
        summary:
          "Implement cursor and offset pagination in Laravel APIs and parse the metadata in Flutter to build infinite scroll and load-more UIs.",
        flutterParallel: {
          concept: "Flutter infinite scroll vs. Laravel pagination",
          flutterCode: `// Flutter: Infinite scroll list
int _currentPage = 1;
List<Post> _posts = [];
bool _hasMore = true;

Future<void> loadMore() async {
  final res = await dio.get('/api/posts',
      queryParameters: {'page': _currentPage, 'per_page': 15});

  final meta = res.data['meta'];
  _posts.addAll((res.data['data'] as List)
      .map((j) => Post.fromJson(j)));

  _hasMore = meta['current_page'] < meta['last_page'];
  _currentPage++;
  setState(() {});
}`,
          laravelCode: `<?php
// Laravel: Paginated controller with filtering
public function index(Request $request): AnonymousResourceCollection
{
    $posts = Post::with('user', 'tags')
        ->when($request->search, fn($q, $s) =>
            $q->where('title', 'like', "%{$s}%")
        )
        ->when($request->tag, fn($q, $t) =>
            $q->whereHas('tags', fn($q) => $q->where('slug', $t))
        )
        ->latest()
        ->paginate($request->per_page ?? 15);

    return PostResource::collection($posts);
    // Auto-includes: data[], links{}, meta{}
    // meta: current_page, last_page, total, per_page
}`,
          explanation:
            "Laravel's `paginate()` automatically generates the `data`, `links`, and `meta` response structure that your Flutter `loadMore()` function reads. The `when()` method conditionally applies query scopes based on request parameters — clean conditional filtering without ugly if/else chains.",
        },
        content: [
          "**`paginate(15)`:** Returns `data[]`, `links{}` (first/prev/next/last URLs), and `meta{}` (current_page, last_page, total, per_page, from, to).",
          "**`simplePaginate(15)`:** Lighter version — only prev/next links, no total count. Better for large datasets where `COUNT(*)` is expensive.",
          "**`cursorPaginate(15)`:** Uses a cursor (encoded position) instead of page numbers. More efficient for real-time feeds where rows are constantly inserted.",
          "**Filtering with `when()`:** Eloquent's `when($value, $callback)` only applies the query scope if `$value` is truthy. Clean alternative to `if ($request->has('search')) { $query->where(...) }`.",
          "**Sorting:** `$request->sort_by` + whitelist of allowed columns: `$allowed = ['created_at', 'title']; $col = in_array($request->sort, $allowed) ? $request->sort : 'created_at';`",
        ],
        challenge: {
          type: "mcq",
          question:
            "Laravel's `paginate(15)` response includes a `meta` object. Which key tells your Flutter infinite scroll widget whether there are more pages to load?",
          options: [
            "meta.total vs. count of loaded items",
            "meta.current_page vs. meta.last_page",
            "links.next being non-null",
            "Both B and C are valid approaches",
          ],
          correctAnswer: 3,
          explanation:
            "Both approaches work: checking `meta.current_page < meta.last_page` gives you a boolean directly. Checking `links.next != null` also signals more pages exist (Laravel sets links.next to null on the last page). Most Flutter pagination implementations use one or both.",
        },
      },
    ],
  },
  {
    id: "module-6",
    title: "Authentication & Security",
    description:
      "Implement secure token-based authentication with Laravel Sanctum, protect your API endpoints, and understand the full auth flow from Flutter login to authorized requests.",
    icon: "Lock",
    color: "from-yellow-500 to-amber-600",
    totalXp: 300,
    lessons: [
      {
        id: "lesson-6-1",
        moduleId: "module-6",
        title: "Laravel Sanctum — Token Auth for Mobile Apps",
        readTime: "9 min",
        xp: 100,
        summary:
          "Implement the complete login → token → authenticated request flow using Laravel Sanctum, and map each step to the Flutter code that drives it.",
        flutterParallel: {
          concept: "Flutter login flow vs. Sanctum token issuance",
          flutterCode: `// Flutter: Complete auth flow
class AuthService {
  static const _tokenKey = 'auth_token';

  // Step 1: Login → receive token
  Future<void> login(String email, String password) async {
    final res = await dio.post('/api/login', data: {
      'email': email, 'password': password,
      'device_name': Platform.isAndroid ? 'Android' : 'iOS',
    });
    final token = res.data['token'] as String;
    await secureStorage.write(key: _tokenKey, value: token);
  }

  // Step 2: Attach token to every request
  void setupInterceptor() {
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (opts, handler) async {
        final token = await secureStorage.read(key: _tokenKey);
        opts.headers['Authorization'] = 'Bearer \$token';
        handler.next(opts);
      },
    ));
  }

  // Step 3: Logout → revoke token on server
  Future<void> logout() async {
    await dio.post('/api/logout'); // Revokes token in DB
    await secureStorage.delete(key: _tokenKey);
  }
}`,
          laravelCode: `<?php
// routes/api.php — Auth routes (no middleware)
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'       => 'required|email',
        'password'    => 'required',
        'device_name' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Invalid credentials.'],
        ]);
    }

    // Create Sanctum token — stored in personal_access_tokens table
    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json(['token' => $token]);
});

// Protected routes — require valid Sanctum token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete(); // Revoke
        return response()->json(['message' => 'Logged out']);
    });

    Route::get('/me', fn(Request $request) => $request->user());
    Route::apiResource('posts', PostController::class);
});`,
          explanation:
            "Sanctum stores tokens in the `personal_access_tokens` table, hashed with SHA-256. When Flutter sends `Authorization: Bearer {token}`, Sanctum looks up the hash, finds the user, and injects them into `$request->user()`. Revoked tokens are simply deleted from the table — no JWT expiry headaches.",
        },
        content: [
          "**Sanctum vs. JWT:** Sanctum stores tokens in the DB (stateful-ish) — easy to revoke, query, and associate with devices. JWT tokens are self-contained and stateless but harder to revoke before expiry.",
          "**`device_name`:** Sanctum allows multiple tokens per user (one per device). The device_name is a label (e.g., 'iPhone 15 Pro') — useful for 'Active Sessions' management screens.",
          "**Abilities/Scopes:** `createToken('mobile', ['posts:read', 'posts:write'])` — restrict what a token can do. Check with `$token->can('posts:write')`.",
          "**Token expiration:** Set `Sanctum::usePersonalAccessTokenModel` or add an `expires_at` column. Or use `SANCTUM_EXPIRATION` env var in Laravel 11.",
          "**Flutter secure storage:** Store tokens in `flutter_secure_storage` (Keychain on iOS, Keystore on Android) — never SharedPreferences or localStorage for auth tokens.",
          "**HTTPS only:** Tokens in HTTP headers are only safe over HTTPS. Never send tokens over plain HTTP in production.",
        ],
        challenge: {
          type: "mcq",
          question:
            "After a successful Sanctum login, your Flutter app stores the token and sends it as `Authorization: Bearer {token}`. Where does Laravel Sanctum look to validate this token?",
          options: [
            "The users table password column",
            "A JWT secret key in .env",
            "The personal_access_tokens table (hashed comparison)",
            "The session cookie storage",
          ],
          correctAnswer: 2,
          explanation:
            "Sanctum hashes the token with SHA-256 and stores it in the `personal_access_tokens` table. When a request arrives, Sanctum takes the Bearer token from the header, hashes it, and looks for a matching row. If found and not expired, the associated user is authenticated. This is why token revocation is instant — just delete the row.",
        },
      },
      {
        id: "lesson-6-2",
        moduleId: "module-6",
        title: "Authorization Policies — Who Can Do What",
        readTime: "7 min",
        xp: 100,
        summary:
          "Go beyond authentication (who are you?) to authorization (what can you do?) using Laravel Policies — the server-side equivalent of Flutter's role-based UI hiding.",
        flutterParallel: {
          concept: "Flutter role-based UI vs. Laravel Policy",
          flutterCode: `// Flutter: Hiding UI based on role (client-side only!)
if (currentUser.role == 'admin') {
  return EditButton(onPressed: () => editPost(post));
}
// ⚠️ This only hides the button — anyone can still
// send DELETE /api/posts/1 directly via Postman!
// You MUST enforce authorization on the SERVER too.`,
          laravelCode: `<?php
// php artisan make:policy PostPolicy --model=Post
// app/Policies/PostPolicy.php

class PostPolicy
{
    // Can the user update this specific post?
    public function update(User $user, Post $post): bool {
        return $user->id === $post->user_id
            || $user->isAdmin();
    }

    // Can the user delete this post?
    public function delete(User $user, Post $post): bool {
        return $user->id === $post->user_id
            || $user->hasRole('moderator');
    }
}

// In Controller — Gate::authorize() throws 403 if false:
public function update(UpdatePostRequest $request, Post $post) {
    $this->authorize('update', $post); // Uses PostPolicy::update()
    $post->update($request->validated());
    return new PostResource($post);
}

// Returns: 403 Forbidden if user doesn't own the post
// Flutter: catch DioException where statusCode == 403`,
          explanation:
            "Policies are PHP classes where each method answers: 'Can $user perform this action on this $model?' `$this->authorize()` in the controller calls the policy and throws a 403 if it returns false. Your Flutter error handler catches the 403 and shows an appropriate message — no raw Postman exploit possible.",
        },
        content: [
          "**Authentication vs Authorization:** Auth = proving who you are (login). Authz = what you're allowed to do (policies).",
          "**Policies are registered automatically** in Laravel 11 — just name them `PostPolicy` for `Post` model. Or register in `AuthServiceProvider`.",
          "**`before()` method:** If defined, runs before all other policy methods. Perfect for admin bypass: `if ($user->isAdmin()) return true;`",
          "**Gate facade:** `Gate::allows('update-post', $post)` anywhere in your code. `Gate::authorize('update-post', $post)` throws 403 on failure.",
          "**Blade directives (for web):** `@can('update', $post)` ... `@endcan` — hides UI server-side in Blade templates.",
          "**Resource authorization:** Use `authorizeResource(Post::class)` in controller constructor to auto-map CRUD methods to policy methods.",
        ],
        challenge: {
          type: "mcq",
          question:
            "A user who doesn't own a post tries to delete it. Your Policy's `delete()` returns `false`. What HTTP status code does Laravel return to Flutter?",
          options: ["401 Unauthorized", "404 Not Found", "403 Forbidden", "422 Unprocessable Entity"],
          correctAnswer: 2,
          explanation:
            "403 Forbidden means 'you are authenticated (we know who you are) but you do not have permission to perform this action.' 401 means 'we don't know who you are — send credentials.' Flutter should handle 403 by showing an 'Access Denied' message, not redirecting to login.",
        },
      },
      {
        id: "lesson-6-3",
        moduleId: "module-6",
        title: "Rate Limiting & API Security Best Practices",
        readTime: "6 min",
        xp: 100,
        summary:
          "Protect your Laravel API from abuse with rate limiting, input sanitization, and security headers — the final layer of defense for your Flutter app's backend.",
        flutterParallel: {
          concept: "Flutter retry logic vs. Laravel rate limiting",
          flutterCode: `// Flutter: Handle 429 Too Many Requests
dio.interceptors.add(InterceptorsWrapper(
  onError: (error, handler) async {
    if (error.response?.statusCode == 429) {
      final retryAfter = error.response
          ?.headers.value('Retry-After') ?? '60';
      // Show banner: "Too many requests. Try in Xs"
      await Future.delayed(Duration(
          seconds: int.parse(retryAfter)));
      // Retry the request
      final retryRes = await dio.fetch(error.requestOptions);
      return handler.resolve(retryRes);
    }
    handler.next(error);
  },
));`,
          laravelCode: `<?php
// app/Providers/RouteServiceProvider.php (Laravel 10)
// or bootstrap/app.php (Laravel 11)

RateLimiter::for('api', function (Request $request) {
    return [
        Limit::perMinute(60)->by($request->user()?->id ?: $request->ip()),
        Limit::perDay(5000)->by($request->user()?->id),
    ];
});

// Stricter limit for login (prevent brute force):
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)
        ->by($request->input('email') . '|' . $request->ip())
        ->response(function () {
            return response()->json([
                'message' => 'Too many login attempts. Try again in 60 seconds.',
            ], 429);
        });
});

// Apply in routes:
Route::middleware('throttle:api')->group(function () { ... });
Route::post('/login')->middleware('throttle:login');`,
          explanation:
            "Rate limiting prevents brute force attacks, credential stuffing, and API abuse. Laravel's `RateLimiter` returns 429 with a `Retry-After` header when the limit is exceeded. Flutter's Dio interceptor reads this header and implements exponential backoff — a cooperative, respectful client-server relationship.",
        },
        content: [
          "**Rate Limiting per user vs. per IP:** Authenticated routes limit by user ID (fair per-user quota). Unauthenticated routes limit by IP (prevents anonymous abuse).",
          "**`Retry-After` header:** Laravel automatically adds this to 429 responses — tells the client exactly how many seconds to wait.",
          "**SQL Injection prevention:** Eloquent and the query builder use PDO prepared statements automatically. Never interpolate user input into raw SQL strings.",
          "**Mass Assignment Protection:** `$fillable` on Eloquent models prevents users from setting arbitrary columns (e.g., `is_admin = true`) via POST body.",
          "**CORS configuration:** `config/cors.php` — specify allowed origins (your Flutter web domain), methods, and headers. Don't use `'*'` in production for credentialed requests.",
          "**Environment variables:** Never commit `.env` to git. Use `.env.example` for documentation. Rotate secrets if exposed.",
        ],
        challenge: {
          type: "mcq",
          question:
            "Your Laravel login route has `throttle:5` (5 requests per minute). A Flutter user fails login 5 times. What response does their 6th attempt receive?",
          options: [
            "401 Unauthorized with 'Invalid credentials'",
            "403 Forbidden with 'Account locked'",
            "429 Too Many Requests with Retry-After header",
            "400 Bad Request with validation errors",
          ],
          correctAnswer: 2,
          explanation:
            "After exhausting the rate limit, Laravel returns 429 Too Many Requests with a `Retry-After` header indicating when the window resets. This is distinct from 401 (wrong credentials) — the 429 doesn't reveal whether the credentials are correct, which is a security feature preventing timing attacks.",
        },
      },
    ],
  },
];

export const playgroundTables = [
  {
    id: "users",
    name: "users",
    x: 50,
    y: 80,
    columns: [
      { name: "id", type: "BIGINT", constraints: ["PK", "AUTO_INCREMENT"] },
      { name: "name", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
      { name: "email", type: "VARCHAR(255)", constraints: ["UNIQUE", "NOT NULL"] },
      { name: "created_at", type: "TIMESTAMP", constraints: [] },
    ],
  },
  {
    id: "posts",
    name: "posts",
    x: 400,
    y: 80,
    columns: [
      { name: "id", type: "BIGINT", constraints: ["PK", "AUTO_INCREMENT"] },
      { name: "user_id", type: "BIGINT", constraints: ["FK → users.id", "NOT NULL"] },
      { name: "title", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
      { name: "body", type: "TEXT", constraints: [] },
      { name: "published", type: "BOOLEAN", constraints: ["DEFAULT false"] },
    ],
  },
];

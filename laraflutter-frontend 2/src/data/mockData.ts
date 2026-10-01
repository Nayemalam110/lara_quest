/* ------------------------------------------------------------------ */
/*  LaraFlutter — mock curriculum data (swap for Supabase later)       */
/* ------------------------------------------------------------------ */

export interface Challenge {
  type: "mcq" | "drag-drop" | "fill-blank";
  question: string;
  /** Optional code snippet (use {{blank}} as the slot for fill-blank). */
  code?: string;
  options?: string[];
  /** MCQ: option index · fill-blank: exact option string · drag-drop: items joined with "→" */
  correctAnswer: string | number;
  explanation: string;
  xp?: number;
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

export type ModuleIcon = "database" | "server" | "orm" | "controller" | "json" | "shield";

export interface Module {
  id: string;
  index: number;
  title: string;
  tagline: string;
  description: string;
  color: string;
  icon: ModuleIcon;
  lessons: Lesson[];
}

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
  color: "#54c5f8",
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
  color: "#ff4438",
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
  {
    id: "m1",
    index: 1,
    title: "Relational Database Design & Schema Architecture",
    tagline: "Model data like the server does",
    description:
      "Tables, foreign keys and normalization — the durable truth layer that every Flutter client ultimately reads from.",
    color: "#54c5f8",
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
          type: "mcq",
          question: "What does a primary key guarantee about a row?",
          options: [
            "It is stored encrypted at rest",
            "It uniquely identifies the row and can never be null",
            "It is auto-filled by the client before sync",
            "It only improves read performance",
          ],
          correctAnswer: 1,
          explanation:
            "A primary key is the row's identity: unique and non-null, forever. It is the handle that foreign keys in other tables will hold on to.",
          xp: 25,
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
    title: "The Server-Side Lifecycle",
    tagline: "What actually happens after http.get",
    description:
      "Routing, middleware and HTTP verbs — trace a request from your Dart call through Laravel's pipeline and back.",
    color: "#a78bfa",
    icon: "server",
    lessons: [
      {
        id: "m2l1",
        moduleId: "m2",
        title: "Anatomy of a Request — Internet to Response",
        readTime: "8 min",
        xp: 60,
        summary:
          "When Flutter calls http.get, what wakes up on the server? Follow a request through boot, routing, middleware, controller and response.",
        flutterParallel: {
          concept: "http.get ↔ Route::get — two halves of the same conversation",
          flutterFile: "lib/services/api.dart",
          laravelFile: "routes/api.php",
          flutterCode: `final res = await http.get(
  Uri.parse('$baseUrl/api/posts/42'),
  headers: {'Accept': 'application/json'},
);`,
          laravelCode: `Route::get('/posts/{post}', function (Post $post) {
    // Laravel already loaded Post #42 for you
    return new PostResource($post);
});`,
          explanation:
            "The path you build with Uri.parse is matched by Laravel's router. Placeholders like {post} aren't just syntax — route-model binding fetches the Eloquent model before your code even runs, and returns a 404 automatically if it doesn't exist.",
        },
        content: [
          "Every request enters through public/index.php: the framework boots, builds a Request object from the raw HTTP packet, then hands it to the router.",
          "The router matches HTTP verb + URI path — exactly the two things you specify in Dart with http.get and Uri.parse.",
          "Middleware wraps the route like a chain of guards: think onGenerateRoute redirects in GoRouter, but running server-side on every single call.",
          "Everything is stateless. Each request boots, handles, and dies — there is no server-side widget tree persisting between API calls. State lives in the database, not memory.",
        ],
        challenge: {
          type: "drag-drop",
          question: "Order the request lifecycle pipeline from first byte to response.",
          options: [
            "Router matches URL & verb",
            "Route middleware guards the way",
            "HTTP request boots the framework",
            "Controller executes your logic",
            "Response travels back to Flutter",
          ],
          correctAnswer:
            "HTTP request boots the framework→Router matches URL & verb→Route middleware guards the way→Controller executes your logic→Response travels back to Flutter",
          explanation:
            "Boot first, then routing (we must know where the request is heading), then the route's middleware guards, then your controller logic, then the response flows back out through the same layers.",
          xp: 30,
        },
      },
      {
        id: "m2l2",
        moduleId: "m2",
        title: "HTTP Verbs Are Your API's Menu",
        readTime: "6 min",
        xp: 40,
        summary:
          "GET, POST, PUT, PATCH, DELETE aren't conventions — they're the contract your Flutter http client and Laravel routes both speak.",
        flutterParallel: {
          concept: "The verb you pick in Dart must match a registered Laravel route",
          flutterFile: "lib/services/api.dart",
          laravelFile: "routes/api.php",
          flutterCode: `await http.get(uri);              // read
await http.post(uri, body: b);   // create
await http.put(uri, body: b);    // replace
await http.patch(uri, body: b);  // tweak
await http.delete(uri);          // destroy`,
          laravelCode: `Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);

// or all five REST verbs in one line:
Route::apiResource('posts', PostController::class);`,
          explanation:
            "Calling http.put when the server only registered Route::post gives you a 405 Method Not Allowed. The verb is part of the route's identity — both sides must agree on it, like a function signature.",
        },
        content: [
          "GET must be safe and idempotent — calling it 100 times changes nothing, like reading a variable. Never mutate state in a GET.",
          "POST creates; PUT replaces an entire resource; PATCH modifies a few fields. In Flutter terms: PUT is copyWith for every field, PATCH only for the ones you passed.",
          "Status codes are the return type of the HTTP world: 200 OK, 201 Created, 204 No Content, 404, 422, 500. Your Dart code should branch on these, not on parsing error strings.",
          "REST maps CRUD to verb + noun URLs: /posts/42 identifies a thing; the verb declares intent. apiResource registers the whole conventional map in one line.",
        ],
        challenge: {
          type: "mcq",
          question: "Your Flutter settings screen must replace the user's entire profile object. Which verb expresses that intent?",
          options: ["GET", "POST", "PUT", "DELETE"],
          correctAnswer: 2,
          explanation:
            "PUT replaces the whole resource with the payload you send. PATCH is for partial edits, POST for creating new sub-resources — and it should be idempotent: same request twice, same result.",
          xp: 25,
        },
      },
    ],
  },
  {
    id: "m3",
    index: 3,
    title: "Migrations & Eloquent ORM",
    tagline: "Version control for your database",
    description:
      "Migrations as repeatable schema history, and Eloquent models that make rows feel as natural as Dart objects.",
    color: "#34d399",
    icon: "orm",
    lessons: [
      {
        id: "m3l1",
        moduleId: "m3",
        title: "Migrations Are Git for Tables",
        readTime: "7 min",
        xp: 50,
        summary:
          "sqflite's onUpgrade callback, grown up: every schema change is a versioned, reversible PHP class shared across the whole team.",
        flutterParallel: {
          concept: "onUpgrade with manual version numbers vs. a migrations table that tracks itself",
          flutterFile: "lib/data/db.dart",
          laravelFile: "database/migrations/xxxx_create_posts_table.php",
          flutterCode: `await openDatabase(
  'app.db',
  version: 3,
  onUpgrade: (db, oldV, newV) async {
    if (oldV < 2) { /* add column */ }
    if (oldV < 3) { /* new table  */ }
  },
);`,
          laravelCode: `return new class extends Migration {
    public function up(): void {
        Schema::create('posts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained();
            $t->string('title');
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('posts');
    }
};`,
          explanation:
            "Both worlds replay incremental schema changes — but Laravel records which migrations already ran in its own migrations table, per environment. php artisan migrate brings a fresh staging server to the exact same schema as prod.",
        },
        content: [
          "Every schema change is a file with up() (apply) and down() (revert) — reviewable in Git, replayable on any machine, shareable with teammates.",
          "php artisan migrate runs only the pending files; migrate:rollback runs down() on the last batch. The schema's history is executable code.",
          "The Schema Builder is fluent PHP instead of raw SQL: one dialect works identically on MySQL, Postgres and SQLite.",
          "Because migrations are code, CI can build a real database and run your feature tests against the true schema on every pull request.",
        ],
        challenge: {
          type: "mcq",
          question: "What does php artisan migrate:rollback actually do?",
          options: [
            "Deletes the database entirely",
            "Restores the last database backup",
            "Runs the down() method of the most recent migration batch",
            "Undoes the last Git commit",
          ],
          correctAnswer: 2,
          explanation:
            "Migrations run in batches; rollback executes the down() of the latest batch — which is why every migration must define how to undo itself.",
          xp: 25,
        },
      },
      {
        id: "m3l2",
        moduleId: "m3",
        title: "Eloquent Models — Rows That Behave Like Objects",
        readTime: "7 min",
        xp: 50,
        summary:
          "Your Dart model class has a server-side twin: an Eloquent model where each instance is a live row you can read, change and save.",
        flutterParallel: {
          concept: "fromJson builds a snapshot — an Eloquent model is a live handle to the row",
          flutterFile: "lib/models/post.dart",
          laravelFile: "app/Models/Post.php",
          flutterCode: `class Post {
  final int id;
  final String title;

  factory Post.fromJson(Map<String, dynamic> j) =>
      Post(id: j['id'], title: j['title']);
  // immutable snapshot — stale the moment it's built
}`,
          laravelCode: `class Post extends Model
{
    protected $fillable = ['title', 'body'];
}

$post = Post::find(42);      // SELECT * WHERE id = 42
echo $post->title;           // read a column as a property
$post->title = 'Ship it';    // mutate in memory…
$post->save();               // …UPDATE back to the row`,
          explanation:
            "In Flutter, fromJson gives you an immutable copy of server data. Eloquent inverts that: the object is bound to its row — assigning a property and calling save() issues the UPDATE. Active Record removes the serialization gap entirely.",
        },
        content: [
          "Convention maps Post → the posts table (plural, snake_case). Override with protected $table when reality disagrees.",
          "find(), where(), orderBy() — the query builder reads like Dart collection methods, but compiles to one optimized SQL statement executed server-side.",
          "$fillable is your mass-assignment whitelist: the exact equivalent of only picking specific keys in fromJson, keeping unexpected client fields out of your rows.",
          "Models emit no state management — every save hits the database, so all clients observe the change on their next read. The server is the store.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Complete the model so it reads from the legacy blog_posts table instead of the default posts.",
          code: `class Post extends Model
{
    protected {{blank}} = 'blog_posts';
}`,
          options: ["$table", "$model", "$fillable", "$schema"],
          correctAnswer: "$table",
          explanation:
            "Eloquent's convention is the plural snake_case class name. protected $table overrides it — one property, zero SQL changes anywhere else.",
          xp: 25,
        },
      },
      {
        id: "m3l3",
        moduleId: "m3",
        title: "Relationships as Methods — hasMany & belongsTo",
        readTime: "8 min",
        xp: 60,
        summary:
          "The where()-chaining you do by hand in Dart exists as one declarative method in Eloquent — and it lazy-loads like magic.",
        flutterParallel: {
          concept: "Manual list filtering in Dart vs. a relationship method that builds the query",
          flutterFile: "lib/state/profile.dart",
          laravelFile: "app/Models/User.php",
          flutterCode: `// manual join in memory
final userPosts = allPosts
    .where((p) => p.userId == user.id)
    .toList();`,
          laravelCode: `class User extends Model
{
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

$user->posts;            // SELECT * FROM posts
                         // WHERE user_id = ?
Post::with('user')->get(); // eager-load, kills N+1`,
          explanation:
            "Both snippets answer 'posts of this user', but Eloquent's version compiles to one indexed SQL query instead of downloading everything and filtering in memory. $user->posts looks like a property — it's actually a lazy query.",
        },
        content: [
          "hasMany lives on the parent (User), belongsTo on the child holding the foreign key (Post). The FK's home always defines the direction.",
          "belongsTo is the exact mirror of m1l2's schema: posts.user_id → users.id. Eloquent simply turns that constraint into $post->user.",
          "Lazy loading inside a loop causes the N+1 problem — 101 queries for 100 posts. with('user') eager-loads and joins in one constant round trip.",
          "belongsToMany models your normalized pivot from module 1: $post->tags() walks post_tag behind the scenes. The schema you designed is the API you get.",
        ],
        challenge: {
          type: "fill-blank",
          question: "From inside the Post model, complete the inverse side of the relationship.",
          code: `public function user()
{
    return $this->{{blank}}(User::class);
}`,
          options: ["belongsTo", "hasMany", "hasOne", "belongsToMany"],
          correctAnswer: "belongsTo",
          explanation:
            "The model holding the foreign key (posts.user_id) always belongsTo its parent. hasMany is only ever declared on the other side — User in this case.",
          xp: 25,
        },
      },
    ],
  },
  {
    id: "m4",
    index: 4,
    title: "Controllers, Validation & Error Handling",
    tagline: "Where routes meet logic",
    description:
      "Thin controllers, FormRequest validation that fails fast with 422s, and error responses your Flutter UI can render gracefully.",
    color: "#fbbf24",
    icon: "controller",
    lessons: [
      {
        id: "m4l1",
        moduleId: "m4",
        title: "Controllers — The Traffic Cops",
        readTime: "6 min",
        xp: 40,
        summary:
          "One class per resource, one method per route action. Controllers keep routes clean and business logic testable.",
        flutterParallel: {
          concept: "Controllers are your repository/service layer — promoted to the server",
          flutterFile: "lib/repositories/post_repository.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `class PostRepository {
  Future<Post> create(String title) async {
    final res = await api.post('/posts', {'title': title});
    return Post.fromJson(jsonDecode(res.body));
  }
}`,
          laravelCode: `class PostController extends Controller
{
    public function store(StorePostRequest $request)
    {
        $post = Post::create($request->validated());

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }
}`,
          explanation:
            "You already separate UI from data access in Flutter with repositories. A controller is that layer on the server: it receives the validated request, talks to models, and shapes the response — nothing more.",
        },
        content: [
          "REST maps cleanlly onto seven conventional actions: index, show, store, update, destroy — your routes file stays a readable map of the whole API.",
          "Type-hinting dependencies (FormRequests, models, services) lets Laravel's container inject them for free — get_it-style DI, server edition.",
          "Thin controllers, fat models: if a method grows past a few lines, the logic wants to live in the model or an action class where it can be unit-tested.",
          "Returning the right status code (201 on create, 204 on delete) lets your Flutter repository branch on codes instead of sniffing bodies.",
        ],
        challenge: {
          type: "mcq",
          question: "A well-designed controller method should…",
          options: [
            "Contain all SQL so queries stay near the route",
            "Coordinate: receive validated input, call into models/services, shape the response",
            "Render HTML for every possible client",
            "Hold global state between requests",
          ],
          correctAnswer: 1,
          explanation:
            "Controllers orchestrate — they don't compute. Keeping them thin makes business logic testable and reusable by queues, commands and other controllers.",
          xp: 25,
        },
      },
      {
        id: "m4l2",
        moduleId: "m4",
        title: "Form Requests — Validation That Fails Fast",
        readTime: "7 min",
        xp: 60,
        summary:
          "Flutter form validators protect UX. FormRequest validation protects your data — and it runs before your controller ever executes.",
        flutterParallel: {
          concept: "TextFormField validators are UX hints; server validation is the real gate",
          flutterFile: "lib/ui/new_post_sheet.dart",
          laravelFile: "app/Http/Requests/StorePostRequest.php",
          flutterCode: `TextFormField(
  validator: (v) =>
      (v == null || v.length < 3)
          ? 'Title needs 3+ characters'
          : null,
  // great UX — trivially bypassed via curl
)`,
          laravelCode: `class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3'],
            'body'  => ['required', 'string'],
            'tags'  => ['array', 'max:5'],
        ];
    }
}`,
          explanation:
            "Client-side validation can be skipped by anyone with curl or Postman. FormRequests run server-side before the controller: if rules fail, Laravel short-circuits with 422 and a JSON error bag — your controller only ever sees clean data.",
        },
        content: [
          "validation rules are declarative: 'required|string|min:3' reads like your Dart validators but is enforced where it actually matters.",
          "On failure, Laravel returns 422 Unprocessable Entity with {message, errors: {field: [msgs]}} — a stable shape your Flutter forms can map back onto fields.",
          "$request->validated() returns only the rule-covered keys — mass-assignment protection for free, no manual whitelisting.",
          "Bail early: the middleware-pipeline position of validation means a bad request costs zero database queries.",
        ],
        challenge: {
          type: "mcq",
          question: "Validation fails inside a FormRequest during an API call with Accept: application/json. What does Laravel return?",
          options: [
            "500 Internal Server Error with a stack trace",
            "302 redirect back to a form with flashed errors",
            "422 with a JSON error bag keyed by field name",
            "200 OK with an error flag inside the body",
          ],
          correctAnswer: 2,
          explanation:
            "For JSON requests Laravel answers 422 + {message, errors} — the server-side mirror of the field errors your Flutter form already knows how to show. Redirects only happen for browser form posts.",
          xp: 25,
        },
      },
    ],
  },
  {
    id: "m5",
    index: 5,
    title: "API Resources, DTOs & JSON Serialization",
    tagline: "Bridging Laravel models to Flutter models",
    description:
      "API Resources are the server's toJson — design stable contracts that keep your Dart fromJson parsers happy forever.",
    color: "#22d3ee",
    icon: "json",
    lessons: [
      {
        id: "m5l1",
        moduleId: "m5",
        title: "API Resources — The Server's toJson",
        readTime: "7 min",
        xp: 60,
        summary:
          "Stop leaking raw database rows. Resources give you a deliberate serialization layer — the exact mirror of your Dart model's toJson.",
        flutterParallel: {
          concept: "fromJson/toJson on the client ↔ an API Resource on the server",
          flutterFile: "lib/models/post.dart",
          laravelFile: "app/Http/Resources/PostResource.php",
          flutterCode: `class Post {
  final int id;
  final String title;

  factory Post.fromJson(Map<String, dynamic> j) =>
      Post(id: j['id'], title: j['title']);
  // ^ assumes the server picked these exact keys
}`,
          laravelCode: `class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'     => $this->id,
            'title'  => $this->title,
            'author' => new UserResource(
                $this->whenLoaded('user')
            ),
        ];
    }
}`,
          explanation:
            "fromJson hard-codes the keys your app expects — so the server must guarantee them. A Resource is that guarantee: one explicit class deciding exactly which fields (and which loaded relationships) cross the wire, in which shape.",
        },
        content: [
          "Returning a model directly leaks every column — including ones you'll regret (internal flags, timestamps in the wrong format, future columns you add later).",
          "Resources decouple your DB schema from your API contract: rename a column, keep the JSON key stable, and no Flutter release ever breaks.",
          "whenLoaded('user') embeds relations only when they were eager-loaded — eliminating N+1 queries from the serialization layer itself.",
          "Date formats, computed fields (is_liked), pagination meta — one place defines them all instead of scattered client-side parsing hacks.",
        ],
        challenge: {
          type: "mcq",
          question: "Why return a Resource instead of the Eloquent model itself?",
          options: [
            "Resources are automatically cached by Laravel",
            "You control exactly which fields and what shape every client receives — even as the schema evolves",
            "Models physically cannot be converted to JSON",
            "Resources skip the database for faster responses",
          ],
          correctAnswer: 1,
          explanation:
            "A Resource is a deliberate contract: stable keys for Flutter's fromJson, hidden internals, and the freedom to change your schema without shipping a breaking app update.",
          xp: 25,
        },
      },
      {
        id: "m5l2",
        moduleId: "m5",
        title: "Contracts Both Sides Can Trust",
        readTime: "6 min",
        xp: 50,
        summary:
          "Envelopes, pagination and DTO thinking: give your Flutter models a payload shape that never changes under their feet.",
        flutterParallel: {
          concept: "The {data: [...]} envelope ↔ parsing lists safely on the client",
          flutterFile: "lib/models/paginated_posts.dart",
          laravelFile: "app/Http/Controllers/PostController.php",
          flutterCode: `final json = jsonDecode(res.body);
final items = (json['data'] as List)
    .map((e) => Post.fromJson(e))
    .toList();
final nextPage = json['links']?['next'];`,
          laravelCode: `public function index()
{
    $posts = Post::with('user')
        ->latest()
        ->paginate(15);

    // wraps items in a { data: [...] } envelope
    // + { links, meta } pagination keys
    return PostResource::collection($posts);
}`,
          explanation:
            "Collect a resource and Laravel wraps it in a predictable {data, links, meta} envelope. Your Dart parsing layer reads json['data'] every time — the same contract for lists, singles, and paginated feeds.",
        },
        content: [
          "A DTO (data transfer object) mindset: shape the payload for the consumer's convenience, not the database's convenience.",
          "paginate() + Resource::collection gives you page links and totals for free — the backend half of your Flutter infinite scroll.",
          "Version the contract at the URL level (/api/v1/...) when a breaking change is unavoidable — old app builds keep working.",
          "Shared examples beat shared docs: a sample JSON response pinned in the repo is the handshake between your two codebases.",
        ],
        challenge: {
          type: "fill-blank",
          question: "Wrap a paginated query so Flutter receives the standard { data: [...], links, meta } envelope.",
          code: `return PostResource::{{blank}}(
    Post::with('user')->paginate(15)
);`,
          options: ["collection", "make", "resource", "wrap"],
          correctAnswer: "collection",
          explanation:
            "Resource::collection() serializes every item and adds the envelope — pagination links and meta included. new PostResource() is only for single models.",
          xp: 25,
        },
      },
    ],
  },
  {
    id: "m6",
    index: 6,
    title: "Authentication & Security",
    tagline: "Tokens, guards and trusted identity",
    description:
      "Bearer tokens with Sanctum, auth middleware as the server-side route guard, and how it all maps to the Supabase Auth model you know.",
    color: "#fb7185",
    icon: "shield",
    lessons: [
      {
        id: "m6l1",
        moduleId: "m6",
        title: "Bearer Tokens with Sanctum",
        readTime: "8 min",
        xp: 60,
        summary:
          "Trade credentials for a token once, then send it on every request. The flow you built with flutter_secure_storage — explained from the server's side.",
        flutterParallel: {
          concept: "flutter_secure_storage + Authorization header ↔ a token row the server can verify",
          flutterFile: "lib/services/auth.dart",
          laravelFile: "routes/api.php",
          flutterCode: `final token = await storage.read(key: 'api_token');
final res = await http.get(
  Uri.parse('$baseUrl/api/me'),
  headers: {'Authorization': 'Bearer $token'},
);`,
          laravelCode: `// login: verify credentials, mint a token
$user = User::where('email', $r->email)->first();
abort_unless(Hash::check($r->password,
    $user->password), 401);

return ['token' =>
    $user->createToken('flutter-app')->plainTextToken];

// protected route
Route::middleware('auth:sanctum')
    ->get('/me', fn (Request $r) => $r->user());`,
          explanation:
            "createToken() stores a hashed token row linked to the user and returns the plain string once. Your Flutter app stores that string; each request, Sanctum hashes the incoming Bearer token and looks up the owner — no session, no cookies, perfect for mobile.",
        },
        content: [
          "The bearer token is a capability: whoever holds it is the user. flutter_secure_storage (Keychain / EncryptedSharedPrefs) keeps it out of reach of casual snooping.",
          "Hash::check compares against the bcrypt hash — plain-text passwords never touch your database. Login returns 401, never 'wrong password' vs 'no such email' (user enumeration).",
          "auth:sanctum middleware resolves $request->user() before the controller — your code never re-verifies identity manually.",
          "Tokens can carry abilities (['posts:create']) and be revoked per-device — the self-hosted equivalent of Supabase's logout-everywhere.",
        ],
        challenge: {
          type: "drag-drop",
          question: "Order the token-authentication flow end to end.",
          options: [
            "Server verifies credentials and mints a token",
            "Flutter stores the token in secure storage",
            "Client sends email + password to /login",
            "auth:sanctum resolves the user or rejects 401",
            "Every request sends Authorization: Bearer",
          ],
          correctAnswer:
            "Client sends email + password to /login→Server verifies credentials and mints a token→Flutter stores the token in secure storage→Every request sends Authorization: Bearer→auth:sanctum resolves the user or rejects 401",
          explanation:
            "Authenticate once, store the minted token, attach it to every subsequent request, and let the middleware gate each route by looking the token up server-side.",
          xp: 30,
        },
      },
      {
        id: "m6l2",
        moduleId: "m6",
        title: "Middleware Guards — Sanctum vs Supabase Auth",
        readTime: "6 min",
        xp: 50,
        summary:
          "You've used GoRouter redirects to guard screens. Middleware is that same guard running on the server — where it can't be skipped.",
        flutterParallel: {
          concept: "GoRouter redirect guards screens; middleware guards the data itself",
          flutterFile: "lib/router.dart",
          laravelFile: "routes/api.php",
          flutterCode: `GoRouter(
  redirect: (context, state) {
    final loggedIn = auth.isSignedIn;
    if (!loggedIn) return '/login';
    return null;
  },
  // UX guard — but the API still needs proof
)`,
          laravelCode: `Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [ProfileController::class, 'show']);
    Route::apiResource('posts', PostController::class);
});
// no valid token -> 401 before any controller runs`,
          explanation:
            "A route guard in Flutter only hides UI — a savvy user can still hit your endpoints directly. Middleware is the same redirect pattern, executed server-side: every request in the group must present a valid token or die with 401 before touching data.",
        },
        content: [
          "Supabase Auth issues JWTs validated with a shared secret; Sanctum issues tokens validated against your own database — same client-side pattern (Bearer header), different trust root.",
          "Middleware order matters: place auth before rate limiting or logging that assumes a user exists.",
          "401 (unauthenticated) vs 403 (unauthorized): a valid token can still be forbidden from other users' rows — that's Policies, your row-level-security equivalent.",
          "Choosing Supabase later? The mental model transfers: Flutter keeps the token, the server (or RLS policy) enforces identity per request.",
        ],
        challenge: {
          type: "mcq",
          question: "In a Sanctum + Flutter setup, the source of truth for 'who is this user?' on each API call is…",
          options: [
            "A boolean in SharedPreferences set at login",
            "The expiry date embedded in the app's login screen state",
            "The token the server validates (lookup + user resolution) on every request",
            "The JWT cached in the HTTP client",
          ],
          correctAnswer: 2,
          explanation:
            "Client-side state is just UX. The server re-validates the presented token against its own records on every call — which is exactly why revocation and logout-all-devices can work at all.",
          xp: 25,
        },
      },
    ],
  },
];

/* ------------------------- per-lesson visuals --------------------- */

export const lessonVisuals: Record<string, LessonVisual> = {
  m1l1: {
    kind: "schema",
    tables: [
      {
        name: "users",
        color: "#54c5f8",
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
        color: "#ff4438",
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
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "HTTP request", sub: "GET /api/posts/42" },
      { icon: "boot", title: "Framework boots", sub: "public/index.php" },
      { icon: "route", title: "Router matches", sub: "verb + URI" },
      { icon: "shield", title: "Middleware", sub: "guards run" },
      { icon: "controller", title: "Controller", sub: "your logic" },
      { icon: "response", title: "Response", sub: "200 OK · JSON", tone: "success" },
    ],
    note: "Press play to trace a request through the pipeline. Stateless: the whole cycle dies after the response.",
  },
  m2l2: {
    kind: "lifecycle",
    steps: [
      { icon: "dart", title: "http.put() in Dart", sub: "PUT /api/profile" },
      { icon: "globe", title: "TLS handshake", sub: "encrypted channel" },
      { icon: "route", title: "Route::put() matches", sub: "verb IS the contract" },
      { icon: "controller", title: "update() action", sub: "replace the row" },
      { icon: "response", title: "200 OK", sub: "fresh JSON body", tone: "success" },
    ],
    note: "The verb travels inside the request line itself. Route::put() only wakes up for PUT — nothing else.",
  },
  m3l1: {
    kind: "schema",
    tables: [
      {
        ...USERS_TABLE,
        badge: "migration #1",
      },
      {
        ...POSTS_TABLE,
        badge: "migration #2",
      },
    ],
    note: "Both tables were produced by versioned migration files — replayable on staging, CI and production with one artisan command.",
  },
  m3l2: {
    kind: "schema",
    tables: [
      { ...USERS_TABLE, badge: "User extends Model" },
      { ...POSTS_TABLE, badge: "Post extends Model" },
    ],
    note: "One class per table: new User() is a blank row, User::find(1) is row 1, save() writes it back.",
  },
  m3l3: {
    kind: "schema",
    tables: [
      { ...USERS_TABLE, badge: "hasMany(Post)" },
      { ...POSTS_TABLE, badge: "belongsTo(User)" },
    ],
    note: "hasMany is declared on the parent (users), belongsTo on the child holding the foreign key (posts).",
  },
  m4l1: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Request", sub: "POST /api/posts" },
      { icon: "route", title: "Router", sub: "-> PostController@store" },
      { icon: "controller", title: "store()", sub: "thin + focused" },
      { icon: "db", title: "Post::create()", sub: "model does the work" },
      { icon: "response", title: "201 Created", sub: "PostResource", tone: "success" },
    ],
    note: "The controller coordinates: validate via the request class, delegate to the model, shape the response.",
  },
  m4l2: {
    kind: "lifecycle",
    steps: [
      { icon: "globe", title: "Request", sub: "title: 'hi'" },
      { icon: "shield", title: "StorePostRequest", sub: "rules: min:3" },
      { icon: "error", title: "Fail fast", sub: "controller never runs", tone: "danger" },
      { icon: "response", title: "422 Unprocessable", sub: "{ errors: {...} }", tone: "danger" },
    ],
    note: "Invalid input short-circuits before your code or the database are touched — zero wasted queries.",
  },
  m5l1: {
    kind: "pipeline",
    nodes: [
      {
        label: "Eloquent model",
        lang: "php",
        code: `$post = Post::with('user')->find(1);
// every column of the row —
// far too much to expose`,
      },
      {
        label: "PostResource (toArray)",
        lang: "php",
        code: `return [
  'id'     => $this->id,
  'title'  => $this->title,
  'author' => new UserResource(
      $this->whenLoaded('user')),
];`,
      },
      {
        label: "JSON over the wire",
        lang: "json",
        code: `{
  "id": 1,
  "title": "Ship backends",
  "author": { "id": 7, "name": "Ada" }
}`,
      },
      {
        label: "Dart fromJson",
        lang: "dart",
        code: `factory Post.fromJson(
    Map<String, dynamic> j) =>
  Post(id: j['id'], title: j['title']);`,
      },
    ],
    note: "The Resource is the server-side toJson: the exact keys your Dart parser depends on, defined in one deliberate place.",
  },
  m5l2: {
    kind: "pipeline",
    nodes: [
      {
        label: "paginated query",
        lang: "php",
        code: `$posts = Post::with('user')
    ->latest()
    ->paginate(15);`,
      },
      {
        label: "Resource::collection",
        lang: "php",
        code: `return PostResource::collection($posts);
// wraps each item + adds
// links & meta automatically`,
      },
      {
        label: "envelope JSON",
        lang: "json",
        code: `{
  "data": [ { "id": 9, "title": "..." } ],
  "links": { "next": "...?page=2" },
  "meta": { "total": 132 }
}`,
      },
      {
        label: "Flutter infinite scroll",
        lang: "dart",
        code: `final items = (j['data'] as List)
  .map((e) => Post.fromJson(e));
final next = j['links']['next'];`,
      },
    ],
    note: "One envelope shape for every list endpoint — your Dart pagination layer parses it once and reuses it forever.",
  },
  m6l1: {
    kind: "schema",
    tables: [USERS_TABLE, TOKENS_TABLE],
    note: "Sanctum stores hashed token rows linked to users. The Bearer string your Flutter app sends is looked up here on every request — revoke the row, kill the session.",
  },
  m6l2: {
    kind: "lifecycle",
    steps: [
      { icon: "dart", title: "Flutter request", sub: "Bearer st_9f..." },
      { icon: "shield", title: "auth:sanctum", sub: "token lookup" },
      { icon: "error", title: "No match?", sub: "401, short-circuit", tone: "danger" },
      { icon: "lock", title: "Policy check", sub: "own this row? 403" },
      { icon: "controller", title: "Controller", sub: "request->user()" },
      { icon: "response", title: "200 OK", sub: "authorized JSON", tone: "success" },
    ],
    note: "Two different gates: 401 means 'prove who you are', 403 means 'I know you — but not this row'.",
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

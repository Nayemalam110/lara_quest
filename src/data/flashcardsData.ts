import type { Flashcard } from "@/types";

export const CONCEPT_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    category: "HTTP & Architecture",
    flutterConcept: "Dio Interceptors",
    laravelConcept: "Middleware Pipeline",
    flutterSnippet: `class AuthInterceptor extends Interceptor {
  @override
  void onRequest(options, handler) {
    options.headers['Authorization'] = 'Bearer $token';
    handler.next(options);
  }
}`,
    laravelSnippet: `class EnsureTokenIsValid {
  public function handle(Request $request, Closure $next): Response {
    if (! $request->bearerToken()) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }
    return $next($request);
  }
}`,
    explanation:
      "Dio interceptors run client-side before leaving your phone; Laravel middleware intercepts incoming packets on the server before reaching your controller.",
    moduleId: "m3",
    lessonId: "m3l3",
  },
  {
    id: "fc-2",
    category: "Data Serialization",
    flutterConcept: "factory Model.fromJson()",
    laravelConcept: "Eloquent JsonResource",
    flutterSnippet: `class Post {
  final int id;
  final String title;
  factory Post.fromJson(Map<String, dynamic> json) => 
    Post(id: json['id'], title: json['title']);
}`,
    laravelSnippet: `class PostResource extends JsonResource {
  public function toArray(Request $request): array {
    return [
      'id' => $this->id,
      'title' => $this->title,
      'author_name' => $this->whenLoaded('author', fn() => $this->author->name),
    ];
  }
}`,
    explanation:
      "JsonResource forms an immutable API contract boundary between your internal SQL columns and the exact JSON shape your Flutter app parses.",
    moduleId: "m10",
    lessonId: "m10l1",
  },
  {
    id: "fc-3",
    category: "Authentication",
    flutterConcept: "flutter_secure_storage",
    laravelConcept: "Laravel Sanctum Tokens",
    flutterSnippet: `final storage = FlutterSecureStorage();
await storage.write(key: 'auth_token', value: token);
// Header: Authorization: Bearer <token>`,
    laravelSnippet: `// In AuthController:
$token = $user->createToken('mobile-app', ['posts:create'])->plainTextToken;
return response()->json(['token' => $token]);`,
    explanation:
      "Sanctum issues SHA-256 hashed personal access tokens with fine-grained abilities, stored client-side in the mobile OS keychain.",
    moduleId: "m11",
    lessonId: "m11l1",
  },
  {
    id: "fc-4",
    category: "Database Schema",
    flutterConcept: "SQLite onUpgrade() Script",
    laravelConcept: "Declarative Migrations",
    flutterSnippet: `Future<void> onUpgrade(db, oldVersion, newVersion) async {
  if (oldVersion < 2) {
    await db.execute('ALTER TABLE posts ADD COLUMN status TEXT');
  }
}`,
    laravelSnippet: `return new class extends Migration {
  public function up(): void {
    Schema::table('posts', function (Blueprint $table) {
      $table->string('status')->default('draft');
    });
  }
};`,
    explanation:
      "Instead of raw SQL version checks, Laravel migrations are timestamped PHP classes managed collaboratively in Git and executed via 'php artisan migrate'.",
    moduleId: "m4",
    lessonId: "m4l1",
  },
  {
    id: "fc-5",
    category: "State & Logic",
    flutterConcept: "Riverpod / BLoC Handlers",
    laravelConcept: "Controller Action Methods",
    flutterSnippet: `class PostNotifier extends StateNotifier<AsyncValue<List<Post>>> {
  Future<void> createPost(String title) async {
    state = const AsyncLoading();
    final post = await api.createPost(title);
    state = AsyncData([...state.value ?? [], post]);
  }
}`,
    laravelSnippet: `class PostController extends Controller {
  public function store(StorePostRequest $request): JsonResponse {
    $post = Post::create($request->validated());
    return response()->json(new PostResource($post), 201);
  }
}`,
    explanation:
      "Controllers are triggered by HTTP requests just like BLoC event handlers are triggered by UI user interactions.",
    moduleId: "m7",
    lessonId: "m7l1",
  },
  {
    id: "fc-6",
    category: "Routing",
    flutterConcept: "GoRouter Nested ShellRoutes",
    laravelConcept: "routes/api.php Route Groups",
    flutterSnippet: `GoRoute(
  path: '/api/v1',
  routes: [
    GoRoute(path: 'posts', builder: (_, __) => PostScreen()),
  ],
);`,
    laravelSnippet: `Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
  Route::apiResource('posts', PostController::class);
});`,
    explanation:
      "Route groups nest endpoints under URL prefixes, apply middleware bundles, and enforce stateless API semantics.",
    moduleId: "m7",
    lessonId: "m7l1",
  },
  {
    id: "fc-7",
    category: "Error Handling",
    flutterConcept: "try-catch DioException (422)",
    laravelConcept: "FormRequest Validation Envelope",
    flutterSnippet: `try {
  await dio.post('/posts', data: payload);
} on DioException catch (e) {
  if (e.response?.statusCode == 422) {
    final errors = e.response?.data['errors']; // Map<String, List>
  }
}`,
    laravelSnippet: `class StorePostRequest extends FormRequest {
  public function rules(): array {
    return [
      'title' => 'required|string|max:255',
      'body' => 'required|min:10',
    ];
  }
}`,
    explanation:
      "Laravel automatically halts invalid requests and returns RFC 7807 422 Unprocessable Content with a standardized 'errors' map.",
    moduleId: "m9",
    lessonId: "m9l1",
  },
  {
    id: "fc-8",
    category: "Real-Time",
    flutterConcept: "StreamBuilder & WebSockets",
    laravelConcept: "Laravel Echo & Broadcasting",
    flutterSnippet: `final channel = WebSocketChannel.connect(url);
StreamBuilder(
  stream: channel.stream,
  builder: (context, snapshot) => ChatBubble(snapshot.data),
);`,
    laravelSnippet: `class MessageSent implements ShouldBroadcast {
  public function broadcastOn(): Channel {
    return new PrivateChannel('chat.' . $this->message->room_id);
  }
}`,
    explanation:
      "When Eloquent models dispatch ShouldBroadcast events, Laravel publishes them via WebSockets/Pusher to client Echo listeners.",
    moduleId: "m14",
    lessonId: "m14l2",
  },
  {
    id: "fc-9",
    category: "Async & Workers",
    flutterConcept: "Dart Background Isolates",
    laravelConcept: "Laravel Horizon Queue Jobs",
    flutterSnippet: `// Offload heavy calculation from main UI thread
final result = await compute(processImageData, bytes);`,
    laravelSnippet: `// Dispatch heavy job off HTTP thread
GeneratePdfReport::dispatch($order)->onQueue('reports');
// HTTP response returns immediately in <50ms!`,
    explanation:
      "Queues prevent slow operations (image compression, emailing) from delaying mobile HTTP response times.",
    moduleId: "m14",
    lessonId: "m14l1",
  },
  {
    id: "fc-10",
    category: "Performance & Caching",
    flutterConcept: "Hive / SharedPreferences Cache",
    laravelConcept: "Redis Cache Store",
    flutterSnippet: `final box = Hive.box('cache');
if (box.containsKey('feed')) return box.get('feed');
final data = await api.getFeed();
box.put('feed', data);`,
    laravelSnippet: `return Cache::remember('posts.trending', 3600, function () {
  return Post::with('author')->popular()->take(10)->get();
});`,
    explanation:
      "Cache::remember checks in-memory Redis first; only querying MySQL/PostgreSQL if the cache key has expired.",
    moduleId: "m15",
    lessonId: "m15l2",
  },
  {
    id: "fc-11",
    category: "File Uploads",
    flutterConcept: "MultipartFile with Dio FormData",
    laravelConcept: "UploadedFile Storage Disk",
    flutterSnippet: `final formData = FormData.fromMap({
  'avatar': await MultipartFile.fromFile(imageFile.path),
});
await dio.post('/api/v1/avatar', data: formData);`,
    laravelSnippet: `$path = $request->file('avatar')->store('avatars', 's3');
$user->update(['avatar_url' => Storage::disk('s3')->url($path)]);`,
    explanation:
      "Laravel abstracts local disk, AWS S3, or Supabase Storage with an identical unified Storage API.",
    moduleId: "m13",
    lessonId: "m13l1",
  },
  {
    id: "fc-12",
    category: "Collection Feeds",
    flutterConcept: "ListView.builder ScrollController",
    laravelConcept: "Cursor-Based Pagination",
    flutterSnippet: `if (scrollController.position.pixels >= maxScroll) {
  fetchNextPage(cursor: nextCursor);
}`,
    laravelSnippet: `return PostResource::collection(
  Post::orderBy('id', 'desc')->cursorPaginate(15)
);`,
    explanation:
      "Cursor pagination uses WHERE id < cursor instead of OFFSET, preventing duplicate items during infinite mobile scrolling.",
    moduleId: "m12",
    lessonId: "m12l2",
  },
];

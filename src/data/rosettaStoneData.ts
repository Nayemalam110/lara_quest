// ==============================================================================
// 📖 Flutter ↔ Laravel Rosetta Stone Data Dictionary
// Quick Reference Hub: Architectural Parallels, HTTP Envelopes & Artisan CLI
// ==============================================================================

export interface RosettaConcept {
  id: string;
  category: string;
  title: string;
  flutterParallel: string;
  laravelParallel: string;
  description: string;
  flutterSnippet: string;
  laravelSnippet: string;
  proTip: string;
}

export interface StatusCodeGuide {
  code: number;
  phrase: string;
  category: string;
  description: string;
  flutterHandling: string;
  laravelEnvelope: string;
}

export interface ArtisanCommand {
  category: string;
  command: string;
  description: string;
  example: string;
}

export const ROSETTA_CONCEPTS: RosettaConcept[] = [
  {
    id: 'rc-1',
    category: 'Networking & HTTP',
    title: 'Client Interceptors ↔ Server Middleware',
    flutterParallel: 'Dio InterceptorsWrapper',
    laravelParallel: 'Http Middleware Pipeline',
    description:
      'In Flutter, Dio Interceptors intercept outgoing requests to attach Bearer tokens or incoming responses to catch 401s. In Laravel, Middleware wraps incoming requests before they touch controllers to authenticate or throttle.',
    flutterSnippet: `dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    options.headers['Authorization'] = 'Bearer $token';
    return handler.next(options);
  },
  onError: (DioException error, handler) {
    if (error.response?.statusCode == 401) {
      authService.refreshToken();
    }
    return handler.next(error);
  },
));`,
    laravelSnippet: `// app/Http/Middleware/EnsureTokenIsValid.php
public function handle(Request $request, Closure $next): Response
{
    if (! $request->bearerToken() || ! $this->isValid($request)) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    return $next($request);
}`,
    proTip:
      'Treat middleware as an onion layer: Laravel middleware runs on the server before controller execution, while Dio interceptors run inside the client engine before the network socket opens.',
  },
  {
    id: 'rc-2',
    category: 'Database & Models',
    title: 'Model Deserialization ↔ API JSON Resources',
    flutterParallel: 'fromJson() / Freezed',
    laravelParallel: 'Eloquent API Resource',
    description:
      'In Flutter, fromJson() factory constructors parse raw JSON maps into typed Dart models. In Laravel, JsonResource transforms Eloquent database models into client-friendly, sanitized JSON envelopes.',
    flutterSnippet: `class Post {
  final int id;
  final String title;

  Post({required this.id, required this.title});

  factory Post.fromJson(Map<String, dynamic> json) => Post(
    id: json['id'] as int,
    title: json['title'] as String,
  );
}`,
    laravelSnippet: `// app/Http/Resources/PostResource.php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}`,
    proTip:
      'Never return raw Eloquent models from controllers! Eloquent models leak internal database column names and hidden fields. Always wrap them in a JsonResource.',
  },
  {
    id: 'rc-3',
    category: 'Security & Storage',
    title: 'Secure Keychain ↔ Sanctum Token Vault',
    flutterParallel: 'FlutterSecureStorage',
    laravelParallel: 'Laravel Sanctum API Tokens',
    description:
      'On mobile devices, FlutterSecureStorage writes JWT or Bearer tokens to encrypted iOS Keychain / Android Keystore. Laravel Sanctum issues hashed SHA-256 tokens stored in the personal_access_tokens database table.',
    flutterSnippet: `final storage = const FlutterSecureStorage();

// Save token upon successful login
await storage.write(key: 'auth_token', value: response.data['token']);

// Read token for Authorization header
final token = await storage.read(key: 'auth_token');`,
    laravelSnippet: `// routes/api.php
Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->firstOrFail();
    if (! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 422);
    }
    $token = $user->createToken('mobile-flutter')->plainTextToken;
    return response()->json(['token' => $token, 'user' => $user]);
});`,
    proTip:
      'Sanctum plainTextToken is only visible ONCE during generation. After that, Laravel stores only the SHA-256 hash in PostgreSQL/MySQL for zero-trust security.',
  },
  {
    id: 'rc-4',
    category: 'Architecture & State',
    title: 'Client State Management ↔ Service Layer',
    flutterParallel: 'Bloc / Riverpod StateNotifier',
    laravelParallel: 'Domain Service / Action Classes',
    description:
      'In Flutter, BLoC or Riverpod encapsulates client UI state transitions and business logic. In Laravel, Service and Action classes encapsulate business rules away from HTTP controllers.',
    flutterSnippet: `class OrderCubit extends Cubit<OrderState> {
  final OrderRepository _repo;
  OrderCubit(this._repo) : super(OrderInitial());

  Future<void> checkout(Cart cart) async {
    emit(OrderLoading());
    try {
      final order = await _repo.placeOrder(cart);
      emit(OrderSuccess(order));
    } catch (e) {
      emit(OrderFailure(e.toString()));
    }
  }
}`,
    laravelSnippet: `// app/Services/CheckoutService.php
class CheckoutService
{
    public function execute(User $user, Cart $cart): Order
    {
        return DB::transaction(function () use ($user, $cart) {
            $order = Order::create(['user_id' => $user->id, 'total' => $cart->total]);
            $this->paymentGateway->charge($user, $cart->total);
            event(new OrderPlaced($order));
            return $order;
        });
    }
}`,
    proTip:
      'Keep Laravel controllers skinny! A controller should only validate requests, delegate to a Service class, and return a JsonResource.',
  },
  {
    id: 'rc-5',
    category: 'Database & Models',
    title: 'SQFlite Local Storage ↔ Eloquent Relational ORM',
    flutterParallel: 'sqflite / Drift Table',
    laravelParallel: 'Eloquent Model & Relations',
    description:
      'Flutter developers use sqflite or Drift for offline caching with raw SQL or generated DAOs. Laravel uses Eloquent Active Record with dynamic relation methods like hasMany() and belongsTo().',
    flutterSnippet: `// Drift table definition
class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get name => text().withLength(min: 1, max: 100)();
  TextColumn get email => text().unique()();
}`,
    laravelSnippet: `// app/Models/User.php
class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}`,
    proTip:
      'Always eager load relations using with() in Eloquent (e.g. User::with("posts")->get()) to eliminate the classic N+1 database performance bug.',
  },
  {
    id: 'rc-6',
    category: 'Networking & HTTP',
    title: 'Form Validation ↔ Laravel FormRequest',
    flutterParallel: 'GlobalKey<FormState> & Validator',
    laravelParallel: 'FormRequest / Validator',
    description:
      'Flutter validates inputs locally before dispatching HTTP calls. Laravel validates incoming payloads on the server via FormRequest classes, returning automatic 422 JSON envelopes on failure.',
    flutterSnippet: `TextFormField(
  validator: (value) {
    if (value == null || value.isEmpty) return 'Title is required';
    if (value.length < 5) return 'Title must be at least 5 chars';
    return null;
  },
);`,
    laravelSnippet: `// app/Http/Requests/StorePostRequest.php
class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:5', 'max:255'],
            'body' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }
}`,
    proTip:
      'When Laravel fails validation, it halts execution and returns HTTP 422 with a structured {"message": "...", "errors": {"title": [...]}} envelope matching Flutter field names.',
  },
  {
    id: 'rc-7',
    category: 'Async & Workers',
    title: 'Dart compute() Isolates ↔ Laravel Queue Jobs',
    flutterParallel: 'compute(heavyTask, data)',
    laravelParallel: 'Queue::push(new HeavyJob())',
    description:
      'In Flutter, heavy CPU computation is offloaded to a background Dart Isolate via compute(). In Laravel, heavy server tasks (video encoding, sending mail, generating PDFs) are dispatched to Redis/DB queues.',
    flutterSnippet: `// Offload JSON parsing or image compression to an Isolate
Future<List<Item>> parseItemsInBackground(String rawJson) async {
  return compute(_isolateParse, rawJson);
}

List<Item> _isolateParse(String json) => jsonDecode(json);`,
    laravelSnippet: `// app/Jobs/ProcessVideoUpload.php
class ProcessVideoUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(FfmpegService $ffmpeg): void
    {
        $ffmpeg->transcode($this->videoPath, '1080p');
    }
}`,
    proTip:
      'Mobile clients should never wait for synchronous heavy tasks. Return HTTP 202 Accepted with a job ID and push updates via WebSockets or polling.',
  },
  {
    id: 'rc-8',
    category: 'Security & Storage',
    title: 'Route Guards ↔ Laravel Gates & Policies',
    flutterParallel: 'AutoRoute / GoRouter redirect',
    laravelParallel: 'Policies & authorize()',
    description:
      'In Flutter, router guards check if user is logged in before rendering screens. In Laravel, Gates and Policies enforce resource-level authorization (can user edit THIS specific post?).',
    flutterSnippet: `GoRoute(
  path: '/admin',
  redirect: (context, state) {
    final user = authProvider.currentUser;
    return user?.isAdmin == true ? null : '/forbidden';
  },
);`,
    laravelSnippet: `// app/Policies/PostPolicy.php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->user_id || $user->hasRole('admin');
}

// In Controller:
$this->authorize('update', $post);`,
    proTip:
      'Authorization (Can I touch this resource?) is different from Authentication (Who am I?). Sanctum handles auth; Policies handle authorization.',
  },
  {
    id: 'rc-9',
    category: 'Architecture & State',
    title: 'Dependency Injection: GetIt ↔ Service Container',
    flutterParallel: 'GetIt.instance.registerSingleton()',
    laravelParallel: 'app()->singleton() / Auto-wiring',
    description:
      'Flutter uses service locators like get_it to decouple services from widgets. Laravel features a powerful reflection-based Service Container with automatic dependency injection in constructors.',
    flutterSnippet: `final getIt = GetIt.instance;

void setupLocator() {
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(Dio()));
  getIt.registerFactory<UserRepository>(() => UserRepository(getIt()));
}`,
    laravelSnippet: `// app/Providers/AppServiceProvider.php
public function register(): void
{
    $this->app->singleton(PaymentGateway::class, function ($app) {
        return new StripePaymentGateway(config('services.stripe.secret'));
    });
}

// In Controller constructor (Automatic Auto-wiring!):
public function __construct(protected PaymentGateway $gateway) {}`,
    proTip:
      'In Laravel, you rarely need manual container calls like app(Foo::class). Simply type-hint the class in any controller method or constructor, and Laravel resolves it automatically!',
  },
  {
    id: 'rc-10',
    category: 'Async & Workers',
    title: 'Event Streams ↔ Domain Events & Listeners',
    flutterParallel: 'StreamController / EventBus',
    laravelParallel: 'Event::dispatch() & Listeners',
    description:
      'Flutter widgets listen to reactive Dart Streams for asynchronous updates. Laravel dispatches Domain Events that trigger multiple decoupled, queued Listeners.',
    flutterSnippet: `final _eventController = StreamController<UserEvent>.broadcast();
Stream<UserEvent> get events => _eventController.stream;

void notifyUserLoggedIn(User user) {
  _eventController.add(UserLoggedInEvent(user));
}`,
    laravelSnippet: `// Dispatch event:
event(new UserRegistered($user));

// app/Listeners/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue
{
    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user)->send(new WelcomeMail());
    }
}`,
    proTip:
      'Use domain events to keep business processes completely decoupled. An order completion event can update inventory, generate invoices, and push mobile notifications in parallel.',
  },
];

export const STATUS_CODE_GUIDES: StatusCodeGuide[] = [
  {
    code: 200,
    phrase: 'OK',
    category: '2xx Success',
    description: 'The standard response for successful HTTP requests (GET, PUT, PATCH).',
    flutterHandling: 'Check response.statusCode == 200 and deserialize data map.',
    laravelEnvelope: `{
  "data": { "id": 1, "title": "Mastering Eloquent" },
  "meta": { "timestamp": "2026-10-02T09:00:00Z" }
}`,
  },
  {
    code: 201,
    phrase: 'Created',
    category: '2xx Success',
    description: 'The request succeeded and a new database resource was created (POST).',
    flutterHandling: 'Check response.statusCode == 201 and navigate to newly created detail screen.',
    laravelEnvelope: `{
  "message": "Resource created successfully.",
  "data": { "id": 42, "name": "Payment #42", "status": "pending" }
}`,
  },
  {
    code: 204,
    phrase: 'No Content',
    category: '2xx Success',
    description: 'The action succeeded but there is no JSON body to return (DELETE).',
    flutterHandling: 'Do not parse response.data! Simply update local state or pop screen.',
    laravelEnvelope: `// Empty response body (HTTP Header only)
// return response()->noContent();`,
  },
  {
    code: 400,
    phrase: 'Bad Request',
    category: '4xx Client Error',
    description: 'The server cannot process the request due to malformed syntax.',
    flutterHandling: 'Inspect error.response?.data["message"] and show error banner.',
    laravelEnvelope: `{
  "message": "Malformed JSON payload or invalid query syntax."
}`,
  },
  {
    code: 401,
    phrase: 'Unauthorized',
    category: '4xx Client Error',
    description: 'Missing or invalid Bearer authentication token.',
    flutterHandling: 'Trigger automatic token refresh or redirect user to /login.',
    laravelEnvelope: `{
  "message": "Unauthenticated."
}`,
  },
  {
    code: 403,
    phrase: 'Forbidden',
    category: '4xx Client Error',
    description: 'Token is valid, but the user does not have permission (Gate/Policy denied).',
    flutterHandling: 'Show "Access Denied: You do not own this resource" dialog.',
    laravelEnvelope: `{
  "message": "This action is unauthorized by PostPolicy."
}`,
  },
  {
    code: 404,
    phrase: 'Not Found',
    category: '4xx Client Error',
    description: 'The requested route endpoint or database model record does not exist.',
    flutterHandling: 'Display "Resource not found" placeholder or empty state.',
    laravelEnvelope: `{
  "message": "No query results for model [App\\\\Models\\\\Post] 999"
}`,
  },
  {
    code: 422,
    phrase: 'Unprocessable Content',
    category: '4xx Client Error',
    description: 'Request syntax is valid, but failed business/validation rules.',
    flutterHandling: 'Map errors dictionary directly to Flutter FormField errorText.',
    laravelEnvelope: `{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}`,
  },
  {
    code: 500,
    phrase: 'Internal Server Error',
    category: '5xx Server Error',
    description: 'An unexpected unhandled exception occurred on the Laravel server.',
    flutterHandling: 'Show generic "Server error, our team has been notified" toast.',
    laravelEnvelope: `{
  "message": "Server Error",
  "exception": "PDOException",
  "file": "app/Services/OrderService.php"
}`,
  },
];

export const ARTISAN_COMMANDS: ArtisanCommand[] = [
  {
    category: 'Development Server',
    command: 'php artisan serve --host=0.0.0.0 --port=8000',
    description: 'Starts the local PHP development server accessible from Flutter physical devices or emulators.',
    example: 'Connect Flutter via http://10.0.2.2:8000 (Android) or http://localhost:8000 (iOS).',
  },
  {
    category: 'Scaffolding & Code Gen',
    command: 'php artisan make:model Post -mcrR --api',
    description: 'Generates Model, Migration, Controller, Resource, and FormRequest with a single command.',
    example: '-m (migration), -c (controller), -r (resource routes), -R (form request).',
  },
  {
    category: 'Database Migrations',
    command: 'php artisan migrate:status',
    description: 'Lists all migration files and whether each has been applied to the current database.',
    example: 'Run before pushing to production to verify database sync.',
  },
  {
    category: 'Database Reset',
    command: 'php artisan migrate:fresh --seed',
    description: 'Drops all tables and re-executes all migrations from scratch, running seeders.',
    example: 'Resets database to pristine development state.',
  },
  {
    category: 'Routing & Endpoints',
    command: 'php artisan route:list --path=api',
    description: 'Displays all registered API routes, HTTP verbs, URI paths, and controller actions.',
    example: 'Essential when mapping Flutter Dio endpoints to verify exact server paths.',
  },
  {
    category: 'Interactive REPL',
    command: 'php artisan tinker',
    description: 'Opens an interactive PsySH shell to query Eloquent models and test logic live.',
    example: 'Type User::count() or Post::first()->tags to inspect database relations instantly.',
  },
  {
    category: 'API Resources',
    command: 'php artisan make:resource UserResource',
    description: 'Creates a dedicated Eloquent JsonResource transformation class for API responses.',
    example: 'Used to sanitize and format data before sending to Flutter clients.',
  },
  {
    category: 'Async Workers',
    command: 'php artisan queue:work --tries=3',
    description: 'Starts the background worker daemon to process queued jobs (emails, notifications).',
    example: 'Essential for running background tasks without blocking mobile requests.',
  },
  {
    category: 'Cache Invalidation',
    command: 'php artisan optimize:clear',
    description: 'Clears all cached configuration, routes, compiled views, and framework caches.',
    example: 'Run whenever route changes or .env updates are not reflecting.',
  },
  {
    category: 'Security & Auth',
    command: 'php artisan sanctum:prune-expired',
    description: 'Cleans up and deletes expired personal access tokens from the database.',
    example: 'Runs on a scheduled cron to maintain database hygiene.',
  },
];

import type { PgTable, PgColumn } from "./SchemaPlayground";

/**
 * Converts a table name like "order_items" or "users" to PascalCase singular "OrderItem" / "User".
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^([a-z])/, (_, letter) => letter.toUpperCase())
    .replace(/s$/, ""); // Simple singularization
}

/**
 * Converts SQL type string to Dart type.
 */
export function sqlToDartType(sqlType: string): { type: string; isNullable: boolean } {
  const lower = sqlType.toLowerCase();
  if (lower.startsWith("bigint") || lower.startsWith("int")) return { type: "int", isNullable: false };
  if (lower.startsWith("varchar") || lower.startsWith("text")) return { type: "String", isNullable: false };
  if (lower.startsWith("bool")) return { type: "bool", isNullable: false };
  if (lower.startsWith("timestamp") || lower.startsWith("date")) return { type: "DateTime", isNullable: true };
  if (lower.startsWith("decimal") || lower.startsWith("float") || lower.startsWith("double")) return { type: "double", isNullable: false };
  if (lower.startsWith("json")) return { type: "Map<String, dynamic>", isNullable: true };
  return { type: "dynamic", isNullable: true };
}

/**
 * 1. Generates Laravel 11 Migration code.
 */
export function generateLaravelMigrations(tables: PgTable[]): string {
  if (tables.length === 0) return "// No tables defined in Schema Playground.";

  const upStatements: string[] = [];
  const downStatements: string[] = [];

  for (const t of tables) {
    const colLines: string[] = [];
    let hasCreatedAt = false;
    let hasUpdatedAt = false;

    for (const c of t.columns) {
      if (c.name === "created_at") hasCreatedAt = true;
      if (c.name === "updated_at") hasUpdatedAt = true;

      if (c.key === "PK") {
        colLines.push(`            $table->id();`);
      } else if (c.key === "FK" && c.refTableId) {
        const refTable = tables.find((x) => x.id === c.refTableId);
        const refName = refTable ? refTable.name : "target";
        const onDel = c.onDelete || "CASCADE";
        const delMethod =
          onDel === "RESTRICT"
            ? "->restrictOnDelete()"
            : onDel === "SET NULL"
            ? "->nullOnDelete()"
            : "->onDelete('cascade')";

        colLines.push(
          `            $table->foreignId('${c.name}')->constrained('${refName}')${delMethod};`
        );
      } else {
        const lower = c.type.toLowerCase();
        if (c.name === "created_at" || c.name === "updated_at") {
          continue; // Handled below by timestamps()
        } else if (lower.startsWith("varchar")) {
          colLines.push(`            $table->string('${c.name}');`);
        } else if (lower.startsWith("text")) {
          colLines.push(`            $table->text('${c.name}');`);
        } else if (lower.startsWith("integer") || lower.startsWith("int")) {
          colLines.push(`            $table->integer('${c.name}');`);
        } else if (lower.startsWith("bigint")) {
          colLines.push(`            $table->bigInteger('${c.name}');`);
        } else if (lower.startsWith("boolean") || lower.startsWith("bool")) {
          colLines.push(`            $table->boolean('${c.name}')->default(false);`);
        } else if (lower.startsWith("timestamp")) {
          colLines.push(`            $table->timestamp('${c.name}')->nullable();`);
        } else if (lower.startsWith("date")) {
          colLines.push(`            $table->date('${c.name}')->nullable();`);
        } else if (lower.startsWith("json")) {
          colLines.push(`            $table->json('${c.name}')->nullable();`);
        } else if (lower.startsWith("decimal")) {
          colLines.push(`            $table->decimal('${c.name}', 10, 2);`);
        } else {
          colLines.push(`            $table->string('${c.name}');`);
        }
      }
    }

    if (hasCreatedAt || hasUpdatedAt || !t.columns.some((c) => c.name === "created_at")) {
      colLines.push(`            $table->timestamps();`);
    }

    upStatements.push(`        Schema::create('${t.name}', function (Blueprint $table) {
${colLines.join("\n")}
        });`);

    downStatements.unshift(`        Schema::dropIfExists('${t.name}');`);
  }

  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
${upStatements.join("\n\n")}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
${downStatements.join("\n")}
    }
};
`;
}

/**
 * 2. Generates PostgreSQL DDL.
 */
export function generatePostgreSqlDdl(tables: PgTable[]): string {
  if (tables.length === 0) return "-- No tables defined in Schema Playground.";

  const tableDDLs: string[] = [];
  const fkConstraints: string[] = [];

  for (const t of tables) {
    const colDefs: string[] = [];

    for (const c of t.columns) {
      if (c.key === "PK") {
        colDefs.push(`    "${c.name}" BIGSERIAL PRIMARY KEY`);
      } else {
        let pgType = "TEXT";
        const lower = c.type.toLowerCase();
        if (lower.startsWith("varchar")) pgType = "VARCHAR(255) NOT NULL";
        else if (lower.startsWith("text")) pgType = "TEXT NOT NULL";
        else if (lower.startsWith("bigint")) pgType = "BIGINT NOT NULL";
        else if (lower.startsWith("integer") || lower.startsWith("int")) pgType = "INTEGER NOT NULL";
        else if (lower.startsWith("boolean") || lower.startsWith("bool")) pgType = "BOOLEAN DEFAULT FALSE";
        else if (lower.startsWith("timestamp")) pgType = "TIMESTAMPTZ DEFAULT NOW()";
        else if (lower.startsWith("date")) pgType = "DATE";
        else if (lower.startsWith("json")) pgType = "JSONB DEFAULT '{}'";
        else if (lower.startsWith("decimal")) pgType = "NUMERIC(10, 2) NOT NULL";

        colDefs.push(`    "${c.name}" ${pgType}`);

        if (c.key === "FK" && c.refTableId) {
          const refTable = tables.find((x) => x.id === c.refTableId);
          const refName = refTable ? refTable.name : "target";
          const refCol = refTable?.columns.find((cc) => cc.id === c.refColumnId)?.name || "id";
          const onDel = c.onDelete || "CASCADE";

          fkConstraints.push(
            `ALTER TABLE "${t.name}" ADD CONSTRAINT "fk_${t.name}_${c.name}" FOREIGN KEY ("${c.name}") REFERENCES "${refName}" ("${refCol}") ON DELETE ${onDel};`
          );
        }
      }
    }

    tableDDLs.push(
      `-- Table: ${t.name}\nCREATE TABLE IF NOT EXISTS "${t.name}" (\n${colDefs.join(",\n")}\n);`
    );
  }

  return `-- ==============================================================================
-- 🐘 PostgreSQL DDL — Generated by LaraQuest Schema Playground
-- ==============================================================================

${tableDDLs.join("\n\n")}

-- Foreign Key Constraints
${fkConstraints.length > 0 ? fkConstraints.join("\n") : "-- No foreign keys configured."}
`;
}

/**
 * 3. Generates typed Flutter / Dart Models.
 */
export function generateFlutterDartModels(tables: PgTable[]): string {
  if (tables.length === 0) return "// No tables defined in Schema Playground.";

  const classes: string[] = [];

  for (const t of tables) {
    const className = `${toPascalCase(t.name)}Model`;
    const fields: string[] = [];
    const constructorParams: string[] = [];
    const fromJsonLines: string[] = [];
    const toJsonLines: string[] = [];
    const copyWithParams: string[] = [];
    const copyWithAssigns: string[] = [];

    for (const c of t.columns) {
      const fieldName = c.name.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      const { type, isNullable } = sqlToDartType(c.type);
      const isDate = type === "DateTime";
      const dartTypeStr = isNullable ? `${type}?` : type;

      fields.push(`  final ${dartTypeStr} ${fieldName};`);
      constructorParams.push(isNullable ? `    this.${fieldName},` : `    required this.${fieldName},`);

      if (isDate) {
        fromJsonLines.push(
          `      ${fieldName}: json['${c.name}'] != null ? DateTime.parse(json['${c.name}'] as String) : null,`
        );
        toJsonLines.push(`      '${c.name}': ${fieldName}?.toIso8601String(),`);
      } else if (type === "int") {
        fromJsonLines.push(`      ${fieldName}: (json['${c.name}'] as num).toInt(),`);
        toJsonLines.push(`      '${c.name}': ${fieldName},`);
      } else if (type === "double") {
        fromJsonLines.push(`      ${fieldName}: (json['${c.name}'] as num).toDouble(),`);
        toJsonLines.push(`      '${c.name}': ${fieldName},`);
      } else {
        fromJsonLines.push(`      ${fieldName}: json['${c.name}'] as ${type},`);
        toJsonLines.push(`      '${c.name}': ${fieldName},`);
      }

      copyWithParams.push(`    ${type}? ${fieldName},`);
      copyWithAssigns.push(`      ${fieldName}: ${fieldName} ?? this.${fieldName},`);
    }

    classes.push(`/// Data Model for \`${t.name}\` table
class ${className} {
${fields.join("\n")}

  const ${className}({
${constructorParams.join("\n")}
  });

  factory ${className}.fromJson(Map<String, dynamic> json) {
    return ${className}(
${fromJsonLines.join("\n")}
    );
  }

  Map<String, dynamic> toJson() {
    return {
${toJsonLines.join("\n")}
    };
  }

  ${className} copyWith({
${copyWithParams.join("\n")}
  }) {
    return ${className}(
${copyWithAssigns.join("\n")}
    );
  }
}`);
  }

  return `// ==============================================================================
// 🎯 Flutter / Dart Models — Generated by LaraQuest Schema Playground
// ==============================================================================

${classes.join("\n\n")}
`;
}

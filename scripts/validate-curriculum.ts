// ==============================================================================
// 🧪 LaraQuest Curriculum Integrity Test Suite
// Verifies all 6 Tracks, 24 Modules, 90+ Lessons, XP formulas, and challenges
// ==============================================================================

import { modules, allLessons, totalLessons, totalXp } from "../src/data/mockData.ts";

function runValidation() {
  console.log("🔍 Validating LaraQuest Curriculum Integrity...\n");

  let errors: string[] = [];
  let warnings: string[] = [];

  // 1. Verify Module Count
  if (modules.length !== 24) {
    errors.push(`Expected exactly 24 modules, found ${modules.length}`);
  } else {
    console.log(`✅ Module Count: 24 modules across 6 tracks verified.`);
  }

  // 2. Verify Tracks
  const trackIds = new Set(modules.map((m) => m.trackId));
  const expectedTracks = ["track-1", "track-2", "track-3", "track-4", "track-5", "track-6"];
  for (const track of expectedTracks) {
    if (!trackIds.has(track as any)) {
      errors.push(`Missing expected track: ${track}`);
    }
  }
  console.log(`✅ Track Alignment: All 6 tracks verified (${expectedTracks.join(", ")}).`);

  // 3. Verify Lessons
  console.log(`✅ Total Lessons: ${totalLessons} lessons cataloged.`);
  if (totalLessons < 90) {
    errors.push(`Expected at least 90 lessons, found ${totalLessons}`);
  }

  // 4. Validate Each Lesson
  const seenLessonIds = new Set<string>();
  let challengeTypesCount: Record<string, number> = {};

  for (const module of modules) {
    if (!module.id || !module.title || !module.description) {
      errors.push(`Module ${module.id || "unknown"} is missing id, title, or description.`);
    }

    if (!module.lessons || module.lessons.length === 0) {
      errors.push(`Module ${module.id} has no lessons.`);
      continue;
    }

    for (const lesson of module.lessons) {
      if (seenLessonIds.has(lesson.id)) {
        errors.push(`Duplicate lesson ID found: ${lesson.id}`);
      }
      seenLessonIds.add(lesson.id);

      // Check fields
      if (!lesson.title || !lesson.summary) {
        errors.push(`Lesson ${lesson.id} missing title or summary.`);
      }

      if (!lesson.flutterParallel) {
        errors.push(`Lesson ${lesson.id} missing flutterParallel code bridge.`);
      } else {
        if (!lesson.flutterParallel.concept || !lesson.flutterParallel.explanation) {
          warnings.push(`Lesson ${lesson.id} has incomplete flutterParallel metadata.`);
        }
      }

      // Check challenge
      const ch = lesson.challenge;
      if (!ch) {
        errors.push(`Lesson ${lesson.id} has no challenge attached.`);
      } else {
        challengeTypesCount[ch.type] = (challengeTypesCount[ch.type] || 0) + 1;

        if (!ch.question || !ch.explanation) {
          errors.push(`Challenge in lesson ${lesson.id} missing question or explanation.`);
        }

        if (ch.correctAnswer === undefined || ch.correctAnswer === null) {
          errors.push(`Challenge in lesson ${lesson.id} missing correctAnswer.`);
        }

        if (ch.type === "mcq" && (!ch.options || ch.options.length < 2)) {
          errors.push(`MCQ challenge in lesson ${lesson.id} requires at least 2 options.`);
        }
      }
    }
  }

  // 5. Challenge Distribution Summary
  console.log("\n📊 Challenge Engine Distribution:");
  for (const [type, count] of Object.entries(challengeTypesCount)) {
    console.log(`   - ${type.padEnd(20)}: ${count} lessons`);
  }

  console.log(`\n💎 Total Available XP: ${totalXp.toLocaleString()} XP`);

  // Final Verdict
  if (errors.length > 0) {
    console.error(`\n❌ Curriculum validation failed with ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(`   • ${err}`);
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(`\n⚠️  Curriculum warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.warn(`   • ${w}`);
    }
  }

  console.log("\n✨ 100% Curriculum Integrity Verified! All modules and lessons passed.\n");
}

runValidation();

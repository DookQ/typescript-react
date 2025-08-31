import React, { useMemo, useState } from "react";

// แผนที่เกรด -> คะแนน (สำหรับคำนวณ GPA)
const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
  W: NaN, // ไม่คิดรวมในการคำนวณ
};

type Course = {
  id: string;
  name: string;
  grade: keyof typeof GRADE_POINTS;
};

export default function CourseGPA() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<keyof typeof GRADE_POINTS>("A");
  const [courses, setCourses] = useState<Course[]>([]);
  const [gpa, setGpa] = useState<number | null>(null);

  const canAdd = name.trim().length > 0 && grade !== undefined;

  function addCourse() {
    if (!canAdd) return;
    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: name.trim(),
      grade,
    };
    setCourses((prev) => [newCourse, ...prev]);
    setName("");
    setGrade("A");
    setGpa(null); // มีการเปลี่ยนข้อมูล ให้เคลียร์ผลลัพธ์เดิม
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setGpa(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addCourse();
  }

  function calculateGPA() {
    const valid = courses.filter((c) => !Number.isNaN(GRADE_POINTS[c.grade])); // ตัด W ออก
    const total = valid.reduce((sum, c) => sum + GRADE_POINTS[c.grade], 0);
    const gpaValue = valid.length === 0 ? 0 : total / valid.length;
    setGpa(Number(gpaValue.toFixed(2)));
  }

  const hasCourses = courses.length > 0;
  const validCount = useMemo(
    () => courses.filter((c) => !Number.isNaN(GRADE_POINTS[c.grade])).length,
    [courses]
  );

  return (
    <div style={{ maxWidth: 520, margin: "16px auto", fontFamily: "sans-serif" }}>
      <h2>บันทึกรายวิชา + เกรด (แบบพื้นฐาน)</h2>

      {/* ส่วนรับข้อมูล */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="รายชื่อวิชา"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: 6 }}
        />
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value as keyof typeof GRADE_POINTS)}
          style={{ padding: 6 }}
        >
          {Object.keys(GRADE_POINTS).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <button onClick={addCourse} disabled={!canAdd} style={{ padding: "6px 10px" }}>
          เพิ่มรายวิชา
        </button>
      </div>

      {/* รายการวิชา */}
      <div>
        {!hasCourses && <div style={{ color: "#666", fontSize: 14 }}>ยังไม่มีรายวิชา</div>}
        {courses.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              padding: 8,
              marginBottom: 6,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div
                style={{
                  color: c.grade === "F" ? "red" : undefined,
                }}
              >
                เกรด: {c.grade}
              </div>
            </div>
            <button onClick={() => removeCourse(c.id)} style={{ padding: "4px 8px" }}>
              ลบ
            </button>
          </div>
        ))}
      </div>

      {/* ปุ่มคำนวณ GPA */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={calculateGPA} disabled={!hasCourses} style={{ padding: "6px 10px" }}>
          คำนวณ GPA
        </button>
        <div style={{ alignSelf: "center" }}>
          {gpa !== null && (
            <span>
              GPA: <strong>{gpa.toFixed(2)}</strong> {validCount !== courses.length && "(ไม่นับ W)"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
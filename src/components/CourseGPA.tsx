import { useMemo, useState } from "react";
import "./CourseGPA.css"; // <-- ดึง CSS แยกไฟล์

const GRADE_POINTS: Record<string, number> = {
  A: 4.0, "B+": 3.5, B: 3.0, "C+": 2.5, C: 2.0, "D+": 1.5, D: 1.0, F: 0.0, W: NaN,
};

type Course = { id: string; name: string; grade: keyof typeof GRADE_POINTS };

export default function CourseGPA() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<keyof typeof GRADE_POINTS>("A");
  const [courses, setCourses] = useState<Course[]>([]);
  const [gpa, setGpa] = useState<number | null>(null);

  const canAdd = name.trim().length > 0;

  function addCourse() {
    if (!canAdd) return;
    setCourses((prev) => [
      { id: crypto.randomUUID(), name: name.trim(), grade },
      ...prev,
    ]);
    setName(""); setGrade("A"); setGpa(null);
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setGpa(null);
  }

  function calculateGPA() {
    const valid = courses.filter((c) => !Number.isNaN(GRADE_POINTS[c.grade])); // ตัด W
    const total = valid.reduce((s, c) => s + GRADE_POINTS[c.grade], 0);
    setGpa(Number(((valid.length ? total / valid.length : 0)).toFixed(2)));
  }

  const hasCourses = courses.length > 0;
  const validCount = useMemo(
    () => courses.filter((c) => !Number.isNaN(GRADE_POINTS[c.grade])).length,
    [courses]
  );

  return (
    <div className="wrapper">
      <div className="card">
        <h2 className="title">บันทึกรายวิชา + เกรด</h2>

        <div className="form">
          <input
            className="input"
            type="text"
            placeholder="รายชื่อวิชา"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCourse()}
          />
          <select
            className="select"
            value={grade}
            onChange={(e) => setGrade(e.target.value as keyof typeof GRADE_POINTS)}
          >
            {Object.keys(GRADE_POINTS).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button className="btn add" onClick={addCourse} disabled={!canAdd}>เพิ่มรายวิชา</button>
        </div>

        <div className="list">
          {!hasCourses && <div className="empty">ยังไม่มีรายวิชา</div>}
          {courses.map((c) => (
            <div key={c.id} className="item">
              <div>
                <div className="subject">{c.name}</div>
                <div className={`grade ${c.grade === "F" ? "fail" : ""}`}>เกรด: {c.grade}</div>
              </div>
              <button className="btn remove" onClick={() => removeCourse(c.id)}>ลบ</button>
            </div>
          ))}
        </div>

        <div className="footer">
          <button className="btn gpa" onClick={calculateGPA} disabled={!hasCourses}>
            คำนวณ GPA
          </button>
          {gpa !== null && (
            <span>
              GPA: <strong>{gpa.toFixed(2)}</strong>{" "}
              {validCount !== courses.length && "(ไม่นับ W)"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

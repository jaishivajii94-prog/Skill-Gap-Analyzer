(async function () {
  await SkillMapStorage.ready;
  const context = SkillMapHelpers.requireAssessment();
  if (!context) return;
  const { data, career } = context;
  const analysis = SkillAnalyzer.analyze(career, data.currentSkills);
  const progress = SkillAnalyzer.getProgress(career, data.completedSkills);
  const escape = SkillMapHelpers.escapeHTML;
  const profile = data.profile;

  document.getElementById("report-date").textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }).toUpperCase();
  document.getElementById("report-name").textContent = profile.name;
  document.getElementById("report-academic").textContent = [profile.degree, profile.year, profile.university].filter(Boolean).join(" · ");
  document.getElementById("report-career").textContent = career.title;
  document.getElementById("report-readiness").textContent = `${analysis.readiness}%`;
  document.getElementById("report-on-target").textContent = `${analysis.onTarget} / ${career.skills.length}`;
  document.getElementById("report-progress").textContent = `${progress.percent}%`;
  document.getElementById("report-email").textContent = profile.email;

  document.getElementById("report-skills").innerHTML = analysis.skills.map((skill) => `
    <tr><td>${escape(skill.name)}</td><td>${skill.current} / 5</td><td>${skill.target} / 5</td><td><span class="gap-pill${skill.gap === 0 ? " zero" : ""}">${skill.gap}</span></td><td><span class="status-badge${skill.meetsTarget ? " met" : ""}">${skill.meetsTarget ? "✓ On target" : "↗ Build this"}</span></td></tr>`).join("");

  const focusSkills = analysis.skills.filter((skill) => skill.gap > 0);
  document.getElementById("report-plan").innerHTML = focusSkills.length
    ? `<div class="report-plan-list">${focusSkills.map((skill, index) => {
      const advice = RecommendationGuide.getForGap(skill.gap);
      return `<div class="report-plan-item"><span class="report-plan-number">${index + 1}</span><div><strong>${escape(skill.name)} · ${advice.title}</strong><p>${advice.action}</p></div></div>`;
    }).join("")}</div>`
    : "<p class='report-plan-empty'>Every listed skill is currently at or above its target. Choose a small project to keep practicing.</p>";
})();
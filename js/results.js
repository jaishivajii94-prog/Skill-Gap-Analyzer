(async function () {
  await SkillMapStorage.ready;
  const context = SkillMapHelpers.requireAssessment();
  if (!context) return;
  const { data, career } = context;
  const analysis = SkillAnalyzer.analyze(career, data.currentSkills);
  const escape = SkillMapHelpers.escapeHTML;

  document.getElementById("results-career-label").textContent = career.title.toUpperCase();
  document.getElementById("results-greeting").textContent = `${data.profile.name.split(" ")[0]}, here's your skill snapshot for ${career.title}.`;
  document.getElementById("readiness-value").textContent = `${analysis.readiness}%`;
  document.getElementById("ring-value").innerHTML = `${analysis.readiness}<small>%</small>`;
  document.getElementById("readiness-caption").textContent = `${analysis.currentTotal} of ${analysis.targetTotal} target skill points across ${career.skills.length} skills.`;
  document.getElementById("on-target-count").textContent = analysis.onTarget;
  document.getElementById("growth-count").textContent = analysis.needsWork;
  document.getElementById("readiness-ring").style.background = `conic-gradient(#70a0ff ${Math.min(analysis.readiness, 100)}%, rgba(255,255,255,.16) 0)`;

  const pipMarkup = (level, target) => `<span class="level-pips${target ? " target-pips" : ""}">${[1, 2, 3, 4, 5].map((number) => `<i class="${number <= level ? "filled" : ""}"></i>`).join("")}</span>`;
  document.getElementById("results-table").innerHTML = analysis.skills.map((skill) => `
    <tr><td>${escape(skill.name)}</td><td><span class="level-cell">${pipMarkup(skill.current, false)} ${skill.current}</span></td><td><span class="level-cell">${pipMarkup(skill.target, true)} ${skill.target}</span></td><td><span class="gap-pill${skill.gap === 0 ? " zero" : ""}">${skill.gap}</span></td><td><span class="status-badge${skill.meetsTarget ? " met" : ""}">${skill.meetsTarget ? "✓ On target" : "↗ Build this"}</span></td></tr>`).join("");

  const nextSkill = analysis.skills.find((skill) => skill.gap > 0);
  document.getElementById("next-step-title").textContent = nextSkill ? `Start with ${nextSkill.name}.` : "Keep your skills sharp.";
  document.getElementById("next-step-copy").textContent = nextSkill ? `It's ${career.title.toLowerCase()}'s biggest opportunity in your skill map.` : "You've met every target. A small project can help you keep growing.";

  if (window.Chart) {
    new Chart(document.getElementById("skills-chart"), {
      type: "bar",
      data: {
        labels: analysis.skills.map((skill) => skill.name),
        datasets: [
          { label: "Your level", data: analysis.skills.map((skill) => skill.current), backgroundColor: "#2563eb", borderRadius: 4, barThickness: 11 },
          { label: "Career target", data: analysis.skills.map((skill) => skill.target), backgroundColor: "#c5cfdb", borderRadius: 4, barThickness: 11 }
        ]
      },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${item.raw} / 5` } } },
        scales: { x: { min: 0, max: 5, ticks: { stepSize: 1, color: "#8290a3", font: { size: 9 } }, grid: { color: "#edf1f6" }, border: { display: false } }, y: { ticks: { color: "#536176", font: { size: 10 } }, grid: { display: false }, border: { display: false } } }
      }
    });
  } else {
    document.getElementById("skills-chart").insertAdjacentHTML("afterend", "<p class='chart-fallback'>Charts need an internet connection to load. Your skill breakdown is still available in the table.</p>");
  }
})();
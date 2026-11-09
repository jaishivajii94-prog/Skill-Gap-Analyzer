(async function () {
  await SkillMapStorage.ready;
  const data = SkillMapStorage.getData();
  const welcome = document.getElementById("dashboard-greeting");
  const subtitle = document.getElementById("dashboard-subtitle");
  const primaryAction = document.getElementById("dashboard-primary-action");
  const emptyState = document.getElementById("dashboard-empty");

  if (!data.profile) {
    emptyState.hidden = false;
    return;
  }

  welcome.textContent = `Welcome back, ${data.profile.name.split(" ")[0]}.`;
  const career = SkillMapHelpers.getCareer(data.careerId);
  if (!career || Object.keys(data.currentSkills).length === 0) {
    subtitle.textContent = career ? `Your ${career.title} map is almost ready.` : "Build a skill map around the career you want.";
    primaryAction.href = career ? "assessment.html" : "profile.html";
    primaryAction.innerHTML = career ? "Continue my assessment <span aria-hidden='true'>→</span>" : "Choose a career <span aria-hidden='true'>→</span>";
    emptyState.querySelector(".eyebrow").textContent = career ? "ONE MORE STEP" : "A FRESH PAGE";
    emptyState.querySelector("h2").textContent = career ? "Your skill map is almost ready." : "Your skill map is waiting.";
    emptyState.querySelector("p:not(.eyebrow)").textContent = career ? "Rate your current skills to see where you stand and get a learning plan." : "Share your starting point, choose a career direction, and we'll lay out your first set of next steps.";
    emptyState.querySelector("a").href = primaryAction.href;
    emptyState.querySelector("a").innerHTML = primaryAction.innerHTML;
    emptyState.hidden = false;
    return;
  }

  const analysis = SkillAnalyzer.analyze(career, data.currentSkills);
  const progress = SkillAnalyzer.getProgress(career, data.completedSkills);
  document.getElementById("dashboard-content").hidden = false;
  emptyState.hidden = true;
  subtitle.textContent = `${career.title} · ${data.profile.university || "Your learning workspace"}`;
  primaryAction.href = "assessment.html";
  primaryAction.innerHTML = "Update my assessment <span aria-hidden='true'>↻</span>";

  document.getElementById("dashboard-metrics").innerHTML = `
    <article class="dashboard-metric"><span>CAREER READINESS</span><strong>${analysis.readiness}<small>%</small></strong></article>
    <article class="dashboard-metric"><span>LEARNING PROGRESS</span><strong>${progress.percent}<small>%</small></strong></article>
    <article class="dashboard-metric"><span>SKILLS ON TARGET</span><strong>${analysis.onTarget}<small> / ${career.skills.length} skills</small></strong></article>`;

  document.getElementById("dashboard-skill-list").innerHTML = analysis.skills.map((skill) => `
    <div class="dashboard-skill-row"><strong>${SkillMapHelpers.escapeHTML(skill.name)}</strong><div class="dashboard-skill-bar"><i style="width:${skill.current * 20}%"></i></div><span>${skill.current} / ${skill.target}</span></div>`).join("");

  const focus = analysis.skills.find((skill) => skill.gap > 0);
  document.getElementById("dashboard-next-title").textContent = focus ? `Try ${focus.name} next` : "Keep your skills in motion";
  document.getElementById("dashboard-next-copy").textContent = focus ? `A gap of ${focus.gap} level${focus.gap === 1 ? "" : "s"}. Your learning plan has a place to start.` : "You are meeting all the current targets. Keep practicing with a project.";
})();
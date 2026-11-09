(async function () {
  await SkillMapStorage.ready;
  const context = SkillMapHelpers.requireAssessment();
  if (!context) return;
  const { data, career } = context;
  const analysis = SkillAnalyzer.analyze(career, data.currentSkills);
  const list = document.getElementById("recommendation-list");
  const escape = SkillMapHelpers.escapeHTML;

  document.getElementById("recommendation-career").textContent = career.title.toUpperCase();
  const focusCount = analysis.skills.filter((skill) => skill.gap > 0).length;
  document.getElementById("recommendation-count").textContent = focusCount
    ? `${focusCount} skill${focusCount === 1 ? "" : "s"} to focus on · ordered by biggest gap`
    : "All career targets met · keep your skills fresh";

  function renderRecommendations() {
    const currentData = SkillMapStorage.getData();
    list.innerHTML = analysis.skills.map((skill, index) => {
      const advice = RecommendationGuide.getForGap(skill.gap);
      const isComplete = currentData.completedSkills.includes(skill.id);
      const isLearning = currentData.learningSkills.includes(skill.id);
      const actionLabel = isComplete ? "Reopen activity" : isLearning ? "Mark as complete" : "Start learning";
      const actionValue = isComplete ? "start" : isLearning ? "complete" : "start";
      const status = isComplete ? "Completed" : isLearning ? "In progress" : skill.gap === 0 ? "On target" : `${skill.gap} level${skill.gap === 1 ? "" : "s"} to grow`;

      return `<article class="recommendation-card${isComplete ? " is-complete" : ""}">
        <span class="recommendation-number">${String(index + 1).padStart(2, "0")}</span>
        <div class="recommendation-copy"><div class="recommendation-meta"><h2>${escape(skill.name)}</h2><span class="gap-label">Gap ${skill.gap}</span><span class="activity-status">${status}</span></div>
          <p><strong>${advice.title}.</strong> ${advice.action}</p>
          <a class="recommendation-resource" href="${escape(skill.resource)}" target="_blank" rel="noopener noreferrer">${escape(skill.resourceName)} <span aria-hidden="true">↗</span></a>
        </div><div class="recommendation-actions"><button class="button ${isLearning ? "button-primary" : "button-outline"}" type="button" data-action="${actionValue}" data-skill="${skill.id}">${actionLabel}</button></div>
      </article>`;
    }).join("");
  }

  list.addEventListener("click", async function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const currentData = SkillMapStorage.getData();
    const skillId = button.dataset.skill;

    if (button.dataset.action === "complete") {
      currentData.completedSkills = [...new Set([...currentData.completedSkills, skillId])];
      currentData.learningSkills = currentData.learningSkills.filter((id) => id !== skillId);
    } else {
      currentData.completedSkills = currentData.completedSkills.filter((id) => id !== skillId);
      currentData.learningSkills = [...new Set([...currentData.learningSkills, skillId])];
    }
    await SkillMapStorage.saveData(currentData);
    renderRecommendations();
  });

  renderRecommendations();
})();
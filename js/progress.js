(async function () {
  await SkillMapStorage.ready;
  const context = SkillMapHelpers.requireAssessment();
  if (!context) return;
  const { career } = context;
  const escape = SkillMapHelpers.escapeHTML;
  document.getElementById("progress-career").textContent = career.title.toUpperCase();

  function renderProgress() {
    const data = SkillMapStorage.getData();
    const progress = SkillAnalyzer.getProgress(career, data.completedSkills);
    const completed = data.completedSkills.filter((id) => career.skills.some((skill) => skill.id === id)).length;
    const learning = data.learningSkills.filter((id) => career.skills.some((skill) => skill.id === id) && !data.completedSkills.includes(id)).length;
    const remaining = progress.total - completed - learning;

    document.getElementById("progress-percent").innerHTML = `${progress.percent}<span>%</span>`;
    document.getElementById("overall-progress-bar").style.width = `${progress.percent}%`;
    document.getElementById("progress-summary").textContent = `${progress.completed} of ${progress.total} skills completed`;
    document.getElementById("completed-count").textContent = completed;
    document.getElementById("learning-count").textContent = learning;
    document.getElementById("remaining-count").textContent = remaining;

    document.getElementById("progress-list").innerHTML = career.skills.map((skill) => {
      const isComplete = data.completedSkills.includes(skill.id);
      const isLearning = data.learningSkills.includes(skill.id) && !isComplete;
      const state = isComplete ? "completed" : isLearning ? "learning" : "remaining";
      const label = isComplete ? "Completed" : isLearning ? "In progress" : "Not started";
      const buttonLabel = isComplete ? "Reopen" : isLearning ? "Mark complete" : "Start learning";
      return `<div class="progress-list-item ${state}"><div class="progress-item-name">${escape(skill.name)}<small>Target level ${skill.target} / 5</small></div><div class="progress-item-bar" aria-label="${label}"><i style="width:${isComplete ? "100" : isLearning ? "50" : "0"}%"></i></div><div class="progress-item-actions"><span class="progress-item-status">${label}</span><button class="${isLearning ? "complete-action" : ""}" type="button" data-skill="${skill.id}" data-state="${state}">${buttonLabel}</button></div></div>`;
    }).join("");
  }

  document.getElementById("progress-list").addEventListener("click", async function (event) {
    const button = event.target.closest("button[data-skill]");
    if (!button) return;
    const data = SkillMapStorage.getData();
    const skillId = button.dataset.skill;
    data.completedSkills = data.completedSkills.filter((id) => id !== skillId);
    data.learningSkills = data.learningSkills.filter((id) => id !== skillId);

    if (button.dataset.state === "learning") data.completedSkills.push(skillId);
    else if (button.dataset.state === "remaining") data.learningSkills.push(skillId);
    else data.learningSkills.push(skillId);

    await SkillMapStorage.saveData(data);
    renderProgress();
  });

  renderProgress();
})();
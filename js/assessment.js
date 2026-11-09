(async function () {
  await SkillMapStorage.ready;
  const savedData = SkillMapStorage.getData();
  const career = SkillMapHelpers.getCareer(savedData.careerId);
  if (!savedData.profile || !career) {
    window.location.replace("profile.html");
    return;
  }

  const summary = document.getElementById("assessment-summary");
  const skillsContainer = document.getElementById("assessment-skills");
  const form = document.getElementById("assessment-form");

  summary.innerHTML = `<div><span class="summary-career-symbol">${career.symbol}</span><div><strong>${career.title}</strong><p>You'll rate ${career.skills.length} skills for this career.</p></div></div><a class="text-link" href="profile.html">Change career →</a>`;
  skillsContainer.innerHTML = career.skills.map((skill) => {
    const rating = Number(savedData.currentSkills[skill.id] || 1);
    return `<div class="assessment-skill">
      <label class="skill-name" for="skill-${skill.id}">${skill.name}<span class="skill-description">Target level: ${skill.target} / 5</span></label>
      <div class="skill-control"><input class="range-input" id="skill-${skill.id}" name="${skill.id}" type="range" min="1" max="5" step="1" value="${rating}" aria-label="Rate your ${skill.name} skill from 1 to 5"><div class="scale-labels"><span>Beginner</span><span>Basic</span><span>Intermediate</span><span>Advanced</span><span>Expert</span></div></div>
      <output class="rating-output" for="skill-${skill.id}">${rating}</output>
    </div>`;
  }).join("");

  skillsContainer.addEventListener("input", function (event) {
    if (event.target.type !== "range") return;
    event.target.closest(".assessment-skill").querySelector("output").value = event.target.value;
    event.target.closest(".assessment-skill").querySelector("output").textContent = event.target.value;
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const currentSkills = {};
    career.skills.forEach((skill) => {
      currentSkills[skill.id] = Number(form.elements[skill.id].value);
    });
    await SkillMapStorage.updateData("currentSkills", currentSkills);
    window.location.href = "results.html";
  });
})();
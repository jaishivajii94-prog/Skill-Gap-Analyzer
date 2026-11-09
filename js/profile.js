(async function () {
  await SkillMapStorage.ready;
  const form = document.getElementById("profile-form");
  const choices = document.getElementById("career-choices");
  const errorMessage = document.getElementById("profile-error");
  const data = SkillMapStorage.getData();
  const requestedCareer = new URLSearchParams(window.location.search).get("career");
  const chosenCareer = CareerData.some((career) => career.id === requestedCareer) ? requestedCareer : data.careerId;

  if (data.profile) {
    Object.entries(data.profile).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field && value) field.value = value;
    });
  }

  choices.innerHTML = CareerData.map((career) => `
    <label class="career-choice${career.id === chosenCareer ? " selected" : ""}">
      <input type="radio" name="careerId" value="${career.id}" ${career.id === chosenCareer ? "checked" : ""} required>
      <span class="choice-radio" aria-hidden="true"></span><span class="choice-icon" aria-hidden="true">${career.symbol}</span>
      <span class="choice-copy"><strong>${career.title}</strong><small>${career.description}</small><span class="choice-skills">${career.skills.map((skill) => skill.name).join(" · ")}</span></span>
    </label>`).join("");

  choices.addEventListener("change", function (event) {
    if (event.target.name !== "careerId") return;
    choices.querySelectorAll(".career-choice").forEach((choice) => choice.classList.remove("selected"));
    event.target.closest(".career-choice").classList.add("selected");
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    errorMessage.textContent = "";

    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const careerId = formData.get("careerId");
    if (!careerId) {
      errorMessage.textContent = "Choose a career direction to continue.";
      return;
    }

    const updatedData = SkillMapStorage.getData();
    const profile = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      university: formData.get("university").trim(),
      degree: formData.get("degree"),
      year: formData.get("year"),
      interests: formData.get("interests").trim()
    };

    if (updatedData.careerId !== careerId) {
      updatedData.currentSkills = {};
      updatedData.completedSkills = [];
      updatedData.learningSkills = [];
    }
    updatedData.profile = profile;
    updatedData.careerId = careerId;
    await SkillMapStorage.saveData(updatedData);
    window.location.href = "assessment.html";
  });
})();
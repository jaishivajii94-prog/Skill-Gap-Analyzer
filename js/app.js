// Shared navigation and small helpers used by the separate pages.
(function () {
  const navItems = [
    ["dashboard.html", "Overview"],
    ["profile.html", "Profile"],
    ["assessment.html", "Assessment"],
    ["results.html", "Skill map"],
    ["recommendations.html", "Learning plan"],
    ["progress.html", "Progress"],
    ["report.html", "Report"]
  ];
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const header = document.getElementById("app-header");

  if (header) {
    const links = navItems.map(([url, label]) => {
      const active = currentPage === url ? " active" : "";
      return `<a class="${active.trim()}" href="${url}">${label}</a>`;
    }).join("");

    header.innerHTML = `
      <header class="app-header">
        <a class="brand" href="index.html" aria-label="SkillMap home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>skillmap<span class="brand-period">.</span></span></a>
        <nav class="app-nav" id="app-nav" aria-label="Main navigation">${links}</nav>
        <div class="app-header-actions">
          <button class="reset-button" type="button" id="reset-data" title="Clear saved student data"><span aria-hidden="true">↻</span> Reset data</button>
          <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
        </div>
      </header>`;

    document.getElementById("menu-toggle").addEventListener("click", function () {
      const nav = document.getElementById("app-nav");
      const isOpen = nav.classList.toggle("open");
      this.setAttribute("aria-expanded", String(isOpen));
    });

    document.getElementById("reset-data").addEventListener("click", async function () {
      if (window.confirm("Clear your profile, assessment, and saved learning progress?")) {
        await SkillMapStorage.ready;
        await SkillMapStorage.reset();
        window.location.href = "profile.html";
      }
    });
  }

  window.SkillMapHelpers = {
    getCareer(careerId) {
      return CareerData.find((career) => career.id === careerId);
    },
    escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[character]);
    },
    requireAssessment() {
      const data = SkillMapStorage.getData();
      const career = this.getCareer(data.careerId);
      if (!data.profile || !career || Object.keys(data.currentSkills).length === 0) {
        window.location.replace("profile.html");
        return null;
      }
      return { data, career };
    }
  };

  const landingCareers = document.getElementById("landing-careers");
  if (landingCareers && typeof CareerData !== "undefined") {
    landingCareers.innerHTML = CareerData.map((career) => `
      <a class="career-card" href="profile.html?career=${encodeURIComponent(career.id)}">
        <span class="career-card-symbol" aria-hidden="true">${career.symbol}</span>
        <span class="career-card-arrow" aria-hidden="true">↗</span>
        <h3>${career.title}</h3><p>${career.description}</p>
      </a>`).join("");
  }
})();
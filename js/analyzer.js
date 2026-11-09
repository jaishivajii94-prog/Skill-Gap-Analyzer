// Compare the student's ratings with the selected career's target levels.
const SkillAnalyzer = {
  analyze(career, currentSkills) {
    const skills = career.skills.map((skill) => {
      const current = Number(currentSkills[skill.id] || 1);
      const gap = Math.max(skill.target - current, 0);
      return { ...skill, current, gap, meetsTarget: gap === 0 };
    });

    const currentTotal = skills.reduce((total, skill) => total + skill.current, 0);
    const targetTotal = skills.reduce((total, skill) => total + skill.target, 0);
    const readiness = targetTotal ? Math.round((currentTotal / targetTotal) * 100) : 0;

    return {
      skills,
      currentTotal,
      targetTotal,
      readiness,
      onTarget: skills.filter((skill) => skill.meetsTarget).length,
      needsWork: skills.filter((skill) => !skill.meetsTarget).length
    };
  },

  getProgress(career, completedSkills) {
    const completed = career.skills.filter((skill) => completedSkills.includes(skill.id)).length;
    const total = career.skills.length;
    return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
  }
};
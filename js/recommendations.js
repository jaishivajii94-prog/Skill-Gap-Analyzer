// Turn each numeric gap into a clear, beginner-friendly next action.
const RecommendationGuide = {
  getForGap(gap) {
    if (gap === 0) {
      return { title: "Maintain your current level", action: "Try a small project or revisit this skill in a few weeks to keep it fresh." };
    }
    if (gap === 1) {
      return { title: "Practice a little more", action: "Use short exercises to build confidence and make the basics feel natural." };
    }
    if (gap === 2) {
      return { title: "Try an intermediate tutorial", action: "Follow a guided tutorial, then adapt the example into a small project." };
    }
    if (gap === 5) {
      return { title: "Start with the basics", action: "Begin with the fundamentals and take one topic at a time." };
    }
    return { title: "Follow a structured course", action: "Work through a beginner-friendly course in order, and practice each topic as you go." };
  }
};
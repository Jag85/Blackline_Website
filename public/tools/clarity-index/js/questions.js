const assessmentData = {
    title: "Founder Clarity Index",
    subtitle: "Find out whether your idea is clear enough to build.",
    description: "The Founder Clarity Index helps aspiring entrepreneurs identify whether they have a real problem, a real audience, a clear solution, and the readiness to take action.",
    pillars: [
        {
            id: "problem",
            title: "Problem Clarity",
            description: "This section determines whether the founder understands a real problem.",
            questions: [
                "I can clearly describe the problem I want to solve in one sentence.",
                "I know who specifically experiences this problem.",
                "I understand how often this problem occurs.",
                "I understand what happens when this problem is not solved.",
                "I have personally experienced or clearly observed this problem."
            ],
            interpretations: [
                { min: 0, max: 10, text: "You don’t yet have a clearly defined problem." },
                { min: 11, max: 18, text: "You see a problem, but it still needs sharper definition." },
                { min: 19, max: 25, text: "You’ve identified a real and meaningful problem." }
            ],
            recommendations: [
                "Talk to 3–5 people experiencing the problem",
                "Refine the problem statement",
                "Observe whether the problem is urgent and recurring"
            ]
        },
        {
            id: "person",
            title: "Person Clarity",
            description: "This section determines whether the founder knows who the idea is for.",
            questions: [
                "I can clearly describe the type of person this idea is for.",
                "I know where this person spends time online or offline.",
                "I know what this person currently uses to deal with this problem.",
                "I have spoken to at least one person who fits this audience.",
                "I believe this person would pay for a solution like this."
            ],
            interpretations: [
                { min: 0, max: 10, text: "Your audience is still too broad or unclear." },
                { min: 11, max: 18, text: "You have a general audience in mind, but need sharper customer clarity." },
                { min: 19, max: 25, text: "You understand who this is for and how to reach them." }
            ],
            recommendations: [
                "Define one specific target user",
                "Identify where they spend time",
                "Conduct 3 short conversations with people in that audience"
            ]
        },
        {
            id: "solution",
            title: "Solution Clarity",
            description: "This section determines whether the founder has a real solution and not just a vague concept.",
            questions: [
                "I can explain my solution in one sentence.",
                "I understand how my solution is different from current alternatives.",
                "I know what the first simple version of this solution could look like.",
                "I believe this idea can be tested quickly.",
                "I can explain why someone would choose this solution over others."
            ],
            interpretations: [
                { min: 0, max: 10, text: "Your solution is still more of a concept than a testable offer." },
                { min: 11, max: 18, text: "You have a possible solution, but it needs refinement." },
                { min: 19, max: 25, text: "You have a clear and testable solution." }
            ],
            recommendations: [
                "Simplify the idea into a first version",
                "Write a one-sentence solution statement",
                "Identify one fast way to test interest"
            ]
        },
        {
            id: "action",
            title: "Action Readiness",
            description: "This section determines whether the founder is ready to take action.",
            questions: [
                "I have already taken at least one action on this idea.",
                "I know the next step I should take this week.",
                "I have time to work on this idea consistently.",
                "I am willing to talk to potential users or customers.",
                "I am open to changing or refining the idea based on feedback."
            ],
            interpretations: [
                { min: 0, max: 10, text: "You are still in thinking mode more than action mode." },
                { min: 11, max: 18, text: "You are moving, but not yet with full consistency or structure." },
                { min: 19, max: 25, text: "You are ready to take action and build momentum." }
            ],
            recommendations: [
                "Define one action to take this week",
                "Create a simple 7-day plan",
                "Commit to one user conversation or one test"
            ]
        }
    ],
    stages: [
        { min: 0, max: 40, name: "Idea Stage", message: "You do not yet have enough clarity to build confidently. Your next step is to better understand the problem and talk to real people." },
        { min: 41, max: 70, name: "Emerging Founder", message: "You have the beginnings of a viable idea, but some important areas still need refinement. Your next step is to validate, simplify, and test." },
        { min: 71, max: 100, name: "Ready to Build", message: "You have enough clarity to begin testing and building. Your next step is to move into structured execution." }
    ]
};
export default assessmentData;

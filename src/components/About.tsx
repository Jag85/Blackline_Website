import { Target, TrendingUp, Zap } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Clarity",
    description:
      "We cut through the noise to identify exactly what's holding your business back. No fluff, no generic advice — just sharp, honest diagnosis.",
  },
  {
    icon: TrendingUp,
    title: "Strategy",
    description:
      "Every session produces actionable strategy you can execute immediately. We build roadmaps that prioritize impact and align with your resources.",
  },
  {
    icon: Zap,
    title: "Momentum",
    description:
      "Strategy without execution is just theory. We help you build systems that create sustained forward motion and measurable growth.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
            About Blackline
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Strategic clarity for founders who are ready to grow
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Blackline Strategy Partners is a consulting firm built for founders
            and business leaders who are stuck, scaling, or pivoting. We deliver
            focused strategy sessions that diagnose bottlenecks, sharpen your
            offer, and create a clear execution plan — so you can move with
            confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group p-8 border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                <pillar.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                {pillar.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

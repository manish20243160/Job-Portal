import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";

const Analytics = () => {
  const stats = [
    {
      icon: Users,
      value: "2.4M+",
      label: "Active Users",
      growth: "+15%",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Briefcase,
      value: "150K+",
      label: "Jobs Posted",
      growth: "+22%",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Target,
      value: "89K+",
      label: "Successful Hires",
      growth: "+18%",
      iconBg: "bg-gray-100",
      iconColor: "text-black",
    },
    {
      icon: TrendingUp,
      value: "94%",
      label: "Match Rate",
      growth: "+8%",
      iconBg: "bg-gray-100",
      iconColor: "text-black",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Platform <span className="text-blue-600">Analytics</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Real-time insights and data-driven results that showcase the power
            of our platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="relative bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                {/* Growth top-right */}
                <span className="absolute top-6 right-6 text-green-500 text-sm font-semibold">
                  {stat.growth}
                </span>

                {/* Icon */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`${stat.iconColor}`} size={24} />
                </div>

                {/* Value */}
                <h3 className="text-3xl font-bold mt-6">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="text-gray-600 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Analytics;

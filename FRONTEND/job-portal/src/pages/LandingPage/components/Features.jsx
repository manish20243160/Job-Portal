import React from "react";
import { employerFeatures, jobSeekerFeatures } from "../../../utils/data";

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Everything You Need to{" "}
            <span className="text-blue-600">Succeed</span>
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Whether you're looking for your next opportunity or the perfect
            candidate, we have the tools and features to make it happen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* ================= Job Seekers ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-blue-600">
              For Job Seekers
            </h3>

            <div className="space-y-6">
              {jobSeekerFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon size={24} className="text-blue-600" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= Employers ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-purple-600">
              For Employers
            </h3>

            <div className="space-y-6">
              {employerFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon size={24} className="text-purple-600" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;

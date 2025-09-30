import { Heart, Microscope, ClipboardList, Smile } from 'lucide-react';

export function WhyChooseSection() {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every treatment plan is tailored to your unique needs, goals, and lifestyle, ensuring the most effective path to recovery.",
      bgColor: "bg-sage-100",
      iconColor: "text-sage-600",
    },
    {
      icon: Microscope,
      title: "Evidence-Based Practices",
      description: "Our treatments are grounded in the latest research and proven methodologies for optimal outcomes and lasting results.",
      bgColor: "bg-sky-soft-100",
      iconColor: "text-sky-soft-600",
    },
    {
      icon: ClipboardList,
      title: "Personalized Treatment Plans",
      description: "No two patients are alike. We create customized rehabilitation programs that address your specific condition and objectives.",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: Smile,
      title: "Friendly Environment",
      description: "Our welcoming clinic atmosphere puts you at ease, making your recovery journey as comfortable as possible.",
      bgColor: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <section id="why-choose" className="py-16 lg:py-24 bg-white" data-testid="why-choose-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="why-choose-title">
            Why Choose <span className="text-sage-600">YourPhysioBuddy</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="why-choose-subtitle">
            Experience the difference with our patient-focused approach to physiotherapy care
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="flex items-start space-x-4" data-testid={`value-item-${index}`}>
                  <div className={`w-12 h-12 ${value.bgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <IconComponent className={`${value.iconColor} w-6 h-6`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid={`value-title-${index}`}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed" data-testid={`value-description-${index}`}>
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="https://cover.health/wp-content/uploads/2020/05/hero-1.png&auto=format&fit=crop&w=600&h=600"
              alt="Modern physiotherapy clinic with welcoming environment"
              className="rounded-2xl shadow-lg w-full max-w-md lg:max-w-lg h-auto object-cover"
              data-testid="clinic-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

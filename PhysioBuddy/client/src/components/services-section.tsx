import { Activity, UserCheck, Users, Zap, Video, Bone } from 'lucide-react';

export function ServicesSection() {
  const services = [
    {
      icon: Video,
      title: "Online Consultations",
      description: "Convenient virtual physiotherapy sessions from the comfort of your home. Professional assessment, exercise guidance, and treatment planning via secure video calls.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Bone,
      title: "Trauma Rehabilitation",
      description: "Specialized treatment for fractures and dislocations. Expert care to restore function and mobility after traumatic injuries with evidence-based recovery protocols.",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: Activity,
      title: "Muscle & Ligament Injuries",
      description: "Comprehensive treatment for soft tissue injuries including strains, sprains, and tears. Advanced taping techniques and rehabilitation protocols for optimal recovery.",
      bgColor: "bg-sage-100",
      iconColor: "text-sage-600",
    },
    {
      icon: Zap,
      title: "Arthritis & Joint Pain",
      description: "Pain management and mobility improvement for arthritis and joint conditions. Therapeutic exercises and techniques to enhance quality of life and reduce discomfort.",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: UserCheck,
      title: "Joint Replacement Rehab",
      description: "Post-surgical rehabilitation for hip, knee, and other joint replacements. Structured programs to restore strength, mobility, and independence after surgery.",
      bgColor: "bg-sky-soft-100",
      iconColor: "text-sky-soft-600",
    },
    {
      icon: Users,
      title: "Geriatric Rehabilitation",
      description: "Specialized care for elderly patients focusing on fall prevention, balance improvement, and maintaining independence in daily activities.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50" data-testid="services-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="services-title">
            Our <span className="text-sage-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="services-subtitle">
            Comprehensive online physiotherapy treatments with home visit options in Hinhanghat area
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                data-testid={`service-card-${index}`}
              >
                <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className={`${service.iconColor} w-8 h-8`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid={`service-title-${index}`}>
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed" data-testid={`service-description-${index}`}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

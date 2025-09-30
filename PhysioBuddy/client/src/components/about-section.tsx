import { GraduationCap, Award } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-white" data-testid="about-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="about-title">
            Meet <span className="text-sage-600">Dr. Unnati Lodha</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="about-subtitle">
            Your dedicated physiotherapy partner committed to helping you achieve optimal health and mobility
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
              alt="Dr. Unnati Lodha - Physiotherapist"
              className="rounded-2xl shadow-lg w-full max-w-md h-auto object-cover"
              data-testid="doctor-image"
            />
          </div>
          <div className="space-y-6">
            <div className="bg-sage-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4" data-testid="about-doctor-title">
                About Dr. Unnati
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed" data-testid="doctor-bio-1">
                Dr. Unnati Lodha is a qualified physiotherapist with B.P.Th certification and specialized training as a Certified Taping Practitioner. She provides convenient online consultations and offers home visits throughout the Hinghanghat area for personalized rehabilitation care.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed" data-testid="doctor-bio-2">
                Her expertise spans trauma rehabilitation, muscle and ligament injuries, arthritis and joint pain management, joint replacement rehabilitation, and geriatric care, ensuring comprehensive treatment for patients of all ages.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-sky-soft-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-sky-soft-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900" data-testid="certification-title">
                  B.P.Th Certified
                </h4>
                <p className="text-gray-600 text-sm" data-testid="certification-subtitle">
                  Licensed Physiotherapist
                </p>
              </div>
              <div className="bg-sage-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-white w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900" data-testid="taping-title">
                  Certified Taping
                </h4>
                <p className="text-gray-600 text-sm" data-testid="taping-subtitle">
                  Practitioner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

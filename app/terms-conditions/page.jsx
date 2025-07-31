import { FaHandshake, FaCreditCard, FaLock, FaBalanceScale, FaMoneyBillAlt, FaGavel } from 'react-icons/fa';

const page = () => {
  const sections = [
    {
      title: "Services",
      icon: <FaHandshake className="w-8 h-8 mb-4 text-primary" />,
      content: "Our comprehensive services include Research and Development, Social Media Marketing, and Content Marketing. We commit to delivering high-quality results through our expert team and proven methodologies."
    },
    {
      title: "Payment",
      icon: <FaCreditCard className="w-8 h-8 mb-4 text-primary" />,
      content: "Clients agree to pay fees as per the agreed-upon quote. Please note that work commencement is contingent upon receipt of full payment. We accept various payment methods including credit cards and bank transfers."
    },
    {
      title: "Confidentiality",
      icon: <FaLock className="w-8 h-8 mb-4 text-primary" />,
      content: "Both parties shall maintain strict confidentiality of all sensitive information exchanged during our collaboration. This obligation remains in effect indefinitely beyond the termination of our agreement."
    },
    {
      title: "Liability",
      icon: <FaBalanceScale className="w-8 h-8 mb-4 text-primary" />,
      content: "Our liability is limited to direct damages up to the total fees paid. We are not liable for indirect, incidental, or consequential damages arising from unforeseen circumstances."
    },
    {
      title: "Refunds",
      icon: <FaMoneyBillAlt className="w-8 h-8 mb-4 text-primary" />,
      content: "Refunds are available exclusively when service delivery falls below agreed specifications or timelines. Refund requests must be submitted within 14 days of service completion."
    },
    {
      title: "Dispute Resolution",
      icon: <FaGavel className="w-8 h-8 mb-4 text-primary" />,
      content: "Any disputes shall first undergo mediation proceedings. If unresolved, claims will be settled through binding arbitration in accordance with [Your Jurisdiction] commercial arbitration rules."
    }
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  {section.icon}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/10 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Important Notice</h3>
          <p className="text-gray-600">
            These terms constitute a legal agreement. By using our services, you acknowledge that you have read,
            understood, and agree to be bound by these terms. We recommend consulting with legal counsel
            if you have any questions about these terms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default page;
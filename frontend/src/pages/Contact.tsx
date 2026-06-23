const Contact = () => {
  const links = [
    {
      icon: "⭐",
      label: "GitHub",
      value: "github.com/Satyam8804",
      href: "https://github.com/Satyam8804",
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "linkedin.com/in/satyam8804",
      href: "https://linkedin.com/in/satyam8804",
    },
    {
      icon: "📧",
      label: "Email",
      value: "satyam8804378323@gmail.com",
      href: "mailto:satyam8804378323@gmail.com",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-52px)] bg-white px-4 py-16">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight mb-3">
            Get in touch
          </h1>
          <p className="text-[14px] text-gray-500 leading-relaxed">
            Have a question or want to collaborate? Reach out via any of the channels below.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 mb-8">
          {links.map((link) => (
            
              <a key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{link.icon}</span>
                <div>
                  <p className="text-[12px] text-gray-400">{link.label}</p>
                  <p className="text-[13px] font-medium text-gray-900">{link.value}</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-gray-600 transition-colors text-sm">→</span>
            </a>
          ))}
        </div>

        {/* Note */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center">
          <p className="text-[12px] text-gray-400 leading-relaxed">
            Built with ❤️ by Satyam Kumar · System Engineer @ TCS · Bangalore, India
          </p>
        </div>

      </div>
    </div>
  );
};

export default Contact;
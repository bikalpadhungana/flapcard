import React, { useEffect } from 'react';
import Navbar from "../ui/Navbar";

const TermsOfService = () => {
  useEffect(() => {
    document.title = 'Flap Card Privacy Policy';
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white shadow-lg rounded-xl border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Flap Card Privacy Policy</h1>
        <p className="text-gray-500 mb-6 text-lg"><strong>Effective Date:</strong> May 17, 2025</p>
        <p className="mb-6 text-gray-700 leading-7">
          Flap Card is a digital contact-sharing platform operated by <a href="https://www.flap.com.np" className="text-[#1c73ba] hover:text-green-800 transition-colors duration-200 underline">Flap Tech Pvt Ltd</a> ("Flap Card," "we," "us," or "our"), a Nepal-based company. Flap Tech Pvt Ltd operates the Flap Card Business Card Application and related services (collectively, the "Services"). At the heart of our Services is the ability to share your information with those you choose, making data privacy paramount. This Privacy Policy ("Policy") outlines how we collect, use, protect, and share your personally identifiable information ("Personal Information") when you use our software applications ("Software Applications") or Services. It also describes your rights and choices regarding your Personal Information.
        </p>
        <p className="mb-6 text-gray-700 leading-7">
          By accessing or using our Software Applications and Services, you ("User," "you," or "your") acknowledge that you have read, understood, and agree to be bound by this Policy, which is a legally binding agreement. This Policy does not apply to practices of companies or individuals we do not own, control, employ, or manage.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Privacy Principles</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We have designed our Services with the following principles to safeguard your data and privacy:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li><strong>Your Data is Yours:</strong> Your data belongs to you. We do not sell or share your Personal Information with third parties without your explicit consent. You control how your data is shared within your network.</li>
          <li><strong>Secure Storage:</strong> We protect your data with robust, enterprise-grade encryption and security measures to ensure its confidentiality and integrity.</li>
          <li><strong>Safe Sharing:</strong> Each Flap Card has a unique code and web address, allowing you to share your details with selected recipients. Be aware that if recipients share your card with others (e.g., their company), those parties may access your information.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Information We Collect</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We collect only the information necessary to provide, maintain, and improve our Services. The types of information we collect include:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1.1 Information You Provide</h3>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li><strong>Account Information:</strong> When you create an account, you may provide your name, email address, username, password, country of residence, and other account details.</li>
          <li><strong>Contact Information:</strong> When you fill out forms or contact us, you may provide your name, email address, phone number, or physical address.</li>
          <li><strong>Payment Information:</strong> For purchases or transactions, we collect payment details (e.g., credit card or bank details), processed securely via third-party payment processors.</li>
          <li><strong>Geolocation Data:</strong> With your consent, we may collect latitude and longitude data to enable location-based features (e.g., nearby connections).</li>
          <li><strong>Mobile Device Features:</strong> If you enable certain features, we may access contacts, calendar, or gallery data on your mobile device, subject to your permission.</li>
          <li><strong>Staff and Job Applicant Information:</strong> For employees or job applicants, we collect details such as experience, qualifications, skills, and character. We may also conduct screening checks, including:
            <ul className="list-circle pl-8 mt-2 text-gray-700 leading-7">
              <li>Reference, background, health, directorship, identity, eligibility to work, vocational suitability, and criminal record checks.</li>
              <li>Drug and alcohol tests, where applicable.</li>
              <li>Conduct and performance assessments, workplace resource and IT usage monitoring, payroll, superannuation, and emergency contact details.</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1.2 Automatically Collected Information</h3>
        <p className="mb-6 text-gray-700 leading-7">
          We prioritize data security and collect minimal user data necessary to operate our Services. Automatically collected information includes:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li><strong>Usage Data:</strong> Information about how you interact with our Services, such as pages visited, features used, and statistical data on app usage.</li>
          <li><strong>Device Information:</strong> Details about your device, including IP address, browser type, operating system, and unique device identifiers.</li>
          <li><strong>Analytics Data:</strong> Statistical information to identify potential abuse and improve Service performance.</li>
        </ul>
        <p className="mb-6 text-gray-700 leading-7">
          You can use our Software Applications without disclosing your identity, but certain features may require providing Personal Information.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1.3 Information Required by Law</h3>
        <p className="mb-6 text-gray-700 leading-7">
          We may collect Personal Information to comply with applicable Nepalese laws, including but not limited to:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li>Income Tax Assessment Act and other tax laws.</li>
          <li>Corporations Act.</li>
          <li>Fair Work Act.</li>
          <li>Superannuation Guarantee (Administration) Act.</li>
          <li>Occupational health and safety acts.</li>
          <li>Workers compensation acts.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. How We Use Your Information</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We use your Personal Information to:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li>Provide, operate, and maintain the Services (e.g., enable card sharing, manage accounts).</li>
          <li>Process transactions and fulfill purchases.</li>
          <li>Personalize your experience (e.g., tailored connections or features).</li>
          <li>Improve our Services through analytics and user feedback.</li>
          <li>Communicate with you, including sending transactional emails, support responses, or promotional offers (with your consent where required).</li>
          <li>Detect and prevent fraud, security threats, or unauthorized activities.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
          <li>Manage employment or job application processes, including screening, payroll, and compliance with workplace laws.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. How We Share Your Information</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We do not sell your Personal Information. We may share your information in the following circumstances:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li><strong>Service Providers:</strong> With trusted third-party vendors (e.g., payment processors, cloud storage providers, analytics services) who assist in operating our Services, bound by strict confidentiality agreements.</li>
          <li><strong>Safe Sharing Feature:</strong> When you share your Flap Card, recipients can access the information you choose to share. If they forward your card, others (e.g., their company) may view your details.</li>
          <li><strong>Legal Requirements:</strong> When required by law, such as in response to a court order, subpoena, or to protect our rights, safety, or property.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</li>
          <li><strong>With Your Consent:</strong> When you explicitly agree to share your information (e.g., for a partnered service).</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Data Security</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We use enterprise-grade encryption, secure sockets layer (SSL), and other industry-standard measures to protect your Personal Information. However, no system is entirely secure, and we cannot guarantee absolute security. You are responsible for safeguarding your account credentials and notifying us of any unauthorized access.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Data Retention</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We retain your Personal Information only as long as necessary to fulfill the purposes outlined in this Policy or as required by law. For example:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li>Account data is retained while your account is active and may be archived for a limited period for legal or auditing purposes.</li>
          <li>Employee or applicant data is retained as required by applicable employment or tax laws.</li>
          <li>Usage data is retained in anonymized form for analytics.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Your Choices and Rights</h2>
        <p className="mb-6 text-gray-700 leading-7">
          You have control over your Personal Information and the following rights, subject to applicable laws:
        </p>
        <ul className="list-disc pl-8 mb-6 text-gray-700 leading-7">
          <li><strong>Access:</strong> Request a copy of your Personal Information.</li>
          <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> Request deletion of your data, subject to legal obligations.</li>
          <li><strong>Opt-Out:</strong> Opt out of marketing communications or data sharing (where applicable).</li>
          <li><strong>Restrict Processing:</strong> Request restrictions on how we process your data.</li>
          <li><strong>Data Portability:</strong> Request your data in a structured, portable format.</li>
        </ul>
        <p className="mb-6 text-gray-700 leading-7">
          To exercise these rights, contact us at <a href="mailto:privacy@flap.com.np" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline">privacy@flap.com.np</a>. We will respond within the timeframes required by law.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. International Data Transfers</h2>
        <p className="mb-6 text-gray-700 leading-7">
          As a Nepal-based company, we primarily process data in Nepal. However, your information may be transferred to and processed in other countries where our service providers operate (e.g., cloud storage providers). We ensure appropriate safeguards, such as Standard Contractual Clauses, to protect your data during transfers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Children's Privacy</h2>
        <p className="mb-6 text-gray-700 leading-7">
          Our Services are not intended for individuals under 16. We do not knowingly collect Personal Information from children under 16. If we learn that we have collected such information, we will take steps to delete it.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Third-Party Links</h2>
        <p className="mb-6 text-gray-700 leading-7">
          Our Services may contain links to third-party websites or services. We are not responsible for their privacy practices. Please review the privacy policies of those third parties.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Changes to This Privacy Policy</h2>
        <p className="mb-6 text-gray-700 leading-7">
          We may update this Policy to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated Policy on our website or via email (if applicable). The "Effective Date" at the top indicates when the Policy was last revised.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Contact Us</h2>
        <p className="mb-6 text-gray-700 leading-7">
          If you have questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-6 text-gray-700 leading-7">
          <strong>Flap Card Privacy Team</strong><br />
          Email: <a href="mailto:privacy@flap.com.np" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline">privacy@flap.com.np</a><br />
          Address: Lazimpat-2, Kathmandu, Nepal
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">12. Governing Law</h2>
        <p className="mb-6 text-gray-700 leading-7">
          This Privacy Policy is governed by the laws of Nepal. Any disputes arising from this Policy will be resolved in accordance with Nepalese law.
        </p>

        <p className="mt-8 text-gray-500 leading-7">
          Thank you for trusting Flap Card with your Personal Information.
        </p>
      </div>
    </>
  );
};

export default TermsOfService;
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Plotter',
}

const LAST_UPDATED = '8 March 2026'

export default function TermsPage() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <strong>Please read these Terms carefully before using Plotter.</strong> By creating an
        account or using the service, you agree to be bound by these Terms. If you do not agree,
        do not use the service.
      </p>

      <Section title="1. Acceptance of Terms">
        <p>
          These Terms of Service ("Terms") govern your access to and use of Plotter, a web
          application for plotting and tracking incidents on a map ("the Service"). The Service is
          provided as-is by a private individual ("we", "us", "our").
        </p>
      </Section>

      <Section title="2. Eligibility">
        <ul>
          <li>You must be at least 13 years old to use this Service.</li>
          <li>By using the Service, you represent that you have the legal capacity to enter into
            these Terms.</li>
          <li>If you are using the Service on behalf of an organisation, you represent that you
            have the authority to bind that organisation to these Terms.</li>
        </ul>
      </Section>

      <Section title="3. Your Account">
        <ul>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must notify us immediately if you suspect unauthorised access to your account.</li>
          <li>You may not share your account with others or create accounts on behalf of others
            without their explicit consent.</li>
        </ul>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree to use the Service only for lawful purposes. You must <strong>not</strong>:</p>
        <ul>
          <li>Submit false, misleading, or fabricated incident reports</li>
          <li>Submit incidents intended to harass, threaten, or harm individuals or groups</li>
          <li>Include personal information of others (names, addresses, phone numbers) in incident
            reports without their consent</li>
          <li>Use the Service to stalk, surveil, or track individuals without their consent</li>
          <li>Submit content that is defamatory, obscene, hateful, or discriminatory</li>
          <li>Attempt to gain unauthorised access to the Service, its servers, or other users'
            accounts</li>
          <li>Use automated tools (bots, scrapers, crawlers) to access or abuse the Service
            without prior written permission</li>
          <li>Use the Service to facilitate or conceal criminal activity</li>
          <li>Impersonate any person, organisation, or emergency service</li>
          <li>Overload the Service with excessive requests (denial-of-service attacks)</li>
        </ul>
      </Section>

      <Section title="5. Content You Submit">
        <p>
          You retain ownership of content you submit. By submitting incident reports, you grant us
          a non-exclusive, royalty-free, worldwide licence to store and display that content to
          other users as part of the Service.
        </p>
        <p>
          Incident data (location, title, description) is visible to all users, including visitors
          who are not logged in. <strong>Do not submit sensitive personal data, private addresses,
          or confidential information in incident reports.</strong>
        </p>
        <p>
          We reserve the right to remove any content that violates these Terms or that we
          determine, in our sole discretion, is harmful, offensive, or otherwise inappropriate.
        </p>
      </Section>

      <Section title="6. Emergency Situations">
        <p className="font-semibold text-red-700 dark:text-red-400">
          Plotter is NOT an emergency service. Do not rely on this application to report emergencies
          or to seek emergency assistance.
        </p>
        <p>
          If you witness a crime, fire, medical emergency, or other situation that requires immediate
          assistance, contact the relevant emergency services (e.g. 999, 911, 112) directly.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          The Service, including its design, code, and branding (excluding map data and user-submitted
          content), is the property of the operator. Map data is provided by OpenStreetMap contributors
          under the Open Database Licence (ODbL).
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>
          The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong>,
          without any warranties of any kind, either express or implied, including but not limited to
          warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          We do not warrant that the Service will be uninterrupted, error-free, or free from
          harmful components. Incident data is user-generated and may be inaccurate, incomplete,
          or outdated — do not make critical decisions based solely on content in this app.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, we shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, revenue, data, or goodwill, arising out of or in connection with your use of
          the Service, even if we have been advised of the possibility of such damages.
        </p>
        <p>
          Our total liability to you for any claims arising from your use of the Service shall
          not exceed the amount you have paid us in the 12 months preceding the claim (which, as
          this is a free service, is zero).
        </p>
      </Section>

      <Section title="10. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless the operator and any associated
          parties from and against any claims, liabilities, damages, losses, and expenses
          (including reasonable legal fees) arising out of or in any way connected with your
          access to or use of the Service, your violation of these Terms, or your violation of
          any rights of another person or entity.
        </p>
      </Section>

      <Section title="11. Termination">
        <p>
          We reserve the right to suspend or terminate your account at any time, with or without
          notice, if we believe you have violated these Terms or for any other reason at our
          discretion.
        </p>
        <p>
          You may delete your account at any time by contacting us. Upon termination, your right
          to use the Service ceases immediately. Incidents you have submitted may remain visible
          at our discretion.
        </p>
      </Section>

      <Section title="12. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with applicable law. Any
          disputes arising under these Terms shall be subject to the exclusive jurisdiction of
          the courts in the operator's country of residence.
        </p>
      </Section>

      <Section title="13. Changes to These Terms">
        <p>
          We may update these Terms at any time. The "Last updated" date at the top of this page
          reflects the most recent version. Continued use of the Service after changes are posted
          constitutes acceptance of the revised Terms. If we make material changes, we will make
          reasonable efforts to notify users.
        </p>
      </Section>

      <Section title="14. Contact">
        <p>
          For any questions about these Terms, or to report misuse of the Service, please contact
          us via the email address associated with your account.
        </p>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

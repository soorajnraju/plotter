import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Plotter',
}

const LAST_UPDATED = '8 March 2026'

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <Section title="1. Who We Are">
        <p>
          Plotter is a personal, non-commercial web application for plotting and tracking incidents
          on a map. It is hosted on Vercel and operated by a private individual. There is no
          business entity behind this service.
        </p>
        <p>
          If you have any privacy-related questions, contact us at the email address you used to
          sign up (or via GitHub issues if the repository is public).
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-1">Account data</h3>
        <ul>
          <li>Email address (collected when you sign up or sign in with email/password)</li>
          <li>Google account identifier and email (if you use Google Sign-In)</li>
        </ul>

        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-1">Incident data you submit</h3>
        <ul>
          <li>Title, description, category, and severity of incidents you report</li>
          <li>Geographic coordinates and optional address of incidents</li>
          <li>Timestamps of creation and last update</li>
          <li>Your user ID linked to incidents you report</li>
        </ul>

        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-1">Technical data</h3>
        <ul>
          <li>Session tokens stored in browser cookies (managed by Supabase)</li>
          <li>Aggregated, anonymised page-view analytics via Vercel Analytics (no personal
            identifiers or cross-site tracking)</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul>
          <li>To authenticate you and maintain your session</li>
          <li>To display incidents you and other users have submitted on the map</li>
          <li>To let you manage (update or delete) incidents you own</li>
          <li>To improve the service using aggregated, anonymous usage statistics</li>
        </ul>
        <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for
          marketing purposes.</p>
      </Section>

      <Section title="4. Third-Party Services">
        <p>Plotter relies on the following third-party services, each with their own privacy policy:</p>
        <ul>
          <li>
            <strong>Supabase</strong> (supabase.com) — authentication and database hosting. Your
            account credentials and incident data are stored on Supabase infrastructure, which is
            GDPR compliant. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400">Supabase Privacy Policy</a>
          </li>
          <li>
            <strong>Vercel</strong> (vercel.com) — application hosting and anonymous analytics.
            {' '}<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400">Vercel Privacy Policy</a>
          </li>
          <li>
            <strong>Google</strong> — optional Google Sign-In. If you use this feature, Google
            shares your email and account ID with us under Google's OAuth terms.
            {' '}<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400">Google Privacy Policy</a>
          </li>
          <li>
            <strong>OpenStreetMap</strong> — map tiles are loaded directly from OpenStreetMap tile
            servers. Your IP address may be visible to their tile CDN as part of loading the map.
            {' '}<a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400">OSM Privacy Policy</a>
          </li>
        </ul>
      </Section>

      <Section title="5. Cookies and Local Storage">
        <p>We use the following browser storage:</p>
        <ul>
          <li>
            <strong>Authentication cookies</strong> — set by Supabase to maintain your login
            session. These are strictly necessary and cannot be disabled without logging you out.
          </li>
          <li>
            <strong>Theme preference</strong> — stored in <code>localStorage</code> to remember
            your light/dark mode choice. No personal data, no expiry.
          </li>
          <li>
            <strong>Vercel Analytics</strong> — uses privacy-preserving, cookie-free measurement.
            No persistent identifiers are set.
          </li>
        </ul>
      </Section>

      <Section title="6. Data Retention and Deletion">
        <p>
          Your account and all incidents you have created are retained for as long as your account
          exists. You can delete individual incidents at any time from the app. To delete your
          account and all associated data, contact us and we will remove it within 30 days.
        </p>
        <p>
          Incidents you create are visible to all users of the app, including unauthenticated
          visitors. Do not include sensitive personal information in incident titles, descriptions,
          or addresses.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          All data is transmitted over HTTPS. Passwords are hashed by Supabase and never stored in
          plain text. Row Level Security (RLS) policies in the database ensure users can only
          modify their own incidents. We do not have access to your password.
        </p>
      </Section>

      <Section title="8. Your Rights (GDPR / CCPA)">
        <p>Depending on where you are located, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data ("right to be forgotten")</li>
          <li>Object to or restrict certain processing</li>
          <li>Data portability</li>
        </ul>
        <p>
          To exercise any of these rights, contact us via the email on your account. We will
          respond within 30 days.
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>
          Plotter is not directed at children under 13. We do not knowingly collect personal
          information from children. If you believe a child has created an account, please contact
          us and we will delete it promptly.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. The "Last updated" date at the top
          of this page will reflect any changes. Continued use of the service after changes are
          posted constitutes acceptance of the updated policy.
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

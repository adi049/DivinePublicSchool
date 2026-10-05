import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import { SCHOOL } from '../data/school.js'

/**
 * Legal pages (Privacy Policy & Terms & Conditions).
 * NOTE: These contain standard placeholder text so the site structure is
 * complete. The school administration should review and replace the content
 * with its own approved policies before going live.
 */

function LegalPage({ title, seoTitle, seoDesc, children }) {
  useSEO(seoTitle, seoDesc)
  return (
    <>
      <PageHero title={title} image="/images/about-building.jpg" crumb={title} />
      <section className="section">
        <div className="container">
          <article className="legal">
            <span className="legal__stamp">
              Applies to the website of {SCHOOL.name}, {SCHOOL.address}.
            </span>
            {children}
          </article>
        </div>
      </section>
    </>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      seoTitle="Privacy Policy | Divine Public School, Gurugram"
      seoDesc="Privacy policy of the Divine Public School website — how enquiry details shared by parents are handled."
    >
      <p>
        This privacy policy explains, in simple terms, how the Divine Public School website treats
        the information you share with us.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you submit an enquiry or admission form on this website, we may ask for your name, phone
        number, email address, the class you are interested in and a short message. This is the only
        personal information the website collects, and it is shared voluntarily by you.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry and contact you about admissions.</li>
        <li>To keep a record of admission-related communication with parents.</li>
        <li>To improve the information we share with prospective parents.</li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell, rent or share your details with advertisers.</li>
        <li>We do not use your child’s information for marketing lists.</li>
        <li>We do not publish any personal information on this website.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        If you would like any information you have shared with us to be updated or removed, please
        call the school office on {SCHOOL.phones[0].display} or write to us through the contact page.
      </p>

      <p>
        <em>
          (This is placeholder policy text for the website. The school administration will publish
          its detailed, approved policy here.)
        </em>
      </p>
    </LegalPage>
  )
}

export function TermsConditions() {
  return (
    <LegalPage
      title="Terms & Conditions"
      seoTitle="Terms & Conditions | Divine Public School, Gurugram"
      seoDesc="Terms and conditions for using the Divine Public School website."
    >
      <p>
        By using this website, you agree to the following simple terms. Please read them along with
        our privacy policy.
      </p>

      <h2>Purpose of this website</h2>
      <p>
        This website provides general information about {SCHOOL.name}, its classes, curriculum and
        admission process, and allows parents to send enquiries to the school.
      </p>

      <h2>Accuracy of information</h2>
      <ul>
        <li>
          Curriculum details, timetables and the photo gallery are indicative and are updated as the
          school confirms them. For the latest, confirmed information, please contact the school
          office directly.
        </li>
        <li>
          Submitting an enquiry form on this website does not guarantee admission; admission is
          completed only at the school after interaction and registration.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not misuse the enquiry forms to send spam or unrelated messages.</li>
        <li>Do not copy the school’s content or branding for other schools or organisations.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about these terms may be directed to the school office on {SCHOOL.phones[0].display}.
      </p>

      <p>
        <em>
          (This is placeholder terms text for the website. The school administration will publish
          its detailed, approved terms here.)
        </em>
      </p>
    </LegalPage>
  )
}

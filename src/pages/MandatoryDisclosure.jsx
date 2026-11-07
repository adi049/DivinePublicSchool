import { FileText, Download, ExternalLink, Info } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import {
  DISCLOSURE_GENERAL,
  DISCLOSURE_STAFF,
  DISCLOSURE_INFRA,
  DISCLOSURE_DOCUMENTS,
} from '../data/disclosure.js'

/** Label–value row list used for the disclosure tables. */
function InfoTable({ rows }) {
  return (
    <div className="disc-table">
      {rows.map((row) => (
        <div className="disc-row" key={row.label}>
          <span className="disc-row__label">{row.label}</span>
          <span className="disc-row__value">
            {row.href ? (
              <a href={row.href} target="_blank" rel="noreferrer">
                {row.value} <ExternalLink size={13} aria-hidden="true" />
              </a>
            ) : (
              row.value
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MandatoryDisclosure() {
  useSEO({ page: 'mandatory-disclosure' })

  return (
    <>
      <PageHero
        title="Public Mandatory Disclosure"
        description="School information and official documents, as published by Divine Public School."
        image="/images/gallery/campus-lawn.jpg"
        crumb="Public Mandatory Disclosure"
      />

      <section className="section" aria-labelledby="disc-general">
        <div className="container">
          <Reveal>
            <p className="sample-note" style={{ marginTop: 0 }}>
              <Info size={16} aria-hidden="true" />
              The information below is reproduced from the school’s official Public Mandatory
              Disclosure. Documents open as PDF files hosted on this website.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="disc-heading" id="disc-general">
              A. General Information
            </h2>
            <InfoTable rows={DISCLOSURE_GENERAL} />
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="disc-heading">B. Documents &amp; Information</h2>
            <div className="doc-group">
              {DISCLOSURE_DOCUMENTS[0].items.map((doc) => (
                <a
                  key={doc.href}
                  className="doc-item"
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={18} aria-hidden="true" />
                  <span className="doc-item__label">{doc.label}</span>
                  <span className="doc-item__action">
                    <Download size={15} aria-hidden="true" /> View PDF
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="disc-heading">C. Results &amp; Academics</h2>
            <div className="doc-group">
              {DISCLOSURE_DOCUMENTS[1].items.map((doc) => (
                <a
                  key={doc.href}
                  className="doc-item"
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={18} aria-hidden="true" />
                  <span className="doc-item__label">{doc.label}</span>
                  <span className="doc-item__action">
                    <Download size={15} aria-hidden="true" /> View PDF
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="disc-heading">D. Staff (Teaching)</h2>
            <InfoTable rows={DISCLOSURE_STAFF} />
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="disc-heading">E. School Infrastructure</h2>
            <InfoTable rows={DISCLOSURE_INFRA} />
          </Reveal>
        </div>
      </section>
    </>
  )
}

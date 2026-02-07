import { IconClose } from '../icons';
import Button from './Button';
import './InfoModal.css';

// Declare global variable injected by Vite at build time
declare const __BUILD_TIMESTAMP__: string;

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
  // Static build timestamp (captured at build time, fixed in bundle)
  const staticBuildDate = new Date(__BUILD_TIMESTAMP__);
  
  const buildInfo = {
    version: '1.3.9',
    // Static build date & time (when npm run build was executed)
    buildDateTime: staticBuildDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    lastCommit: 'ae56892',
  };

  const contact = {
    name: 'Jonathan Rambeau',
    linkedin: 'https://www.linkedin.com/in/jonathan-rambeau-987a58225/',
    title: 'WiFi Expert, CWNE',
    company: 'Axians C&S',
    location: 'Lyon, France',
  };

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal__header">
          <h2 className="info-modal__title">About</h2>
          <button
            className="info-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="info-modal__content">
          <div className="info-modal__section">
            <h3 className="info-modal__section-title">Build Information</h3>
            <div className="info-modal__info-row">
              <span className="info-modal__label">Version</span>
              <span className="info-modal__value">{buildInfo.version}</span>
            </div>
            <div className="info-modal__info-row">
              <span className="info-modal__label">Build Date & Time</span>
              <span className="info-modal__value">{buildInfo.buildDateTime}</span>
            </div>
            <div className="info-modal__info-row">
              <span className="info-modal__label">Last Commit</span>
              <span className="info-modal__value">{buildInfo.lastCommit}</span>
            </div>
          </div>

          <div className="info-modal__section">
            <h3 className="info-modal__section-title">Contact</h3>
            <div className="info-modal__contact">
              <p>
                For questions or contributions, please contact:
              </p>
              <p>
                <strong>{contact.name}</strong>
                <br />
                {contact.title}
                <br />
                {contact.company} • {contact.location}
              </p>
              <p>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-modal__contact-link"
                >
                  LinkedIn Profile
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="info-modal__footer">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Image
            src="/logo.svg"
            alt="Brand Logo"
            width={120}
            height={40}
          />
        </div>

        <div className="footer-socials">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/linkedin.svg"
              alt="LinkedIn"
              width={26}
              height={26}
              className="social-icon"
            />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/facebook.svg"
              alt="Facebook"
              width={26}
              height={26}
              className="social-icon"
            />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/reddit.svg"
              alt="Reddit"
              width={26}
              height={26}
              className="social-icon"
            />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/youtube.svg"
              alt="YouTube"
              width={26}
              height={26}
              className="social-icon"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

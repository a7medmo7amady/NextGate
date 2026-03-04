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
            className="social-btn"
          >
            LinkedIn
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
          >
            Facebook
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
          >
            Instagram
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}

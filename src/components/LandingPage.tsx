import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onSignupClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignupClick }) => {
  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🔒</span>
            <span className="logo-text">CloakPay</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            {/* <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hassle-Free <span className="highlight">Crypto Payment Gateway</span>
            </h1>
            <p className="hero-subtitle">
              Seamlessly integrate cryptocurrency payments into your online store. 
              Accept Bitcoin, Ethereum, and other popular cryptocurrencies with zero complexity.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant Settlements</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span>Bank-Grade Security</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <span>Global Reach</span>
              </div>
            </div>
            <div className="hero-actions">
              <button className="cta-button" onClick={onSignupClick}>
                Sign Up as Merchant
              </button>
              <button className="secondary-button">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="payment-card">
              <div className="card-header">
                <span className="card-logo">💳</span>
                <span>Payment Gateway</span>
              </div>
              <div className="crypto-icons">
                <div className="crypto-item">₿</div>
                <div className="crypto-item">Ξ</div>
                <div className="crypto-item">₳</div>
                <div className="crypto-item">◎</div>
              </div>
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Processing Payments...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-content">
          <h2 className="section-title">Why Choose CloakPay?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-emoji">🚀</span>
                <h3>Quick Integration</h3>
              </div>
              <p>Get started in minutes with our simple API and comprehensive documentation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-emoji">💰</span>
                <h3>Low Fees</h3>
              </div>
              <p>Competitive transaction fees that grow your business, not our margins.</p>
            </div>
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-emoji">🔧</span>
                <h3>Developer Friendly</h3>
              </div>
              <p>RESTful APIs, webhooks, and SDKs for all major programming languages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-header">
                <span className="feature-emoji">📊</span>
                <h3>Real-time Analytics</h3>
              </div>
              <p>Track transactions, monitor revenue, and analyze payment patterns in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Accept Crypto Payments?</h2>
          <p>Join thousands of merchants already using CloakPay</p>
          <button className="cta-button large" onClick={onSignupClick}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        {/* <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🔒</span>
              <span className="logo-text">CloakPay</span>
            </div>
            <p>The future of digital payments</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#api">API Docs</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#help">Help Center</a>
            <a href="#status">Status</a>
            <a href="#security">Security</a>
          </div>
        </div> */}
        <div className="footer-bottom">
          <p>&copy; 2024 CloakPay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
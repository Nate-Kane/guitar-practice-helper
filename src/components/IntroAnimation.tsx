import { FC } from 'react';
import './IntroAnimation.css';

const IntroAnimation: FC = () => {
  return (
    <div className="intro-animation">
      <div className="sign-container">
        <div className="left-chain"></div>
        <div className="right-chain"></div>
        <div className="hanging-sign">
          <div className="rust-overlay"></div>
          <h1 className="app-title">Welcome to the guitar practice studio!</h1>
          <div className="red-highlight">
            <span>Practices designed to help you break out of the box</span>
          </div>
          <p className="app-tagline"></p>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;

import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Developer Forum</h1>
            <p className="lead">Create your developer profile, share posts
              and get help from other devs</p>
            <div className="buttons">
              <Link to="/register" className="btn btn-primary">Register</Link>
              <Link to="/login" className="btn btn">Login</Link></div>
          </div>
        </div>
      </section>
    )
}

export default Landing;
import { icons } from "@devicons/icons";

import BuilderApp from "../components/BuilderApp";

export default function Home() {
  return (
    <main>
      {/* NAVBAR */}

      <header className="site-header">
        <div className="site-header-inner">
          <a
            href="/"
            className="site-logo"
          >
            DEVICONS
          </a>

          <nav className="site-nav">
            <a href="#builder">
              Builder
            </a>

            <a href="#output">
              Docs
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}

      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">
            DEVELOPER STACK BUILDER
          </p>

          <h1>
            Build your
            <br />
            developer stack.
          </h1>

          <p className="hero-description">
            Pick your technologies, customize
            the look, and get one embeddable URL.
          </p>
        </div>
      </section>

      {/* BUILDER */}

      <div id="builder">
        <BuilderApp icons={icons} />
      </div>
    </main>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const rootRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sticky header shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-reveal for .reveal / .reveal-stagger elements, plus counting stats
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEls = root.querySelectorAll('.reveal, .reveal-stagger');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));

    const counters = root.querySelectorAll('[data-count]');
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 900;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countIo.observe(el));

    return () => {
      io.disconnect();
      countIo.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page" ref={rootRef}>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="wrap nav">
          <Link to="/" className="wordmark"><span className="dot"></span>Blackcoffer<span className="sub">Insights</span></Link>

          <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#capabilities" onClick={closeMenu}>Product</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#audience" onClick={closeMenu}>Who it&rsquo;s for</a>
            <Link to="/dashboard" className="btn btn-primary" onClick={closeMenu}>Launch dashboard</Link>
          </nav>

          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="reveal in">
              <div className="eyebrow-row"><span className="pulse"></span>Live signal, updated as reports land</div>
              <h1>One signal, structured from every report.</h1>
              <p className="lead">
                Blackcoffer takes market research, PESTLE analysis, and industry forecasts — normally
                scattered across hundreds of PDFs — and structures them into a single, filterable dataset
                you can actually query.
              </p>
              <div className="hero-ctas">
                <Link to="/dashboard" className="btn btn-primary">Launch the dashboard</Link>
                <a href="#how" className="btn btn-ghost">See how it&rsquo;s built</a>
              </div>
              <div className="hero-meta">
                <span><b>9</b> filterable dimensions</span>
                <span><b>MongoDB</b>-backed API</span>
                <span><b>Live</b> aggregation, not static exports</span>
              </div>
            </div>

            <div className="hero-visual reveal in" style={{ transitionDelay: '.15s' }}>
              <div className="term-head">
                <div className="term-dots"><i></i><i></i><i></i></div>
                <div className="term-label">insights / by_topic</div>
              </div>
              <div className="bars">
                <i style={{ height: '52%', animationDelay: '0.05s' }}></i>
                <i style={{ height: '88%', animationDelay: '0.10s' }}></i>
                <i style={{ height: '34%', animationDelay: '0.15s' }}></i>
                <i style={{ height: '70%', animationDelay: '0.20s' }}></i>
                <i style={{ height: '46%', animationDelay: '0.25s' }}></i>
                <i style={{ height: '95%', animationDelay: '0.30s' }}></i>
                <i style={{ height: '60%', animationDelay: '0.35s' }}></i>
                <i style={{ height: '40%', animationDelay: '0.40s' }}></i>
              </div>
              <div className="term-rows">
                <div className="term-row"><span className="k">Intensity</span><span className="track"><span className="fill" style={{ width: '72%', background: 'var(--amber)' }}></span></span></div>
                <div className="term-row"><span className="k">Likelihood</span><span className="track"><span className="fill" style={{ width: '58%', background: 'var(--teal)', animationDelay: '.55s' }}></span></span></div>
                <div className="term-row"><span className="k">Relevance</span><span className="track"><span className="fill" style={{ width: '84%', background: 'var(--violet)', animationDelay: '.7s' }}></span></span></div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="wrap stats-row">
            <div className="stat reveal"><b data-count="9">0</b><span>Filter dimensions — topic, sector, region, PESTLE, source, country, year &amp; more</span></div>
            <div className="stat reveal" style={{ transitionDelay: '.08s' }}><b data-count="8">0</b><span>Chart types built on the same live data</span></div>
            <div className="stat reveal" style={{ transitionDelay: '.16s' }}><b data-count="100" data-suffix="%">0</b><span>Server-side aggregation — filtering never waits on the browser</span></div>
            <div className="stat reveal" style={{ transitionDelay: '.24s' }}><b data-count="1">0</b><span>Source of truth: one MongoDB collection, every chart reads from it</span></div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="sec-pad" id="capabilities">
          <div className="wrap">
            <div className="section-head reveal">
              <h2>Built to be filtered, not just read.</h2>
              <p>Every chart on the dashboard answers the same question from a different angle — and every filter you apply changes all of them at once.</p>
            </div>
            <div className="services-grid reveal-stagger">
              <div className="service-card">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                <h3>Multi-dimensional filtering</h3>
                <p>Slice by topic, sector, region, PESTLE category, source, country, and year — in any combination.</p>
              </div>
              <div className="service-card">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>
                <h3>Topic radar</h3>
                <p>Compare intensity, likelihood, and relevance across topics in a single view.</p>
              </div>
              <div className="service-card">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 010 18" /></svg>
                <h3>Regional &amp; sector breakdowns</h3>
                <p>See where signal concentrates, and where coverage is still thin.</p>
              </div>
              <div className="service-card">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 18l5-6 4 3 7-9" /></svg>
                <h3>Trend by end year</h3>
                <p>Track how forecasts shift as the years they describe get closer.</p>
              </div>
              <div className="service-card">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
                <h3>Source &amp; PESTLE lens</h3>
                <p>Cross-reference every insight against where it came from and what kind of factor it is.</p>
              </div>
              <div className="service-card">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg>
                <h3>Bubble scatter</h3>
                <p>Intensity against likelihood, sized by relevance — outliers surface on their own.</p>
              </div>

              <div className="service-card launch" id="services">
                <div className="launch-copy">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                  <h3>Interactive dashboard</h3>
                  <p>Every capability above, live — filter, compare, and see it drawn straight from the data in MongoDB.</p>
                </div>
                <Link to="/dashboard" className="btn btn-primary">Open the dashboard</Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="sec-pad" id="how" style={{ background: 'var(--panel-2)' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <h2>From PDF to pixel.</h2>
              <p>Four steps take a stack of reports to a chart you can filter in real time.</p>
            </div>
            <div className="steps reveal-stagger">
              <div className="step"><div className="n">1</div><h3>Ingest</h3><p>Reports and forecasts are parsed into one common record structure.</p></div>
              <div className="step"><div className="n">2</div><h3>Store</h3><p>Structured records land in MongoDB through a repeatable seed pipeline.</p></div>
              <div className="step"><div className="n">3</div><h3>Aggregate</h3><p>An Express API computes stats server-side for whatever filters are applied.</p></div>
              <div className="step"><div className="n">4</div><h3>Explore</h3><p>The dashboard renders it as interactive, filterable charts — live.</p></div>
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="sec-pad" id="audience">
          <div className="wrap">
            <div className="section-head reveal">
              <h2>Who it&rsquo;s for.</h2>
              <p>Anyone who needs a read on where intensity, likelihood, and relevance are heading — without opening forty PDFs.</p>
            </div>
            <div className="audience reveal-stagger">
              <div className="audience-card">
                <span className="tag">Analysts</span>
                <h3>Market &amp; strategy teams</h3>
                <p>Compare sectors and regions side by side instead of re-reading last quarter&rsquo;s reports.</p>
              </div>
              <div className="audience-card">
                <span className="tag">Researchers</span>
                <h3>PESTLE &amp; policy watchers</h3>
                <p>Filter by political, economic, social, and technological factors in one pass.</p>
              </div>
              <div className="audience-card">
                <span className="tag">Builders</span>
                <h3>Teams shipping on the API</h3>
                <p>Query the same MongoDB-backed endpoints the dashboard uses, directly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="sec-pad" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <div>
                <h2>See the signal for yourself.</h2>
                <p>No setup on your end — the dashboard is already live and filterable.</p>
              </div>
              <Link to="/dashboard" className="btn btn-primary">Launch the dashboard</Link>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <Link to="/" className="wordmark"><span className="dot"></span>Blackcoffer<span className="sub">Insights</span></Link>
              <p>A structured, filterable signal built from market research and industry forecasts — served live from MongoDB.</p>
            </div>
            <div className="foot-col">
              <h4>Product</h4>
              <Link to="/dashboard">Dashboard</Link>
              <a href="#capabilities">Capabilities</a>
              <a href="#how">How it works</a>
            </div>
            <div className="foot-col">
              <h4>Data</h4>
              <a href="#audience">Who it&rsquo;s for</a>
              <a href="#services">Services</a>
            </div>
            <div className="foot-col">
              <h4>Company</h4>
              <a href="https://blackcoffer.com" target="_blank" rel="noopener noreferrer">blackcoffer.com</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Blackcoffer. Built for this dashboard assignment.</span>
            <span>Dashboard data: intensity · likelihood · relevance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

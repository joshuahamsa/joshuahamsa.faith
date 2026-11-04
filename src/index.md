---
layout: base.njk
---

<section class="page-hero home-hero">
  <p class="eyebrow">Testimony · Ministry · Music</p>
  <h1>Joshua Hamsa</h1>
  <p class="lead">I was a wreck, an addict, a felon, and homeless. On my way to prison, I surrendered my life to Jesus, and it has been miraculously different since. Now I'm pursuing full-time ministry.</p>
  <div class="hero-actions">
    {% if site.sections.testimony %}<a class="button" href="/testimony/">Hear my story</a>{% endif %}
    {% if site.sections.ministry %}<a class="text-action" href="/ministry/">Ministry background <span aria-hidden="true">→</span></a>{% endif %}
  </div>
</section>

{% for v in videos %}{% if v.featured %}
<section class="feature-card">
  <div class="feature-card-media">{% video v, { eager: true } %}</div>
  <div class="feature-card-body"><p class="eyebrow">Featured testimony</p><h2>{{ v.title }}</h2><p class="meta">{{ v.church }} · {{ v.date }}</p>{% if site.sections.testimony %}<a class="text-action" href="/testimony/">Explore testimony <span aria-hidden="true">→</span></a>{% endif %}</div>
</section>
{% endif %}{% endfor %}

<section class="explore-section" aria-labelledby="explore-title">
  <div class="section-heading"><p class="eyebrow">Find your place</p><h2 id="explore-title">Explore</h2></div>
  <div class="content-card-grid">
    {% if site.sections.testimony %}<a class="content-card" href="/testimony/"><span class="card-number">01</span><h3>Testimony</h3><p>The story of God meeting me in the darkest part of my life—and the hope that followed.</p><span class="card-action">Watch and listen <span aria-hidden="true">→</span></span></a>{% endif %}
    {% if site.sections.ministry %}<a class="content-card" href="/ministry/"><span class="card-number">02</span><h3>Ministry</h3><p>Years of service, leadership, worship, recovery work, and preparation for what is next.</p><span class="card-action">See the journey <span aria-hidden="true">→</span></span></a>{% endif %}
    {% if site.sections.music %}<a class="content-card" href="/music/"><span class="card-number">03</span><h3>Music</h3><p>Recorded music, worship, and songs created to carry the good news a little farther.</p><span class="card-action">Listen now <span aria-hidden="true">→</span></span></a>{% endif %}
  </div>
</section>

<section class="service-section" aria-labelledby="service-title">
  <div class="section-heading"><p class="eyebrow">Called to serve</p><h2 id="service-title">Serving since 2017</h2></div>
  <ol class="service-list">
    <li><strong>Higher Vision, Santa Paula <span>(2025 to present)</span></strong><span>Worship and tech teams</span></li>
    <li><strong>The Gideons International <span>(2021 to present)</span></strong><span>Camp president and church speaker</span></li>
    <li><strong>Freedom Church <span>(2020 to 2021)</span></strong><span>Recovery group leader</span></li>
    <li><strong>Grace Chapel Pasadena <span>(2017 to 2019)</span></strong><span>Associate pastor and worship leader</span></li>
  </ol>
</section>

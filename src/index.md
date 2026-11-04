---
layout: base.njk
---

# Joshua Hamsa

<p class="lead">I was a wreck, an addict, a felon, and homeless. On my way to prison, I surrendered my life to Jesus, and it has been miraculously different since. Now I'm pursuing full-time ministry.</p>

{% for v in videos %}{% if v.featured %}{% video v, { eager: true } %}
<p class="meta">{{ v.title }} · {{ v.church }}</p>{% endif %}{% endfor %}

{% if site.sections.testimony %}<p><a href="/testimony/">Hear the full story</a></p>{% endif %}

## Serving since 2017

- Worship and tech teams, Higher Vision, Santa Paula (2025 to present)
- Camp president and church speaker, The Gideons International (2021 to present)
- Recovery group leader, Freedom Church (2020 to 2021)
- Associate pastor and worship leader, Grace Chapel Pasadena (2017 to 2019)

{% if site.sections.ministry %}<p><a href="/ministry/">See my ministry history</a></p>{% endif %}

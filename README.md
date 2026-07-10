# Al Abbasia Welfare Trust Website

Production-style bilingual Flask website for Al Abbasia Welfare Trust, built with Flask, Jinja2, HTML5, CSS3 and vanilla JavaScript.

## Features

- English and Urdu routes: `/en/` and `/ur/`
- Flask session-based language preference
- RTL Urdu layout with Noto Sans Arabic
- Responsive pages for home, about, projects, gallery, news, donate, volunteer and contact
- Real NGO imagery organized under `static/images/`
- Gallery filtering and lightbox
- Counter animation, scroll reveal and sticky navigation
- SEO routes for `robots.txt` and `sitemap.xml`
- Prepared admin folders for future dashboard work

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open:

- English: `http://127.0.0.1:5000/en/`
- Urdu: `http://127.0.0.1:5000/ur/`

## Production Notes

- Set `SECRET_KEY` in the deployment environment.
- Set `SITE_URL` to the real domain for sitemap and robots output.
- Replace donation account and QR details only after official verification.


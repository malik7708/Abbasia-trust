import json
from pathlib import Path

from flask import Flask, abort, flash, redirect, render_template, request, session, url_for

from config import Config


BASE_DIR = Path(__file__).resolve().parent
TRANSLATION_DIR = BASE_DIR / "translations"
SUPPORTED_LANGUAGES = {"en", "ur"}
PAGE_TEMPLATES = {
    "about",
    "projects",
    "gallery",
    "news",
    "donate",
    "volunteer",
    "contact",
}


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    translations = {
        language: load_translation(language)
        for language in SUPPORTED_LANGUAGES
    }

    def normalize_language(language):
        if language in SUPPORTED_LANGUAGES:
            return language
        return session.get("language", "en")

    @app.context_processor
    def inject_globals():
        language = normalize_language(request.view_args.get("lang") if request.view_args else None)
        raw_page_name = request.view_args.get("page_name", "home") if request.view_args else "home"
        page_name = raw_page_name if raw_page_name in PAGE_TEMPLATES or raw_page_name == "home" else "home"
        alternate_language = "ur" if language == "en" else "en"
        return {
            "lang": language,
            "is_rtl": language == "ur",
            "direction": "rtl" if language == "ur" else "ltr",
            "t": translations[language],
            "current_page": page_name,
            "alternate_language": alternate_language,
            "alternate_url": localized_url(alternate_language, page_name),
            "english_url": localized_url("en", page_name),
            "urdu_url": localized_url("ur", page_name),
        }

    @app.route("/")
    def index():
        return redirect(url_for("home", lang=session.get("language", "en")))

    @app.route("/<lang>/")
    def home(lang):
        language = normalize_language(lang)
        if language != lang:
            return redirect(url_for("home", lang=language))
        session["language"] = language
        return render_template("pages/home.html", page_key="home")

    @app.route("/<lang>/<page_name>/", methods=["GET", "POST"])
    def localized_page(lang, page_name):
        language = normalize_language(lang)
        if language != lang:
            return redirect(url_for("localized_page", lang=language, page_name=page_name))
        if page_name not in PAGE_TEMPLATES:
            abort(404)

        session["language"] = language
        if request.method == "POST" and page_name in {"contact", "volunteer"}:
            flash(translations[language]["forms"]["success"], "success")
            return redirect(url_for("localized_page", lang=language, page_name=page_name))

        return render_template(f"pages/{page_name}.html", page_key=page_name)

    @app.route("/robots.txt")
    def robots():
        site_url = app.config["SITE_URL"].rstrip("/")
        return (
            "User-agent: *\n"
            "Allow: /\n\n"
            f"Sitemap: {site_url}/sitemap.xml\n",
            200,
            {"Content-Type": "text/plain; charset=utf-8"},
        )

    @app.route("/sitemap.xml")
    def sitemap():
        site_url = app.config["SITE_URL"].rstrip("/")
        pages = [""] + [f"{page}/" for page in sorted(PAGE_TEMPLATES)]
        urls = []
        for language in sorted(SUPPORTED_LANGUAGES):
            for page in pages:
                urls.append(f"{site_url}/{language}/{page}")
        xml_urls = "\n".join(
            f"  <url><loc>{url}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>"
            for url in urls
        )
        return (
            f'<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f"{xml_urls}\n"
            f"</urlset>\n",
            200,
            {"Content-Type": "application/xml; charset=utf-8"},
        )

    @app.errorhandler(404)
    def not_found(error):
        language = session.get("language", "en")
        return render_template("pages/404.html", page_key="404", lang=language, t=translations[language]), 404

    def localized_url(language, page_name):
        if page_name in {None, "home"}:
            return url_for("home", lang=language)
        if page_name in PAGE_TEMPLATES:
            return url_for("localized_page", lang=language, page_name=page_name)
        return url_for("home", lang=language)

    return app


def load_translation(language):
    with (TRANSLATION_DIR / f"{language}.json").open(encoding="utf-8") as translation_file:
        return json.load(translation_file)


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)

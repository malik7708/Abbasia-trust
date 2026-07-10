import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-this-secret-key-in-production")
    SITE_URL = os.environ.get("SITE_URL", "https://www.alabbasiawelfaretrust.org")
    JSON_AS_ASCII = False

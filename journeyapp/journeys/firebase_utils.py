from firebase_admin import auth


def create_custom_token(uid):
    return auth.create_custom_token(uid)

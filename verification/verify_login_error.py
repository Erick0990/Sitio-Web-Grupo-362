from playwright.sync_api import sync_playwright
import time
import json
import re

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Mock AUTH LOGIN (Success)
        context.route("**/auth/v1/token?grant_type=password", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "access_token": "fake-access-token",
                "token_type": "bearer",
                "expires_in": 3600,
                "refresh_token": "fake-refresh-token",
                "user": {
                    "id": "fake-user-id",
                    "aud": "authenticated",
                    "role": "authenticated",
                    "email": "test@example.com",
                    "app_metadata": {"provider": "email", "providers": ["email"]},
                    "user_metadata": {},
                    "created_at": "2023-01-01T00:00:00.000000Z",
                    "updated_at": "2023-01-01T00:00:00.000000Z"
                }
            })
        ))

        # Also mock initial session check if it tries to verify token
        # Usually getSession just checks local storage.
        # But if we want to ensure it starts fresh:
        # We can clear cookies/localstorage or just assume it is empty.

        context.route(re.compile(r".*/rest/v1/profiles.*"), lambda route: route.fulfill(
            status=403,
            content_type="application/json",
            body=json.dumps({"code": "42501", "message": "permission denied for table profiles"})
        ))

        page = context.new_page()
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        print("Navigating to login page...")
        # Use HashRouter format
        page.goto("http://localhost:5173/#/login")

        print("Waiting for hydration/loading...")
        # Check if we are stuck on loading
        try:
            page.get_by_text("Verificando credenciales...").wait_for(timeout=2000)
            print("Initial loading state visible.")
        except:
            print("Initial loading state NOT visible (maybe already loaded).")

        print("Waiting for form...")
        email_input = page.get_by_placeholder("tu@email.com")

        try:
            email_input.wait_for(timeout=5000)
        except:
            print("Form not found. Taking screenshot.")
            page.screenshot(path="verification/debug_login.png")
            raise

        print("Filling form...")
        email_input.fill("test@example.com")
        page.get_by_placeholder("••••••••").fill("password123")

        print("Clicking login...")
        page.get_by_role("button", name="Entrar al Sistema").click()

        print("Waiting for error message...")
        error_message = page.get_by_text("Error al cargar perfil de usuario. Por favor intenta de nuevo.")

        try:
            error_message.wait_for(timeout=10000)
            print("Error message found!")
        except Exception as e:
            print(f"Error message not found.")
            page.screenshot(path="verification/login_failed.png")
            raise e

        page.screenshot(path="verification/login_error_success.png")
        browser.close()

if __name__ == "__main__":
    run()

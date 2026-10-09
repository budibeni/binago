from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    print("Navigating to http://localhost:3000/rental/returns")
    page.goto("http://localhost:3000/rental/returns", wait_until="networkidle")
    
    # Wait for the left panel list to populate
    print("Waiting for contract list...")
    page.wait_for_selector("button:has-text('Unit')")
    
    # Click the first contract in the list
    print("Clicking the first contract...")
    page.click("button:has-text('Unit')")
    
    # Wait a bit to see if anything loads
    page.wait_for_timeout(2000)
    
    # Take a snapshot of the right panel
    right_panel = page.query_selector(".flex-1.bg-neutral-50\\/50")
    if right_panel:
        print("Right panel HTML:", right_panel.inner_html()[:1000])
    else:
        print("Right panel not found!")

    browser.close()

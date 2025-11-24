## **Privacy Policy for “X Account Location & Device Info”**

**Last updated: 2025-11-24**

This browser extension does **not** collect, transmit, store, or share any personal data.

### **What the extension does**

* Reads publicly visible usernames on *x.com* / *twitter.com*.
* Makes authenticated requests **only** to X’s official GraphQL API using the user’s existing session to display:

  * Account country label
  * Device/platform indicator
* Caches this data **locally** in the user’s browser (`localStorage`) to avoid repeated API calls.

### **What the extension does *not* do**

* It does **not** collect any personal information.
* It does **not** transfer data to external servers.
* It does **not** use analytics, tracking scripts, or third-party services.
* It does **not** include or execute remote code.
* It does **not** access or read cookies outside X’s own context.

### **Data Storage**

All cached data is stored **locally on the user’s device** and never leaves the browser. Users may clear the cache at any time using built-in browser tools.

### **Permissions**

The extension requests the minimum required permissions:

* `storage` — only for local caching
* Host permissions for `x.com` and `twitter.com` — required to read page content and make API requests to X.

### **Contact**

For questions, please contact:
**Alexander Hagenah**
[@xaitax on X](https://x.com/xaitax)
import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Tab Management Extension',
    description: 'Manage browser tabs - close by domain, subdomain, or group tabs together',
    permissions: ['tabs', 'tabGroups', 'contextMenus'],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            'puppeteer-extra',
            'puppeteer-extra-plugin-stealth',
            'puppeteer-extra-plugin-recaptcha',
            'puppeteer-core',
            'chrome-aws-lambda',
            '@sparticuz/chromium'
        ],
    }
};

module.exports = nextConfig

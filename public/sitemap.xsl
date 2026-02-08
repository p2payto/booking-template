<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <meta charset="UTF-8" />
        <style>
          body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#f9fafb; margin:40px; color:#111827; }
          h1 { font-size:24px; margin-bottom:10px; }
          .count { margin-bottom:20px; font-size:14px; color:#6b7280; }
          table { border-collapse:collapse; width:100%; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
          th, td { text-align:left; padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; vertical-align:top; }
          th { background:#f3f4f6; font-weight:600; }
          tr:hover { background:#f9fafb; }
          a { color:#2563eb; text-decoration:none; }
          a:hover { text-decoration:underline; }
          .muted { color:#6b7280; }
        </style>
      </head>
      <body>

        <h1>XML Sitemap</h1>
        <div class="count">
          Total URLs: <xsl:value-of select="count(//sitemap:url)"/>
        </div>

        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Priority</th>
            <th>Changefreq</th>
          </tr>

          <xsl:for-each select="//sitemap:url">
            <tr>
              <td>
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="sitemap:loc"/>
                  </xsl:attribute>
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>
              <td class="muted"><xsl:value-of select="sitemap:lastmod"/></td>
              <td class="muted"><xsl:value-of select="sitemap:priority"/></td>
              <td class="muted"><xsl:value-of select="sitemap:changefreq"/></td>
            </tr>
          </xsl:for-each>

        </table>

      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>

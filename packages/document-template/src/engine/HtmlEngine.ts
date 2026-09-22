import Handlebars from 'handlebars';
import DOMPurify from 'dompurify';

export class HtmlEngine {
  /**
   * Merges JSON data into an HTML template using Handlebars.
   * @param htmlTemplate The original HTML string template
   * @param data The JSON data to merge (placeholders)
   * @returns Sanitized HTML string ready for injection
   */
  public static renderTemplate(htmlTemplate: string, data: Record<string, unknown>): string {
    try {
      // Compile the HTML template with Handlebars
      const template = Handlebars.compile(htmlTemplate, {
        noEscape: false, // Prevents XSS by escaping HTML entities inside variables by default
        strict: false,
      });

      // Render the data
      const rawHtml = template(data);

      // Sanitize the HTML to prevent XSS from any source
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr',
          'b', 'i', 'strong', 'em', 'u', 's', 'sup', 'sub',
          'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
          'a', 'span', 'img', 'div', 'style'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'colspan', 'rowspan']
      });

      return cleanHtml;
    } catch (error) {
      console.error('HtmlEngine: Failed to render HTML template', error);
      throw new Error('Gagal merender template HTML. Pastikan sintaks tag benar.');
    }
  }
}

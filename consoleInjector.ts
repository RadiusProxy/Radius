```typescript
// consoleInjector.ts
function injectConsole(html: string) {
  const consoleScript = `
    <script>
      const consoleElement = document.createElement('div');
      consoleElement.id = 'console';
      consoleElement.style.position = 'fixed';
      consoleElement.style.bottom = '0';
      consoleElement.style.left = '0';
      consoleElement.style.width = '100%';
      consoleElement.style.height = '200px';
      consoleElement.style.background = 'black';
      consoleElement.style.color = 'white';
      consoleElement.style.padding = '10px';
      consoleElement.style.fontSize = '14px';
      consoleElement.contentEditable = 'true';

      document.body.appendChild(consoleElement);

      const consoleInput = document.createElement('input');
      consoleInput.id = 'console-input';
      consoleInput.style.width = '100%';
      consoleInput.style.height = '20px';
      consoleInput.style.padding = '10px';
      consoleInput.style.fontSize = '14px';
      consoleElement.appendChild(consoleInput);

      consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          try {
            const code = consoleInput.value;
            eval(code);
            consoleInput.value = '';
          } catch (error) {
            console.error(error);
          }
        }
      });

      consoleElement.addEventListener('click', () => {
        consoleInput.focus();
      });
    </script>
  `;

  return html.replace(/<\/body>/, `${consoleScript}</body>`);
}

export default injectConsole;
```
This code injects a simple console element into the proxied website's HTML, allowing users to execute JavaScript code on the page.

**Important:** This is a basic example and may not work as-is in your environment. You may need to modify the code to fit your specific proxy setup and requirements.

Please note that this is just a starting point, and you should consider security implications and restrictions when injecting code into proxied websites.

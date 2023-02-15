export async function fileToString(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
      if (!event.target || !event.target.result) return '';
      resolve(event.target.result as string);
    });
    reader.readAsText(file);
  });
}

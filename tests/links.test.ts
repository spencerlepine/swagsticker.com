describe('Public Link Accessibility', () => {
  const projectUrls = [
    'https://swagsticker.com/',
    'https://swagsticker.vercel.app/'
  ];

  test.each(projectUrls)('URL %s should be publicly accessible', async (url) => {
    const response = await fetch(url, { method: 'HEAD' });
    expect(response.status).toBe(200);
  }, 10000);

  test('Demo video is publicly accessible', async () => {
    const demoVidLink = 'https://github.com/user-attachments/assets/c68b9266-fea0-42e5-86fb-af4fb6efff36';
    const response = await fetch(demoVidLink, { method: 'GET' });
    expect(response.status).toBe(200);
  }, 10000);
});

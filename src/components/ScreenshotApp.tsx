import { useState } from 'react';
import styles from './ScreenshotApp.module.css'
const ScreenshotApp: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileScreenshot, setMobileScreenshot] = useState('');
  const [desktopScreenshot, setDesktopScreenshot] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      setLoading(false);
      return;
    }

    try {
      const accessKey = process.env.NEXT_PUBLIC_SCREENSHOTONE_API_KEY;
      const mobileResponse = await fetch(`https://api.screenshotone.com/take?access_key=${accessKey}&url=${encodeURIComponent(url)}&viewport_device=iphone_12_pro_max&full_page=true`);
      const desktopResponse = await fetch(`https://api.screenshotone.com/take?access_key=${accessKey}&url=${encodeURIComponent(url)}&viewport_width=1440&viewport_height=900`);

      if (!mobileResponse.ok || !desktopResponse.ok) {
        throw new Error('Failed to fetch screenshots');
      }
      
      const mobileData = await mobileResponse.blob();
      const mobileImageUrl = URL.createObjectURL(mobileData);
      
      const desktopData = await desktopResponse.blob();
      const desktopImageUrl = URL.createObjectURL(desktopData);
      
      setMobileScreenshot(mobileImageUrl);
      setDesktopScreenshot(desktopImageUrl);
    } catch (error) {
      setError('Failed to fetch screenshots');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>Screenshot App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://www.example.com)"
          style={{ padding: '12px', marginRight: '10px', width: '100%', borderRadius: '5px', border: '2px solid #ccc' }}
          required
        />
        <div style={{ marginTop: '10px' }}>
          <button type="submit" disabled={loading} style={{ padding: '12px 20px', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }}>
            {loading ? 'Generating...' : 'Generate Screenshots'}
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'inline-block', marginRight: '10px' }}>
          {mobileScreenshot && <img src={mobileScreenshot} alt="Mobile Screenshot" style={{ maxWidth: '100%', height: 'auto' }} />}
        </div>
        <div style={{ display: 'inline-block' }}>
          {desktopScreenshot && <img src={desktopScreenshot} alt="Desktop Screenshot" style={{ maxWidth: '100%', height: 'auto' }} />}
        </div>
      </div>
    </div>
  );
  
};

export default ScreenshotApp;

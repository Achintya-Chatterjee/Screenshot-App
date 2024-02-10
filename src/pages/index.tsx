// src/pages/index.tsx

import dynamic from 'next/dynamic';

const DynamicScreenshotApp = dynamic(() => import('../components/ScreenshotApp'), { ssr: false });

const Home: React.FC = () => {
  return (
    <main>
      <DynamicScreenshotApp />
    </main>
  );
};

export default Home;

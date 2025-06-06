
import { supabase } from '@/integrations/supabase/client';

// Function to open multiple intermediate pages before download
const openMultiplePages = () => {
  // Page 1 - Information about download
  const page1 = window.open('', '_blank');
  if (page1) {
    page1.document.write(`
      <html>
        <head>
          <title>EditorStar - Download Preparation</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { max-width: 600px; margin: 0 auto; }
            .btn { background: #ff6b6b; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; margin: 20px; }
            .btn:hover { background: #ff5252; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎬 EditorStar Downloads</h1>
            <p>Your download is being prepared...</p>
            <p>Click below to continue to the next step</p>
            <button class="btn" onclick="window.close(); openNextPage();">Continue →</button>
          </div>
          <script>
            function openNextPage() {
              window.opener.postMessage('openPage2', '*');
            }
          </script>
        </body>
      </html>
    `);
  }

  // Listen for message to open page 2
  const messageHandler = (event) => {
    if (event.data === 'openPage2') {
      // Page 2 - Terms and conditions
      const page2 = window.open('', '_blank');
      if (page2) {
        page2.document.write(`
          <html>
            <head>
              <title>EditorStar - Terms & Conditions</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
                .container { max-width: 600px; margin: 0 auto; }
                .btn { background: #4ecdc4; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; margin: 20px; }
                .btn:hover { background: #45b7aa; }
                .terms { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📋 Terms & Conditions</h1>
                <div class="terms">
                  <p>By downloading this material, you agree to:</p>
                  <ul style="text-align: left;">
                    <li>Use for personal/commercial projects</li>
                    <li>Credit EditorStar when possible</li>
                    <li>Not redistribute as your own</li>
                  </ul>
                </div>
                <button class="btn" onclick="window.close(); openFinalPage();">I Agree & Continue →</button>
              </div>
              <script>
                function openFinalPage() {
                  window.opener.postMessage('openPage3', '*');
                }
              </script>
            </body>
          </html>
        `);
      }
      window.removeEventListener('message', messageHandler);
    } else if (event.data === 'openPage3') {
      // Page 3 - Final download page
      const page3 = window.open('', '_blank');
      if (page3) {
        page3.document.write(`
          <html>
            <head>
              <title>EditorStar - Download Ready</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; }
                .container { max-width: 600px; margin: 0 auto; }
                .btn { background: #ff6b6b; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; margin: 20px; animation: pulse 2s infinite; }
                .btn:hover { background: #ff5252; }
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                .success { font-size: 24px; color: #27ae60; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="success">✅ Ready to Download!</div>
                <h1>🎉 Your Material is Ready</h1>
                <p>Thank you for choosing EditorStar!</p>
                <p>Your download will start automatically...</p>
                <button class="btn" onclick="startDownload();">Download Now 📥</button>
              </div>
              <script>
                function startDownload() {
                  window.opener.postMessage('startDownload', '*');
                  window.close();
                }
                // Auto-start download after 3 seconds
                setTimeout(() => {
                  startDownload();
                }, 3000);
              </script>
            </body>
          </html>
        `);
      }
    } else if (event.data === 'startDownload') {
      // Now trigger the actual download
      window.removeEventListener('message', messageHandler);
    }
  };

  window.addEventListener('message', messageHandler);
};

export const handleMaterialDownload = async (materialId: string, fileUrl: string, fileName: string) => {
  try {
    // Track the download
    await supabase.from('downloads').insert({
      content_id: materialId,
      user_ip: 'unknown',
      user_agent: navigator.userAgent
    });

    // Increment download count
    await supabase.rpc('increment_download_count', { content_uuid: materialId });

    // Open multiple pages before download
    openMultiplePages();

    // Listen for final download message
    const downloadHandler = async (event) => {
      if (event.data === 'startDownload') {
        // Now perform the actual download
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          
          // Create download link
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(downloadUrl);

          console.log('Download completed for:', fileName);
        } catch (downloadError) {
          console.error('Download error:', downloadError);
          // Fallback to direct link
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        window.removeEventListener('message', downloadHandler);
      }
    };

    window.addEventListener('message', downloadHandler);

  } catch (error) {
    console.error('Error handling download:', error);
    // Fallback to direct download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

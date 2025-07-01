
import { supabase } from '@/integrations/supabase/client';

// Simple and reliable download function that works on all devices
const openDirectDownload = (materialTitle: string, fileName: string, downloadUrl: string) => {
  // Create a single page that handles the download
  const downloadPage = window.open('', '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  if (downloadPage) {
    downloadPage.document.write(`
      <html>
        <head>
          <title>EditorStar - Download</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              text-align: center; 
              padding: 40px 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { max-width: 500px; margin: 0 auto; }
            .logo { font-size: 3rem; margin-bottom: 20px; }
            .title { font-size: 2rem; margin-bottom: 15px; font-weight: bold; }
            .subtitle { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
            .download-info { 
              background: rgba(255,255,255,0.15); 
              padding: 25px; 
              border-radius: 15px; 
              margin: 20px 0; 
              backdrop-filter: blur(10px);
            }
            .btn { 
              background: linear-gradient(45deg, #ff6b6b, #ee5a5a); 
              color: white; 
              padding: 20px 40px; 
              border: none; 
              border-radius: 50px; 
              font-size: 18px; 
              cursor: pointer; 
              margin: 20px; 
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              text-decoration: none;
              display: inline-block;
            }
            .btn:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            .countdown { 
              font-size: 1.2rem; 
              color: #ffd93d; 
              font-weight: bold; 
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎬</div>
            <h1 class="title">Download Ready!</h1>
            <p class="subtitle">Your material is ready for download</p>
            
            <div class="download-info">
              <h3>📁 ${materialTitle}</h3>
              <p>File: ${fileName}</p>
              <p style="margin: 10px 0; color: #27ae60;">✅ Free & Safe</p>
            </div>
            
            <div class="countdown" id="countdown">Starting download in 3 seconds...</div>
            
            <a href="${downloadUrl}" class="btn" download target="_blank">📥 Download Now</a>
            
            <p style="margin-top: 20px; opacity: 0.8;">Thank you for using EditorStar! 🌟</p>
          </div>
          <script>
            let countdown = 3;
            const countdownEl = document.getElementById('countdown');
            
            const timer = setInterval(() => {
              countdown--;
              if (countdown > 0) {
                countdownEl.textContent = \`Starting download in \${countdown} seconds...\`;
              } else {
                countdownEl.textContent = 'Download started! 🚀';
                clearInterval(timer);
                // Direct download
                window.location.href = '${downloadUrl}';
              }
            }, 1000);
          </script>
        </body>
      </html>
    `);
  }
};

export const handleMaterialDownload = async (materialId, fileUrl, fileName, materialTitle = 'Premium Material') => {
  try {
    console.log('Starting download process for:', fileName);
    console.log('File URL:', fileUrl);
    
    // Track the download
    await supabase.from('downloads').insert({
      content_id: materialId,
      user_ip: 'unknown',
      user_agent: navigator.userAgent
    });

    // Increment download count
    await supabase.rpc('increment_download_count', { content_uuid: materialId });

    // Use simple direct download approach
    console.log('Opening direct download for:', fileUrl);
    openDirectDownload(materialTitle, fileName, fileUrl);

  } catch (error) {
    console.error('Error handling download:', error);
    // Ultimate fallback - direct link
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

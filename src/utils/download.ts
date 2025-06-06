
import { supabase } from '@/integrations/supabase/client';

// Enhanced function to open multiple intermediate pages before download
const openMultiplePages = (materialTitle: string, fileName: string, finalDownloadUrl: string) => {
  let currentPageCount = 0;
  const totalPages = 3;

  // Page 1 - Welcome & Preparation
  const openPage1 = () => {
    currentPageCount++;
    const page1 = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    if (page1) {
      page1.document.write(`
        <html>
          <head>
            <title>EditorStar - Download Preparation (1/${totalPages})</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                text-align: center; 
                padding: 30px 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container { max-width: 600px; margin: 0 auto; }
              .logo { font-size: 2.5rem; margin-bottom: 20px; }
              .title { font-size: 2rem; margin-bottom: 15px; font-weight: bold; }
              .subtitle { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
              .material-info { 
                background: rgba(255,255,255,0.15); 
                padding: 20px; 
                border-radius: 15px; 
                margin: 20px 0; 
                backdrop-filter: blur(10px);
              }
              .btn { 
                background: linear-gradient(45deg, #ff6b6b, #ee5a5a); 
                color: white; 
                padding: 15px 40px; 
                border: none; 
                border-radius: 50px; 
                font-size: 18px; 
                cursor: pointer; 
                margin: 20px; 
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              }
              .btn:hover { 
                transform: translateY(-2px); 
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
              }
              .progress { 
                width: 100%; 
                height: 8px; 
                background: rgba(255,255,255,0.3); 
                border-radius: 4px; 
                margin: 20px 0;
                overflow: hidden;
              }
              .progress-bar { 
                width: 33%; 
                height: 100%; 
                background: linear-gradient(90deg, #ff6b6b, #ffd93d); 
                border-radius: 4px;
                animation: glow 2s ease-in-out infinite alternate;
              }
              @keyframes glow { 
                from { box-shadow: 0 0 5px #ff6b6b; } 
                to { box-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff6b6b; } 
              }
              .spinner { 
                border: 4px solid rgba(255,255,255,0.3); 
                border-top: 4px solid #ff6b6b; 
                border-radius: 50%; 
                width: 40px; 
                height: 40px; 
                animation: spin 1s linear infinite; 
                margin: 20px auto;
              }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🎬</div>
              <h1 class="title">Welcome to EditorStar!</h1>
              <p class="subtitle">Preparing your premium download...</p>
              
              <div class="material-info">
                <h3>📁 ${materialTitle}</h3>
                <p>File: ${fileName}</p>
              </div>
              
              <div class="progress">
                <div class="progress-bar"></div>
              </div>
              <p>Step 1 of ${totalPages} - Initializing...</p>
              
              <div class="spinner"></div>
              
              <button class="btn" onclick="nextPage()">Continue to Step 2 →</button>
            </div>
            <script>
              let autoProgress = true;
              let isProgressing = false;
              
              function nextPage() {
                if (isProgressing) return;
                isProgressing = true;
                autoProgress = false;
                
                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage({
                    action: 'openPage2', 
                    downloadUrl: '${finalDownloadUrl}',
                    materialTitle: '${materialTitle}',
                    fileName: '${fileName}'
                  }, '*');
                }
                
                setTimeout(() => {
                  window.close();
                }, 1000);
              }
              
              // Auto advance after 5 seconds
              setTimeout(() => {
                if (autoProgress && !isProgressing) {
                  nextPage();
                }
              }, 5000);
              
              // Prevent back navigation
              window.addEventListener('beforeunload', function(e) {
                if (!isProgressing) {
                  e.preventDefault();
                  e.returnValue = '';
                }
              });
            </script>
          </body>
        </html>
      `);
    }
  };

  // Page 2 - Terms & Conditions
  const openPage2 = (downloadUrl, materialTitle, fileName) => {
    currentPageCount++;
    const page2 = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    if (page2) {
      page2.document.write(`
        <html>
          <head>
            <title>EditorStar - Terms & Conditions (2/${totalPages})</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                text-align: center; 
                padding: 30px 20px; 
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                color: white; 
                min-height: 100vh;
              }
              .container { max-width: 700px; margin: 0 auto; }
              .logo { font-size: 2.5rem; margin-bottom: 20px; }
              .title { font-size: 2rem; margin-bottom: 15px; font-weight: bold; }
              .terms { 
                background: rgba(255,255,255,0.15); 
                padding: 25px; 
                border-radius: 15px; 
                margin: 20px 0; 
                text-align: left;
                backdrop-filter: blur(10px);
              }
              .terms h3 { text-align: center; margin-bottom: 15px; }
              .terms ul { list-style: none; padding: 0; }
              .terms li { 
                padding: 8px 0; 
                border-bottom: 1px solid rgba(255,255,255,0.2); 
                position: relative;
                padding-left: 25px;
              }
              .terms li:before { 
                content: '✓'; 
                position: absolute; 
                left: 0; 
                color: #4CAF50; 
                font-weight: bold;
              }
              .btn { 
                background: linear-gradient(45deg, #4ecdc4, #44a08d); 
                color: white; 
                padding: 15px 40px; 
                border: none; 
                border-radius: 50px; 
                font-size: 18px; 
                cursor: pointer; 
                margin: 20px; 
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              }
              .btn:hover { 
                transform: translateY(-2px); 
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
              }
              .progress { 
                width: 100%; 
                height: 8px; 
                background: rgba(255,255,255,0.3); 
                border-radius: 4px; 
                margin: 20px 0;
                overflow: hidden;
              }
              .progress-bar { 
                width: 66%; 
                height: 100%; 
                background: linear-gradient(90deg, #4ecdc4, #44a08d); 
                border-radius: 4px;
                animation: glow 2s ease-in-out infinite alternate;
              }
              @keyframes glow { 
                from { box-shadow: 0 0 5px #4ecdc4; } 
                to { box-shadow: 0 0 20px #4ecdc4, 0 0 30px #4ecdc4; } 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">📋</div>
              <h1 class="title">Terms & Conditions</h1>
              
              <div class="terms">
                <h3>🎯 License Agreement</h3>
                <ul>
                  <li>Free for personal and commercial use</li>
                  <li>Credit "EditorStar" when possible (appreciated but not required)</li>
                  <li>Do not redistribute as your own creation</li>
                  <li>Modify and adapt to fit your projects</li>
                  <li>Use in unlimited projects</li>
                  <li>Share the love - recommend EditorStar to others!</li>
                </ul>
              </div>
              
              <div class="progress">
                <div class="progress-bar"></div>
              </div>
              <p>Step 2 of ${totalPages} - License Review</p>
              
              <button class="btn" onclick="nextPage()">I Agree & Continue →</button>
            </div>
            <script>
              let autoProgress = true;
              let isProgressing = false;
              
              function nextPage() {
                if (isProgressing) return;
                isProgressing = true;
                autoProgress = false;
                
                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage({
                    action: 'openPage3', 
                    downloadUrl: '${downloadUrl}',
                    materialTitle: '${materialTitle}',
                    fileName: '${fileName}'
                  }, '*');
                }
                
                setTimeout(() => {
                  window.close();
                }, 1000);
              }
              
              // Auto advance after 6 seconds
              setTimeout(() => {
                if (autoProgress && !isProgressing) {
                  nextPage();
                }
              }, 6000);
              
              // Prevent back navigation
              window.addEventListener('beforeunload', function(e) {
                if (!isProgressing) {
                  e.preventDefault();
                  e.returnValue = '';
                }
              });
            </script>
          </body>
        </html>
      `);
    }
  };

  // Page 3 - Final Download Page
  const openPage3 = (downloadUrl, materialTitle, fileName) => {
    currentPageCount++;
    const page3 = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    if (page3) {
      page3.document.write(`
        <html>
          <head>
            <title>EditorStar - Download Ready! (3/${totalPages})</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                text-align: center; 
                padding: 30px 20px; 
                background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); 
                color: #333; 
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container { max-width: 600px; margin: 0 auto; }
              .success-icon { 
                font-size: 4rem; 
                margin-bottom: 20px; 
                animation: bounce 2s infinite;
              }
              @keyframes bounce { 
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 
                40% { transform: translateY(-10px); } 
                60% { transform: translateY(-5px); } 
              }
              .title { font-size: 2.5rem; margin-bottom: 15px; font-weight: bold; color: #2c3e50; }
              .subtitle { font-size: 1.3rem; margin-bottom: 30px; color: #7f8c8d; }
              .download-info { 
                background: rgba(255,255,255,0.8); 
                padding: 25px; 
                border-radius: 15px; 
                margin: 20px 0; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              }
              .btn { 
                background: linear-gradient(45deg, #ff6b6b, #ee5a5a); 
                color: white; 
                padding: 20px 50px; 
                border: none; 
                border-radius: 50px; 
                font-size: 20px; 
                cursor: pointer; 
                margin: 20px; 
                animation: pulse 2s infinite;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
              }
              .btn:hover { 
                transform: scale(1.05); 
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
              }
              @keyframes pulse { 
                0% { transform: scale(1); } 
                50% { transform: scale(1.02); } 
                100% { transform: scale(1); } 
              }
              .progress { 
                width: 100%; 
                height: 10px; 
                background: rgba(255,255,255,0.5); 
                border-radius: 5px; 
                margin: 20px 0;
                overflow: hidden;
              }
              .progress-bar { 
                width: 100%; 
                height: 100%; 
                background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffd93d); 
                border-radius: 5px;
                animation: rainbow 3s ease-in-out infinite;
              }
              @keyframes rainbow { 
                0% { background-position: 0% 50%; } 
                50% { background-position: 100% 50%; } 
                100% { background-position: 0% 50%; } 
              }
              .countdown { 
                font-size: 1.5rem; 
                color: #e74c3c; 
                font-weight: bold; 
                margin: 15px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">🎉</div>
              <h1 class="title">Download Ready!</h1>
              <p class="subtitle">Your premium material is prepared</p>
              
              <div class="download-info">
                <h3>📁 ${materialTitle}</h3>
                <p style="margin: 10px 0;">File: ${fileName}</p>
                <p style="margin: 10px 0; color: #27ae60;">✅ Verified & Safe</p>
                <p style="margin: 10px 0; color: #3498db;">⚡ High-Speed Download</p>
              </div>
              
              <div class="progress">
                <div class="progress-bar"></div>
              </div>
              <p>Step 3 of ${totalPages} - Ready for Download!</p>
              
              <div class="countdown" id="countdown">Auto-download in 7 seconds...</div>
              
              <button class="btn" onclick="startDownload()">📥 Download Now!</button>
              
              <p style="margin-top: 20px; opacity: 0.8;">Thank you for choosing EditorStar! 🌟</p>
            </div>
            <script>
              let countdown = 7;
              let downloadStarted = false;
              const countdownEl = document.getElementById('countdown');
              
              const timer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                  countdownEl.textContent = \`Auto-download in \${countdown} seconds...\`;
                } else {
                  countdownEl.textContent = 'Opening download page...';
                  clearInterval(timer);
                  if (!downloadStarted) {
                    startDownload();
                  }
                }
              }, 1000);
              
              function startDownload() {
                if (downloadStarted) return;
                downloadStarted = true;
                
                // Open the actual download URL (MediaFire, etc.)
                window.open('${downloadUrl}', '_blank');
                countdownEl.textContent = 'Download page opened! 🚀';
                
                setTimeout(() => {
                  window.close();
                }, 3000);
              }
              
              // Prevent back navigation until download starts
              window.addEventListener('beforeunload', function(e) {
                if (!downloadStarted) {
                  e.preventDefault();
                  e.returnValue = '';
                }
              });
            </script>
          </body>
        </html>
      `);
    }
  };

  // Message handler for page progression
  const messageHandler = (event) => {
    console.log('Received message:', event.data);
    
    if (event.data && typeof event.data === 'object') {
      if (event.data.action === 'openPage2') {
        openPage2(event.data.downloadUrl, event.data.materialTitle, event.data.fileName);
      } else if (event.data.action === 'openPage3') {
        openPage3(event.data.downloadUrl, event.data.materialTitle, event.data.fileName);
      }
    }
  };

  window.addEventListener('message', messageHandler);
  
  // Start the flow
  openPage1();
  
  // Clean up listener after 3 minutes
  setTimeout(() => {
    window.removeEventListener('message', messageHandler);
  }, 180000);
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

    // Always use the 3-page sequence for all downloads
    console.log('Opening 3-page sequence for:', fileUrl);
    openMultiplePages(materialTitle, fileName, fileUrl);

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


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Eye, EyeOff } from "lucide-react";

interface CodePreviewProps {
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  onHtmlChange?: (code: string) => void;
  onCssChange?: (code: string) => void;
  onJsChange?: (code: string) => void;
  readonly?: boolean;
}

const CodePreview = ({ 
  htmlCode = '', 
  cssCode = '', 
  jsCode = '', 
  onHtmlChange, 
  onCssChange, 
  onJsChange,
  readonly = false 
}: CodePreviewProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  const generatePreview = () => {
    const combinedCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          ${jsCode}
        </script>
      </body>
      </html>
    `;
    return combinedCode;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5" />
          <h3 className="text-lg font-medium">Code Preview</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'html' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('html')}
        >
          <Badge variant="secondary" className="mr-2">HTML</Badge>
        </Button>
        <Button
          variant={activeTab === 'css' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('css')}
        >
          <Badge variant="secondary" className="mr-2">CSS</Badge>
        </Button>
        <Button
          variant={activeTab === 'js' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('js')}
        >
          <Badge variant="secondary" className="mr-2">JS</Badge>
        </Button>
      </div>

      {/* Code Editors */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {activeTab.toUpperCase()} Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === 'html' && (
              <Textarea
                value={htmlCode}
                onChange={(e) => onHtmlChange?.(e.target.value)}
                placeholder="Enter HTML code here..."
                className="font-mono text-sm min-h-[300px]"
                readOnly={readonly}
              />
            )}
            {activeTab === 'css' && (
              <Textarea
                value={cssCode}
                onChange={(e) => onCssChange?.(e.target.value)}
                placeholder="Enter CSS code here..."
                className="font-mono text-sm min-h-[300px]"
                readOnly={readonly}
              />
            )}
            {activeTab === 'js' && (
              <Textarea
                value={jsCode}
                onChange={(e) => onJsChange?.(e.target.value)}
                placeholder="Enter JavaScript code here..."
                className="font-mono text-sm min-h-[300px]"
                readOnly={readonly}
              />
            )}
          </CardContent>
        </Card>

        {/* Live Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatePreview()}
                  className="w-full h-[300px] border-0"
                  sandbox="allow-scripts allow-same-origin"
                  title="Code Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CodePreview;

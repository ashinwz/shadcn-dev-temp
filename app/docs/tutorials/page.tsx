'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail'
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip } from "lucide-react"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import '@react-pdf-viewer/page-navigation/lib/styles/index.css'
import '@react-pdf-viewer/thumbnail/lib/styles/index.css'

interface DrawBox {
  left: number;
  top: number;
  width: number;
  height: number;
  pageIndex: number;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const DrawLayer = ({ drawMode, onDrawBox }: { 
  drawMode: boolean; 
  onDrawBox: (box: DrawBox) => void;
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const getMousePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!layerRef.current) return null;
    
    const rect = layerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!layerRef.current || !drawMode) return;
    
    const pos = getMousePosition(e);
    if (!pos) return;
    
    startPointRef.current = pos;
    setIsDrawing(true);
    
    const newBox: DrawBox = {
      left: pos.x,
      top: pos.y,
      width: 0,
      height: 0,
      pageIndex: 0,
    };
    onDrawBox(newBox);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPointRef.current || !layerRef.current || !drawMode) return;

    const pos = getMousePosition(e);
    if (!pos) return;

    const width = Math.abs(pos.x - startPointRef.current.x);
    const height = Math.abs(pos.y - startPointRef.current.y);
    const left = Math.min(pos.x, startPointRef.current.x);
    const top = Math.min(pos.y, startPointRef.current.y);

    const tempBox: DrawBox = {
      left,
      top,
      width,
      height,
      pageIndex: 0,
    };

    onDrawBox(tempBox);
  };

  const handleMouseUp = () => {
    if (!drawMode) return;
    setIsDrawing(false);
    startPointRef.current = null;
  };

  return (
    <div
      ref={layerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: drawMode ? 'auto' : 'none',
        cursor: drawMode ? 'crosshair' : 'auto',
        zIndex: 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default function DocsTutorialsPage() {
  const [drawMode, setDrawMode] = useState(false);
  const [drawBoxes, setDrawBoxes] = useState<DrawBox[]>([]);
  const [viewerWidth, setViewerWidth] = useState(50); // percentage
  const isDraggingRef = useRef(false);
  
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const thumbnailPluginInstance = thumbnailPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            Download,
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Print,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
          } = slots;
          return (
            <div className="rpv-toolbar">
              <div className="rpv-toolbar__left">
                <div className="rpv-toolbar__item">
                  <GoToPreviousPage />
                </div>
                <div className="rpv-toolbar__item">
                  <CurrentPageInput /> / <NumberOfPages />
                </div>
                <div className="rpv-toolbar__item">
                  <GoToNextPage />
                </div>
              </div>
              <div className="rpv-toolbar__center">
                <div className="rpv-toolbar__item">
                  <ZoomOut />
                </div>
                <div className="rpv-toolbar__item">
                  <Zoom />
                </div>
                <div className="rpv-toolbar__item">
                  <ZoomIn />
                </div>
                <div className="rpv-toolbar__item">
                  <button
                    className={`rpv-toolbar__button ${drawMode ? 'rpv-toolbar__button--selected' : ''}`}
                    onClick={() => setDrawMode(!drawMode)}
                    style={{
                      backgroundColor: drawMode ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                      borderRadius: '4px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    title="Draw Box"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={drawMode ? "rgba(0, 0, 0, 0.4)" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{
                        transition: 'fill 0.2s',
                      }}
                    >
                      <rect x="5" y="5" width="14" height="14" rx="1" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="rpv-toolbar__right">
                <div className="rpv-toolbar__item">
                  <ShowSearchPopover />
                </div>
                <div className="rpv-toolbar__item">
                  <EnterFullScreen />
                </div>
                <div className="rpv-toolbar__item">
                  <Download />
                </div>
                <div className="rpv-toolbar__item">
                  <Print />
                </div>
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0],
      ...defaultTabs.slice(1),
    ],
  });

  const handleDrawBox = (box: DrawBox) => {
    setDrawBoxes([...drawBoxes.slice(0, -1), box]);
  };

  const renderDrawBoxes = drawBoxes.map((box, index) => (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: `${box.left}px`,
        top: `${box.top}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        border: '2px solid rgba(0, 0, 255, 0.4)',
        background: 'rgba(0, 0, 255, 0.1)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  ));

  const [pdfError, setPdfError] = useState<string | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const container = document.getElementById('pdf-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the width between 30% and 70%
    setViewerWidth(Math.min(Math.max(newWidth, 30), 70));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside the toolbar button and PDF viewer
      if (!target.closest('.rpv-toolbar__button') && !target.closest('.rpv-core__viewer-zone')) {
        setDrawMode(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exampleQuestions = [
    "What is the main topic of this document?",
    "Can you summarize this page for me?",
    "What are the key findings in this section?",
    "Please explain the methodology used here."
  ];

  const handleExampleClick = (text: string) => {
    setInputValue(text);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      // Add a message about the uploaded file
      const newMessage: Message = {
        id: Math.random().toString(),
        content: `Uploaded PDF: ${file.name}`,
        role: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-full w-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-4 pt-0">
            <div id="pdf-container" className="flex-1 flex gap-2 relative">
              {pdfUrl && (
                <>
                  <div style={{ width: `${viewerWidth}%` }} className="h-[calc(100vh-4rem-32px)]">
                    <div className="h-full rounded-xl bg-muted/50">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <div className="h-full">
                          {pdfError ? (
                            <div className="flex h-full items-center justify-center text-red-500">
                              {pdfError}
                            </div>
                          ) : (
                            <Viewer
                              fileUrl={pdfUrl}
                              plugins={[
                                defaultLayoutPluginInstance,
                                pageNavigationPluginInstance,
                                thumbnailPluginInstance,
                              ]}
                              onError={(error) => setPdfError(error.message)}
                              defaultScale={1}
                              className="h-full"
                            />
                          )}
                          {drawMode && <DrawLayer drawMode={drawMode} onDrawBox={handleDrawBox} />}
                          {renderDrawBoxes}
                        </div>
                      </Worker>
                    </div>
                  </div>
                  <div
                    className="w-1 hover:bg-gray-300 cursor-col-resize active:bg-gray-400 transition-colors"
                    onMouseDown={handleMouseDown}
                  />
                </>
              )}
              <div style={{ width: pdfUrl ? `${100 - viewerWidth}%` : '100%' }}>
                <div className="h-full rounded-xl bg-muted/50 p-4 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4" ref={messagesEndRef}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-50">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach PDF"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (inputValue.trim()) {
                              const newMessage: Message = {
                                id: Math.random().toString(),
                                content: inputValue.trim(),
                                role: 'user',
                                timestamp: new Date(),
                              };
                              setMessages((prev) => [...prev, newMessage]);
                              setInputValue('');
                            }
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={() => {
                          if (inputValue.trim()) {
                            const newMessage: Message = {
                              id: Math.random().toString(),
                              content: inputValue.trim(),
                              role: 'user',
                              timestamp: new Date(),
                            };
                            setMessages((prev) => [...prev, newMessage]);
                            setInputValue('');
                          }
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-left flex-wrap gap-2">
                      {exampleQuestions.map((question, index) => (
                        <button
                          key={index}
                          className="px-3 py-1.5 text-sm text-foreground bg-muted/50 hover:bg-muted rounded-full transition-colors"
                          onClick={() => handleExampleClick(question)}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

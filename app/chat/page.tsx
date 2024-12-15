"use client"

import { Button } from "@/components/ui/button"
import { PaperclipIcon, SendHorizontal } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputMessage])

  const handleSend = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help! Let me know what you'd like to work on.",
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1000)

    setInputMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">What can I help you ship?</h2>
          </div>
          
          <div className="flex flex-col flex-1 border rounded-lg bg-background">
            {/* Chat messages area */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Textarea 
                  ref={textareaRef}
                  placeholder="Ask a question..." 
                  className="flex-1 min-h-[40px] max-h-[200px] resize-none py-2"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />
                <Button onClick={handleSend}>
                  <SendHorizontal className="h-4 w-4 -rotate-45" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setInputMessage("Generate an onboarding form")}
                >
                  Generate an onboarding form
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setInputMessage("How can I structure LLM output?")}
                >
                  How can I structure LLM output?
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setInputMessage("Write code to implement a min heap")}
                >
                  Write code to implement a min heap
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

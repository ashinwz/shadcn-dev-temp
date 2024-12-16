'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { useState } from "react"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

export default function DocsTutorialsPage() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      annotationPlugin: {
        enableAnnotation: true,
      },
    },
  })
  const [pdfError, setPdfError] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold">Tutorials</h1>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
              <div className="h-full w-full p-4">
                {pdfError ? (
                  <div className="flex h-full items-center justify-center text-red-500">
                    {pdfError}
                  </div>
                ) : (
                  <Viewer
                    fileUrl="/docs/CN117396465A-4-6.pdf"
                    plugins={[defaultLayoutPluginInstance]}
                    onError={(error) => setPdfError(error.message)}
                    defaultScale={1.2}
                  />
                )}
              </div>
            </Worker>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

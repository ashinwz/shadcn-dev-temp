"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export function AppHeader() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)
  
  const breadcrumbs = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/')
    const isLast = index === paths.length - 1
    const title = path.charAt(0).toUpperCase() + path.slice(1)
    
    return {
      title,
      href,
      isLast
    }
  })

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background/80 backdrop-blur-sm border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center justify-between gap-2 px-4 w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="flex items-center space-x-1">
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                    )}
                    <span className={`flex items-center ${breadcrumb.isLast ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                      {breadcrumb.isLast ? (
                        breadcrumb.title
                      ) : (
                        <a href={breadcrumb.href} className="hover:underline">
                          {breadcrumb.title}
                        </a>
                      )}
                    </span>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="h-6" />
    </>
  )
}

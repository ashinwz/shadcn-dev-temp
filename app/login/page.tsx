"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { toast } from "sonner"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultEmail?: string
  defaultPassword?: string
}

function UserAuthForm({ className, defaultEmail, defaultPassword, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false)
  const [emailOrUsername, setEmailOrUsername] = useState(defaultEmail || "")
  const [password, setPassword] = useState(defaultPassword || "")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Check if input is email or username
      const isEmail = emailOrUsername.includes('@')
      const credentials = isEmail 
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password }

      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
        callbackUrl,
      })

      if (!result?.ok) {
        toast.error(result?.error || "Failed to sign in")
        return
      }

      toast.success("Signed in successfully")
      window.location.href = callbackUrl
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsGithubLoading(true)
    try {
      await signIn("github", {
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error("GitHub login error:", error)
      toast.error("GitHub login failed")
      setIsGithubLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="emailOrUsername">Email or Username</Label>
            <Input
              id="emailOrUsername"
              placeholder="name@example.com or username"
              type="text"
              autoCapitalize="none"
              autoComplete="email username"
              autoCorrect="off"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="********"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading || isGithubLoading} onClick={handleGithubLogin}>
        {isGithubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  )
}

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [registrationValues, setRegistrationValues] = useState<{ email: string; password: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  
  // Check if the callback URL contains a reset token
  const resetToken = callbackUrl 
    ? new URL(decodeURIComponent(callbackUrl)).searchParams.get("token") 
    : null
  const isResetPassword = Boolean(resetToken)

  const handleRegistrationSuccess = (email: string, password: string) => {
    setRegistrationValues({ email, password })
    setIsRegistering(false)
  }

  const handleForgotPasswordSuccess = (email: string) => {
    setIsForgotPassword(false)
    toast.success("Check your email for reset instructions")
  }

  const handleResetPasswordSuccess = () => {
    toast.success("Password reset successfully")
    router.push("/login")
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          Acme Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {isResetPassword
                  ? "Reset password"
                  : isForgotPassword
                  ? "Reset password"
                  : isRegistering
                  ? "Register"
                  : "Sign in"}
              </CardTitle>
              <CardDescription>
                {isResetPassword
                  ? "Enter your new password below"
                  : isForgotPassword
                  ? "Enter your email to receive reset instructions"
                  : isRegistering
                  ? "Create an account to get started"
                  : "Choose your preferred sign in method"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isResetPassword ? (
                <ResetPasswordForm token={resetToken!} onSuccess={handleResetPasswordSuccess} />
              ) : isForgotPassword ? (
                <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
              ) : isRegistering ? (
                <RegisterForm onSuccess={handleRegistrationSuccess} />
              ) : (
                <UserAuthForm defaultEmail={registrationValues?.email} defaultPassword={registrationValues?.password} />
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                {isResetPassword ? (
                  "Remember your password?"
                ) : isForgotPassword ? (
                  "Remember your password?"
                ) : isRegistering ? (
                  "Already have an account?"
                ) : (
                  "Don't have an account?"
                )}{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    if (isResetPassword || isForgotPassword) {
                      router.push("/login")
                    } else {
                      setIsRegistering(!isRegistering)
                      setRegistrationValues(null)
                    }
                  }}
                >
                  {isResetPassword || isForgotPassword
                    ? "Sign in"
                    : isRegistering
                    ? "Sign in"
                    : "Register"}
                </Button>
              </div>
              {!isRegistering && !isForgotPassword && !isResetPassword && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-primary underline-offset-4 hover:underline"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

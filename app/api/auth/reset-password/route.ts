import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Generate a reset token
    const resetToken = Math.random().toString(36).substring(2, 15)

    // Store the reset token and expiry in the database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      },
    })

    // Create the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // Send the reset email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login?callbackUrl=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`)}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })

    return NextResponse.json({ message: "Reset email sent" })
  } catch (error) {
    console.error("[RESET_PASSWORD]", error)
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    )
  }
}

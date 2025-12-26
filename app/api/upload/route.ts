// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { mkdir, writeFile } from "fs/promises"
import crypto from "crypto"

export const runtime = "nodejs"

function detectFolder(mime: string) {
  if (mime.startsWith("image/")) return "images"
  if (mime.startsWith("video/")) return "videos"
  if (mime === "application/pdf") return "pdfs"
  return "files"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const folder = detectFolder(file.type)

    // 프로젝트 내부 public/uploads 에 저장
    const baseDir = path.join(process.cwd(), "public", "uploads")
    const uploadDir = path.join(baseDir, folder)
    await mkdir(uploadDir, { recursive: true })

    const ext = path.extname(file.name || "").toLowerCase()
    const safeName = `${crypto.randomUUID()}${ext || ""}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const savedPath = path.join(uploadDir, safeName)
    await writeFile(savedPath, buffer)

    return NextResponse.json({
      url: `/uploads/${folder}/${safeName}`,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

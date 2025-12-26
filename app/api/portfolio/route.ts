// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { mkdir, readFile, writeFile } from "fs/promises"

export const runtime = "nodejs"

const DEFAULT_DATA = {
  profile: {
    name: "홍길동",
    title: "Full Stack Developer",
    email: "developer@example.com",
    phone: "010-1234-5678",
    location: "서울, 대한민국",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    profileImage: "",
  },
  projects: [],
}

function getDataPath() {
  const p = process.env.PORTFOLIO_DATA_PATH ?? "data/portfolio.json"
  return path.join(process.cwd(), p)
}

export async function GET() {
  const filePath = getDataPath()
  try {
    const raw = await readFile(filePath, "utf-8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json(DEFAULT_DATA)
  }
}

export async function PUT(req: NextRequest) {
  const filePath = getDataPath()
  const dir = path.dirname(filePath)

  const body = await req.json()

  if (!body?.profile || !Array.isArray(body?.projects)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  await mkdir(dir, { recursive: true })
  await writeFile(filePath, JSON.stringify(body, null, 2), "utf-8")

  return NextResponse.json({ ok: true })
}

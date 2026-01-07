import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises"; // 🚩 이거 꼭 확인
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 1. 저장 경로 설정 (EC2 볼륨과 연결된 /app/public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // 2. 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. 파일명 생성 (한글 깨짐 방지: 타임스탬프 기반)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.name);
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // 4. 🔥 스트리밍 저장 (메모리 600MB 점유 안 함)
    // Web Stream을 Node.js Stream으로 변환해서 파이프라인으로 연결
    const nodeStream = Readable.fromWeb(file.stream() as any);
    const writeStream = fs.createWriteStream(filePath);

    // pipeline은 쓰기가 완전히 끝날 때까지 여기서 기다려줌(await)
    await pipeline(nodeStream, writeStream);

    // 5. 성공 응답
    const fileUrl = `/uploads/${filename}`;
    console.log("파일 저장 완료:", filePath); // 서버 로그에서 경로 확인용

    return NextResponse.json({
      url: fileUrl,
      filename: filename
    });

  } catch (error) {
    console.error("파일 업로드 에러 상세:", error);
    return NextResponse.json({ error: "서버에 파일 저장 실패" }, { status: 500 });
  }
}
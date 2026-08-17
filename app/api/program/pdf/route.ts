import { NextResponse } from "next/server";
import { readClient } from "@/lib/sanity";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const runtime = "nodejs";

type ProgramActivity = {
  nume: string;
  ora: string;
};

type ProgramDay = {
  data: string;
  activitati: ProgramActivity[];
};

type ProgramPayload = Record<string, ProgramDay>;

type ProgramActivityDoc = {
  nume?: string;
  ora?: string;
};

type ProgramDayDoc = {
  dayKey?: string;
  data?: string;
  activitati?: ProgramActivityDoc[];
};

type ProgramDoc = {
  days?: ProgramDayDoc[];
};

const PROGRAM_DOC_ID = "program-liturgic";
const programJsonPath = path.join(process.cwd(), "public", "data", "program.json");
const templatePath = path.join(process.cwd(), "templates", "program.typ");
const typstBin = process.env.TYPST_BIN ?? "typst";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeActivity = (value: unknown): ProgramActivity | null => {
  if (!isRecord(value)) return null;
  if (typeof value.nume !== "string") return null;
  return {
    nume: value.nume,
    ora: typeof value.ora === "string" ? value.ora : "",
  };
};

const toPayload = (days: ProgramDayDoc[] | undefined): ProgramPayload => {
  const payload: ProgramPayload = {};
  if (!Array.isArray(days)) return payload;
  for (const day of days) {
    if (!day || typeof day.dayKey !== "string") continue;
    const activitati = Array.isArray(day.activitati)
      ? day.activitati
          .map(normalizeActivity)
          .filter((act): act is ProgramActivity => act !== null)
      : [];
    payload[day.dayKey] = {
      data: typeof day.data === "string" ? day.data : "",
      activitati,
    };
  }
  return payload;
};

async function readProgramFromSanity(): Promise<ProgramPayload | null> {
  const doc = await readClient.fetch<ProgramDoc | null>(
    `*[_type == "program" && _id == $id][0]{days}`,
    { id: PROGRAM_DOC_ID },
  );
  if (!doc) return null;
  const payload = toPayload(doc.days);
  return Object.keys(payload).length > 0 ? payload : null;
}

async function readProgram(): Promise<ProgramPayload> {
  try {
    const sanityPayload = await readProgramFromSanity();
    if (sanityPayload) return sanityPayload;
  } catch (error) {
    console.error("[program-pdf] Failed to read from Sanity", error);
  }
  const raw = await fs.readFile(programJsonPath, "utf8");
  return JSON.parse(raw) as ProgramPayload;
}

function compileTypst(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Compile the template into program.pdf, resolving file access from cwd.
    const child = spawn(typstBin, ["compile", "--root", cwd, "program.typ", "program.pdf"], {
      cwd,
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`typst exited with code ${code}: ${stderr}`));
    });
  });
}

export async function GET() {
  let workDir: string | null = null;
  try {
    const program = await readProgram();

    // Isolated working directory so Typst can only read the files we place here.
    workDir = await fs.mkdtemp(path.join(os.tmpdir(), "program-typst-"));
    const template = await fs.readFile(templatePath, "utf8");
    await Promise.all([
      fs.writeFile(path.join(workDir, "program.typ"), template, "utf8"),
      fs.writeFile(
        path.join(workDir, "data.json"),
        JSON.stringify(program),
        "utf8",
      ),
    ]);

    await compileTypst(workDir);

    const pdf = await fs.readFile(path.join(workDir, "program.pdf"));
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="program-liturgic.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[program-pdf] Failed to generate PDF", error);
    return NextResponse.json(
      { error: "Nu s-a putut genera programul PDF." },
      { status: 500 },
    );
  } finally {
    if (workDir) {
      await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

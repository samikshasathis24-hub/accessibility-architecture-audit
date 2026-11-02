import sqlite3
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Accessibility Audit API",
    description="Backend for managing accessibility audit findings.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = Path(__file__).resolve().parent.parent / "audit.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_connection()
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS findings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            severity TEXT NOT NULL,
            page_url TEXT NOT NULL,
            evidence TEXT NOT NULL,
            recommendation TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Open'
        )
        """
    )
    connection.commit()
    connection.close()


initialize_database()


class Finding(BaseModel):
    title: str
    description: str
    severity: str
    page_url: str
    evidence: str
    recommendation: str


class FindingUpdate(BaseModel):
    status: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/findings")
def get_findings():
    connection = get_connection()
    rows = connection.execute(
        "SELECT * FROM findings ORDER BY id DESC"
    ).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@app.post("/findings")
def create_finding(finding: Finding):
    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO findings
        (title, description, severity, page_url, evidence, recommendation)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            finding.title,
            finding.description,
            finding.severity,
            finding.page_url,
            finding.evidence,
            finding.recommendation,
        ),
    )
    connection.commit()
    finding_id = cursor.lastrowid
    connection.close()
    return {"message": "Finding created", "id": finding_id}


@app.put("/findings/{finding_id}")
def update_finding(finding_id: int, finding: FindingUpdate):
    allowed_statuses = ["Open", "In Progress", "Resolved"]
    if finding.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    connection = get_connection()
    cursor = connection.execute(
        "UPDATE findings SET status = ? WHERE id = ?",
        (finding.status, finding_id),
    )
    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Finding not found")
    return {"message": "Finding updated"}


@app.delete("/findings/{finding_id}")
def delete_finding(finding_id: int):
    connection = get_connection()
    cursor = connection.execute(
        "DELETE FROM findings WHERE id = ?",
        (finding_id,),
    )
    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Finding not found")
    return {"message": "Finding deleted"}
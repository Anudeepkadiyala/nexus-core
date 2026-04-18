import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "memory.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
    )
    """)

    conn.commit()
    conn.close()


def save_memory(data: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO memory (content) VALUES (?)", (data,))
    
    conn.commit()
    conn.close()


def get_memory():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT content FROM memory")
    rows = cursor.fetchall()

    conn.close()

    return [row[0] for row in rows]
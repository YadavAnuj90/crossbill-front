from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_invoice_pdf_generation() -> None:
    response = client.post(
        "/api/v1/invoice/generate",
        json={
            "invoice_number": "INV-1001",
            "customer": "John Doe",
            "date": "2026-08-03",
            "items": [{"name": "Laptop", "qty": 2, "price": 50000}],
        },
    )
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/pdf")

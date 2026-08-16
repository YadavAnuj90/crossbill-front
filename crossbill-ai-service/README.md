# CrossBill AI

CrossBill AI is a production-ready FastAPI service for generating professional PDF documents from JSON payloads.

## Features

- REST endpoints for invoice, offer letter, attendance, and payslip generation
- Jinja2-based HTML templates rendered to PDF with WeasyPrint
- Pydantic v2 request validation
- Structured logging with Loguru
- Swagger UI enabled by default
- Docker and Docker Compose support

## Installation

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Docker setup

```bash
docker compose up --build
```

## Running locally

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API examples

### Health check

```bash
curl http://localhost:8000/api/v1/health
```

### Generate invoice PDF

```bash
curl -X POST http://localhost:8000/api/v1/invoice/generate \
  -H "Content-Type: application/json" \
  -d '{"invoice_number":"INV-1001","customer":"John Doe","date":"2026-08-03","items":[{"name":"Laptop","qty":2,"price":50000}]}' \
  --output invoice.pdf
```

## Swagger UI

Open http://localhost:8000/docs

## Folder explanation

- app/api/v1: route definitions for each document type
- app/core: settings and logging infrastructure
- app/services: PDF and template rendering services
- app/schemas: Pydantic request models
- app/templates: Jinja2 HTML templates
- app/static: CSS, fonts, and images
- tests: automated tests

## Best practices

- Environment variables are used for configuration
- Templates and static assets are stored separately
- PDF generation is centralized in a reusable service class
- New document types can be added by creating a schema and HTML template

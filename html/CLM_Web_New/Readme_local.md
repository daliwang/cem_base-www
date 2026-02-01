# CLM Web Service (Local)

This repository is a static site plus CGI scripts used to browse CLM call graphs
and variables. The default landing page is `html/CLM_Web_New/CLM_Web.html`.

## Run locally (macOS)

1. Ensure scripts are executable:
   - `chmod +x run_local.sh cgi-bin/*.py`
2. Start the local CGI server:
   - `bash run_local.sh`
   - Optional port: `PORT=8080 bash run_local.sh`
3. Open:
   - `http://localhost:8000/` (redirects to `CLM_Web_New/CLM_Web.html`)

## Project layout

- `html/CLM_Web_New/CLM_Web.html`: main UI for the "CLM Web New" site.
- `html/CLM_call_graph/`: CSV data for call-graph views.
- `html/CLM_Components_New/`: per-version component data used by CGI.
- `cgi-bin/`: backend endpoints used by the UI.

## Notes

- CGI scripts use repo-relative paths for data under `html/`.
- Visitor logs are stored in `html/Visitor_Info/Traffic.csv` and
  `html/Visitor_Info/Location_Stats.csv` and are ignored by git.

from pathlib import Path
import os
import pandas as pd
from pypdf import PdfReader

root = Path.cwd()
print('WORKSPACE:', root)
print('FILES:')
for f in sorted(root.iterdir()):
    if f.is_file() and f.suffix.lower() in {'.pdf', '.xlsx', '.xls'}:
        print(f.name)

pdf_files = sorted([p for p in root.glob('*.pdf')])
if pdf_files:
    pdf_path = pdf_files[0]
    print(f'\nPDF: {pdf_path.name}')
    reader = PdfReader(str(pdf_path))
    print(f'PAGES: {len(reader.pages)}')
    for i, page in enumerate(reader.pages, 1):
        text = page.extract_text() or ''
        print(f'--- PAGE {i} ---')
        print(text[:12000])
        print('\n')

xlsx_files = sorted([p for p in root.glob('*.xlsx')])
for xlsx_path in xlsx_files:
    print(f'--- WORKBOOK {xlsx_path.name} ---')
    xl = pd.ExcelFile(xlsx_path)
    print('SHEETS:', xl.sheet_names)
    for sheet in xl.sheet_names:
        df = pd.read_excel(xlsx_path, sheet_name=sheet)
        print(f'[{sheet}] shape={df.shape}')
        print(df.head(10).to_string(index=False))
        print('COLUMNS:', list(df.columns))
        print('NULL COUNT:')
        print(df.isna().sum().to_string())
        print('DUPLICATE ROWS:', int(df.duplicated().sum()))
        print('---')

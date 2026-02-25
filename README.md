# Germline SNV Benchmark Platform

A **React + JS platform** for visualizing germline SNV benchmarking results, comparing **precision, recall, and F1** across pipelines. Designed for researchers to explore, filter, and analyze benchmark datasets.

---

## Features

- Display **benchmark metrics** (F1, Recall, Precision) per pipeline.
- **Filter by**:  
  - Variant **Type** (SNP, INDEL)  
  - **Filter status** (ALL, PASS)  
  - **Caller**  
  - **Truthset**  
  - **Regions**
- **Multiple metric selection** to compare metrics in the same chart.
- Choose between **Bar plots** and **Dot plots**.
- Responsive **sidebar / filter bar** for quick selection.
- Detailed **metrics table** for selected pipelines.
- Supports **JSON input data**, preprocessed from CSV.

---

## Data Format

Input data should be a JSON array of objects like:

```json
{
  "Sample": "NA12886",
  "Benchmarking": "happy",
  "Truthset": "Full-TS",
  "Regions": "UR",
  "Pipeline": "NFCS9-NGC",
  "S": "NA12886",
  "Caller": "DVnorm",
  "File": "NFCS9-NGC_NA12886_DVnorm.NA12886.DVnorm.summary.csv",
  "Type": "SNP",
  "Filter": "ALL",
  "TP_base": 30845.0,
  "TP": 26678.0,
  "FN": 4167.0,
  "TP_call": 2165930.0,
  "FP": 11830.0,
  "UNK": 2127412.0,
  "FP_gt": 332.0,
  "FP_al": 301.0,
  "Recall": 0.8649,
  "Precision": 0.69287,
  "Frac_NA": 0.9822,
  "F1": 0.76939,
  "TRUTH_TiTv_ratio": 2.0542,
  "QUERY_TiTv_ratio": 2.0020,
  "TRUTH_het_hom_ratio": 1.9159,
  "QUERY_het_hom_ratio": 1.5370,
  "Threshold": "NA"
}
```

## Installation

```bash
# Clone the repository
git clone https://github.com/<username>/germline-snv-benchmark.git
cd germline-snv-benchmark

# Install dependencies
yarn install
# or
npm install

# Run the development server
yarn dev
# or
npm run dev
```

## Usage

1. Place your JSON benchmark data in `public/summary.json`.  
2. Open the web app in your browser at [http://localhost:5173](http://localhost:5173).  
3. Use the **Filters Bar** at the top to refine the view:  
   - **Filter**: ALL / PASS  
   - **Variant Type**: SNP / INDEL  
   - **Caller**: select from available callers in the dataset  
   - **Truthset**: select from available truth sets in the dataset  
   - **Regions**: select from available regions in the dataset  
   - **Metrics**: select one or more of F1, Recall, Precision  
   - **Plot Type**: choose between Bar plot or Dot plot  

4. Click on a **pipeline in the sidebar** to view:  
   - A detailed **chart** showing the selected metric(s)  
   - A **metrics table** with all values for the selected pipeline  

> **Tip:** Selecting multiple metrics will show them in different colors on the chart for easy comparison.

## CSV to JSON Conversion

The app requires JSON input data. Use the included Python script `csv_to_json.py` to convert CSV benchmark files into the required JSON format.

```bash
# Convert a CSV file to JSON
python3 csv_to_json.py -i benchmark.csv -o summary.json
```

## Dependencies

This project uses the following libraries and frameworks:

- [React](https://reactjs.org/) – Frontend framework for building UI components  
- [Chart.js](https://www.chartjs.org/) – Charting library for rendering graphs  
- [react-chartjs-2](https://react-chartjs-2.js.org/) – React wrapper for Chart.js  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling  
- [Vite](https://vitejs.dev/) – Development server and build tool  

> **Note:** All dependencies are listed in `package.json` and installed via `yarn install` or `npm install`.

## Project Structure

```text
├── public/
│   └── summary.json          # Benchmark data in JSON format
├── src/
│   ├── components/
│   │   ├── BenchmarkChart.jsx      # Chart for a selected pipeline
│   │   ├── MetricsTable.jsx        # Table showing metrics for a selected pipeline
│   │   ├── PublicationFigure.jsx   # Chart of multiple pipelines / callers
│   │   ├── FiltersBar.jsx          # Top-right filter bar component
│   │   └── Sidebar.jsx             # Pipeline selection sidebar
│   ├── App.jsx                     # Main application component
│   └── main.jsx                    # React entry point
├── csv_to_json.py                   # CSV → JSON converter script
├── package.json                     # Project dependencies and scripts
├── vite.config.js                   # Vite configuration
└── tailwind.config.js               # Tailwind CSS configuration
```
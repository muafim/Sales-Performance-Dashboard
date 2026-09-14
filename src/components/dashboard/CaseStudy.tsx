import { ArrowRight, Database, Github } from 'lucide-react';

const tools = ['Power BI', 'Excel', 'React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Vite'];
const questions = [
  'How does revenue change throughout the year?',
  'Which beverage brands generate the most revenue?',
  'Which states contribute the most sales?',
  'How does performance compare with monthly targets?',
];

export function CaseStudy() {
  return <section className="case-study" id="case-study" aria-labelledby="case-title">
    <div className="case-heading"><div><span className="section-kicker">BEHIND THE DASHBOARD</span><h2 id="case-title">From analysis to experience</h2></div><p>A portfolio case study in turning a Power BI report into a responsive, client-side analytics product.</p></div>
    <div className="case-grid"><div className="case-main"><h3>Project Overview</h3><p>This project explores beverage sales across time, brands, retailers, and U.S. states. It keeps the source report’s KPI definitions while adding a revenue-weighted average selling price and clearer target context.</p>
      <h3>Business Questions</h3><ul>{questions.map((question) => <li key={question}>{question}</li>)}</ul>
      <h3>Dashboard Features</h3><p>KPI monitoring, brand and month filters, geographic analysis, monthly trends, product ranking, and target comparisons—all calculated in the browser.</p>
    </div><div className="case-side"><h3>Data Workflow</h3><div className="workflow"><span><Database size={16} /> Excel dataset</span><ArrowRight size={15} /><span>Cleaning & transformation</span><ArrowRight size={15} /><span>Power BI analysis</span><ArrowRight size={15} /><span>React dashboard</span><ArrowRight size={15} /><span><Github size={16} /> GitHub Pages</span></div>
      <h3>Tools</h3><div className="tool-badges">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
      <p className="license-note">Public preview uses synthetic data. The original licensed workbook and PBIX are excluded from this repository.</p>
    </div></div>
  </section>;
}

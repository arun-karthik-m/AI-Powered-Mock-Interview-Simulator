
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  jobRole: string;
  interviewDate: string;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  questions: string[];
  answers: string[];
}

export const generatePdfReport = (data: ReportData): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add the report title
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // interview-blue
  doc.text('Interview Performance Report', 105, 15, { align: 'center' });
  
  // Add interview details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Position: ${data.jobRole}`, 20, 30);
  doc.text(`Date: ${data.interviewDate}`, 20, 38);
  doc.text(`Overall Score: ${data.overallScore}/100`, 20, 46);
  
  // Add a divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, 190, 50);
  
  // Add strengths section
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129); // interview-success
  doc.text('Strengths', 20, 60);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let yPosition = 68;
  data.strengths.forEach((strength, index) => {
    doc.text(`${index + 1}. ${strength}`, 25, yPosition);
    yPosition += 8;
  });
  
  // Add areas for improvement
  yPosition += 5;
  doc.setFontSize(16);
  doc.setTextColor(239, 68, 68); // interview-error
  doc.text('Areas for Improvement', 20, yPosition);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  yPosition += 8;
  data.improvements.forEach((improvement, index) => {
    doc.text(`${index + 1}. ${improvement}`, 25, yPosition);
    yPosition += 8;
  });
  
  // Add question and answer summary
  yPosition += 5;
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138); // interview-blue
  doc.text('Interview Questions & Answers', 20, yPosition);
  
  yPosition += 10;

  // Create table for questions and answers
  const tableColumn = ['Question', 'Your Answer'];
  const tableRows = data.questions.map((question, index) => {
    return [question, data.answers[index] || 'No answer provided'];
  });

  autoTable(doc, {
    startY: yPosition,
    head: [tableColumn],
    body: tableRows,
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 100 }
    },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'AI Interview Simulator - Confidential Report',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`Interview_Report_${data.jobRole.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

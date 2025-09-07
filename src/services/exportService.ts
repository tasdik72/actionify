// Simple client-side export functionality
export const exportToText = (data: any, selectedSections: string[]): string => {
  let content = `MEETING ANALYSIS REPORT\n`;
  content += `Generated: ${new Date().toLocaleDateString()}\n`;
  content += `File: ${data.metadata?.fileName || 'Unknown'}\n\n`;
  
  // Executive Summary
  if (selectedSections.includes('summary')) {
    content += `EXECUTIVE SUMMARY\n`;
    content += `${data.summary?.executive || 'No summary available'}\n\n`;
  
    // Key Points
    content += `KEY POINTS\n`;
    data.summary?.keyPoints?.forEach((point: string, index: number) => {
      content += `${index + 1}. ${point}\n`;
    });
    content += `\n`;
  }
  
  // Action Items
  if (selectedSections.includes('actionItems')) {
    content += `ACTION ITEMS\n`;
    data.actionItems?.forEach((item: any, index: number) => {
      content += `${index + 1}. ${item.task}\n`;
      content += `   Assignee: ${item.assignee}\n`;
      content += `   Deadline: ${item.deadline}\n`;
      content += `   Priority: ${item.priority}\n\n`;
    });
  }
  
  // Decisions
  if (selectedSections.includes('decisions')) {
    content += `DECISIONS MADE\n`;
    data.decisions?.forEach((decision: any, index: number) => {
      content += `${index + 1}. ${decision.decision}\n`;
      content += `   Category: ${decision.category}\n`;
      content += `   Participants: ${decision.participants?.join(', ')}\n\n`;
    });
  }

  // Transcript
  if (selectedSections.includes('transcript') && data.transcript?.length) {
    content += `FULL TRANSCRIPT\n`;
    data.transcript.forEach((utterance: any) => {
      const speaker = utterance.speaker || 'Unknown';
      const text = utterance.text || '';
      const timestamp = utterance.startTime ? `[${Math.floor(utterance.startTime / 60)}:${(utterance.startTime % 60).toString().padStart(2, '0')}] ` : '';
      content += `${timestamp}${speaker}: ${text}\n`;
    });
    content += `\n`;
  }

  // Sentiment Analysis
  if (selectedSections.includes('sentiment') && (data.sentiment?.overall || data.sentiment?.timeline?.length || data.sentiment?.speakers)) {
    content += `SENTIMENT ANALYSIS\n`;
    if (data.sentiment.overall) {
      content += `  Overall Sentiment:\n`;
      content += `    Primary Tone: ${data.sentiment.overall.sentiment || 'N/A'}\n`;
      content += `    Score: ${(data.sentiment.overall.score * 100).toFixed(0)}%\n`;
      content += `    Confidence: ${(data.sentiment.overall.confidence * 100).toFixed(0)}%\n`;
    }
    if (data.sentiment.timeline?.length) {
      content += `  Sentiment Timeline (Highlights):\n`;
      data.sentiment.timeline.slice(0, 5).forEach((point: any) => {
        const time = `${Math.floor(point.time / 60)}:${(point.time % 60).toString().padStart(2, '0')}`;
        content += `    - At ${time}: Sentiment ${Math.round(point.sentiment * 100)}%${point.topics?.length ? ` (Topics: ${point.topics.join(', ')})` : ''}\n`;
      });
    }
    if (data.sentiment.speakers) {
      content += `  Sentiment by Speaker:\n`;
      Object.entries(data.sentiment.speakers).forEach(([speaker, stats]: [string, any]) => {
        content += `    - ${speaker}: Avg Sentiment ${Math.round(stats.averageSentiment * 100)}%, Engagement ${Math.round(stats.engagement * 100)}%, Dominance ${stats.dominance}%\n`;
      });
    }
    content += `\n`;
  }
  
  return content;
};

export const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any, selectedSections: string[]): string => {
  const exportedData: any = { metadata: data.metadata };

  if (selectedSections.includes('summary')) {
    exportedData.summary = data.summary;
  }
  if (selectedSections.includes('actionItems')) {
    exportedData.actionItems = data.actionItems;
  }
  if (selectedSections.includes('decisions')) {
    exportedData.decisions = data.decisions;
  }
  if (selectedSections.includes('transcript')) {
    exportedData.transcript = data.transcript;
  }
  if (selectedSections.includes('sentiment')) {
    exportedData.sentiment = data.sentiment;
  }

  return JSON.stringify(exportedData, null, 2);
};

export const downloadJSONFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Markdown export
export const exportToMarkdown = (data: any, selectedSections: string[]): string => {
  let md = `# Meeting Analysis Report\n\n`;
  md += `**Date:** ${new Date().toLocaleDateString()}  \\\n`;
  md += `**File:** ${data.metadata?.fileName || 'Unknown'}\n\n`;

  if (selectedSections.includes('summary')) {
    md += `## Executive Summary\n`;
    md += `${data.summary?.executive || 'No summary available.'}\n\n`;

    if (data.summary?.keyPoints?.length) {
      md += `## Key Points\n`;
      data.summary.keyPoints.forEach((p: string) => {
        md += `- ${p}\n`;
      });
      md += `\n`;
    }
  }

  if (selectedSections.includes('actionItems') && data.actionItems?.length) {
    md += `## Action Items\n`;
    data.actionItems.forEach((item: any, idx: number) => {
      md += `${idx + 1}. ${item.task}  \\\n`;
      md += `   - Assignee: ${item.assignee}  \\\n`;
      md += `   - Deadline: ${item.deadline}  \\\n`;
      md += `   - Priority: ${item.priority}\n`;
    });
    md += `\n`;
  }

  if (selectedSections.includes('decisions') && data.decisions?.length) {
    md += `## Decisions\n`;
    data.decisions.forEach((d: any, idx: number) => {
      md += `${idx + 1}. ${d.decision}  \\\n`;
      md += `   - Category: ${d.category}  \\\n`;
      md += `   - Participants: ${d.participants?.join(', ')}\n`;
    });
    md += `\n`;
  }

  if (selectedSections.includes('transcript') && data.transcript?.length) {
    md += `## Full Transcript\n`;
    data.transcript.forEach((utterance: any) => {
      const speaker = utterance.speaker || 'Unknown';
      const text = utterance.text || '';
      const timestamp = utterance.startTime ? `[${Math.floor(utterance.startTime / 60)}:${(utterance.startTime % 60).toString().padStart(2, '0')}] ` : '';
      md += `- **${speaker}**: ${timestamp}${text}\n`;
    });
    md += `\n`;
  }

  if (selectedSections.includes('sentiment') && (data.sentiment?.overall || data.sentiment?.timeline?.length || data.sentiment?.speakers)) {
    md += `## Sentiment Analysis\n`;
    if (data.sentiment.overall) {
      md += `### Overall Sentiment\n`;
      md += `- Primary Tone: ${data.sentiment.overall.sentiment || 'N/A'}  \\\n`;
      md += `- Score: ${(data.sentiment.overall.score * 100).toFixed(0)}%  \\\n`;
      md += `- Confidence: ${(data.sentiment.overall.confidence * 100).toFixed(0)}%\n`;
    }
    if (data.sentiment.timeline?.length) {
      md += `### Sentiment Timeline (Highlights)\n`;
      data.sentiment.timeline.slice(0, 5).forEach((point: any) => {
        const time = `${Math.floor(point.time / 60)}:${(point.time % 60).toString().padStart(2, '0')}`;
        md += `- At ${time}: Sentiment ${Math.round(point.sentiment * 100)}%${point.topics?.length ? ` (Topics: ${point.topics.join(', ')})` : ''}\n`;
      });
    }
    if (data.sentiment.speakers) {
      md += `### Sentiment by Speaker\n`;
      Object.entries(data.sentiment.speakers).forEach(([speaker, stats]: [string, any]) => {
        md += `- **${speaker}**: Avg Sentiment ${Math.round(stats.averageSentiment * 100)}%, Engagement ${Math.round(stats.engagement * 100)}%, Dominance ${stats.dominance}%\n`;
      });
    }
    md += `\n`;
  }

  return md;
};

export const downloadMarkdownFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF export (basic text report)
import { jsPDF } from 'jspdf';

export const exportToPDF = (data: any, selectedSections: string[]): jsPDF => {
  const doc = new jsPDF();
  let y = 10;

  const writeLine = (text: string, size = 12, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 180);
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 15, y);
      y += 7;
    });
    y += 3;
  };

  writeLine('Meeting Analysis Report', 16, true);
  writeLine(`Date: ${new Date().toLocaleDateString()}`);
  writeLine(`File: ${data.metadata?.fileName || 'Unknown'}`);

  if (selectedSections.includes('summary')) {
    writeLine('Executive Summary', 14, true);
    writeLine(data.summary?.executive || 'No summary available.');

    if (data.summary?.keyPoints?.length) {
      writeLine('Key Points', 14, true);
      data.summary.keyPoints.forEach((p: string, idx: number) => writeLine(`${idx + 1}. ${p}`));
    }
  }

  if (selectedSections.includes('actionItems') && data.actionItems?.length) {
    writeLine('Action Items', 14, true);
    data.actionItems.forEach((item: any, idx: number) => {
      writeLine(`${idx + 1}. ${item.task}`, 12, true);
      writeLine(`Assignee: ${item.assignee}`);
      writeLine(`Deadline: ${item.deadline}`);
      writeLine(`Priority: ${item.priority}`);
    });
  }

  if (selectedSections.includes('decisions') && data.decisions?.length) {
    writeLine('Decisions', 14, true);
    data.decisions.forEach((d: any, idx: number) => {
      writeLine(`${idx + 1}. ${d.decision}`, 12, true);
      writeLine(`Category: ${d.category}`);
      writeLine(`Participants: ${d.participants?.join(', ')}`);
    });
  }

  if (selectedSections.includes('transcript') && data.transcript?.length) {
    writeLine('Full Transcript', 14, true);
    data.transcript.forEach((utterance: any) => {
      const speaker = utterance.speaker || 'Unknown';
      const text = utterance.text || '';
      const timestamp = utterance.startTime ? `[${Math.floor(utterance.startTime / 60)}:${(utterance.startTime % 60).toString().padStart(2, '0')}] ` : '';
      writeLine(`- ${speaker}: ${timestamp}${text}`);
    });
  }

  if (selectedSections.includes('sentiment') && (data.sentiment?.overall || data.sentiment?.timeline?.length || data.sentiment?.speakers)) {
    writeLine('Sentiment Analysis', 14, true);
    if (data.sentiment.overall) {
      writeLine('Overall Sentiment', 12, true);
      writeLine(`Primary Tone: ${data.sentiment.overall.sentiment || 'N/A'}`);
      writeLine(`Score: ${(data.sentiment.overall.score * 100).toFixed(0)}%`);
      writeLine(`Confidence: ${(data.sentiment.overall.confidence * 100).toFixed(0)}%`);
    }
    if (data.sentiment.timeline?.length) {
      writeLine('Sentiment Timeline (Highlights)', 12, true);
      data.sentiment.timeline.slice(0, 5).forEach((point: any) => {
        const time = `${Math.floor(point.time / 60)}:${(point.time % 60).toString().padStart(2, '0')}`;
        writeLine(`- At ${time}: Sentiment ${Math.round(point.sentiment * 100)}%${point.topics?.length ? ` (Topics: ${point.topics.join(', ')})` : ''}`);
      });
    }
    if (data.sentiment.speakers) {
      writeLine('Sentiment by Speaker', 12, true);
      Object.entries(data.sentiment.speakers).forEach(([speaker, stats]: [string, any]) => {
        writeLine(`- ${speaker}: Avg Sentiment ${Math.round(stats.averageSentiment * 100)}%, Engagement ${Math.round(stats.engagement * 100)}%, Dominance ${stats.dominance}%`);
      });
    }
  }

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};